import { firestore } from '../../firebase/client/firebase-api';
import * as T from '../types';
import * as O from '../../utils/observable';
import { toUniqueValues, toLookup, toUniqueItems } from '../../utils/object';

export class ConversationApi {

    // Get Conversation
    async getConversation_byName(conversationName: string): Promise<T.ChatConversation> {
        const c = await this.getConversationData_byName(conversationName);
        return await this.getConversation_orMoreMessages(c as T.ChatConversation);
    }

    async getConversation_byId(conversationId: T.ChatConversationId): Promise<T.ChatConversation> {
        const c = await this.getConversationData_byId(conversationId);
        return await this.getConversation_orMoreMessages(c as T.ChatConversation);
    }

    async getNewMessages(conversation: T.ChatConversation): Promise<T.ChatConversation> {
        return await this.getConversation_orMoreMessages(conversation);
    }

    async getMoreMessages(conversation: T.ChatConversation): Promise<T.ChatConversation> {
        return await this.getConversation_orMoreMessages(conversation, true);
    }

    private async getConversation_orMoreMessages(conversation: T.ChatConversation, getOlderMessages = false): Promise<T.ChatConversation> {
        console.log('getConversation_orMoreMessages START');

        if (!conversation) { return null; }

        console.log('getConversation_orMoreMessages: Get messages',
            'conversation.id', conversation.id,
            'conversation.name', conversation.name,
        );

        const oldMessages = conversation.messages || [];
        const olderMessages = (!oldMessages.length || getOlderMessages) && await this.getMessages_before(conversation.id, oldMessages.length && oldMessages[oldMessages.length - 1]) || [];
        const newerMessages = oldMessages.length && await this.getMessages_after(conversation.id, oldMessages.length && oldMessages[0]) || [];
        const allMessages = [...newerMessages, ...oldMessages, ...olderMessages];

        console.log('getConversation_orMoreMessages: Get messages END',
            'newerMessages.length', newerMessages.length,
            'oldMessages.length', oldMessages.length,
            'olderMessages.length', olderMessages.length,
        );

        return this.populateConversation(conversation, allMessages);
    }

    private async populateConversation(oldConversation: T.ChatConversation, allMessages: T.ChatMessage_DataWithId[]): Promise<T.ChatConversation> {

        const allAuthorIds = toUniqueValues(allMessages.map(x => x.authorId));

        const oldAuthors = oldConversation.authors || [];
        const oldAuthorLookup = toLookup(oldAuthors, x => x.id);
        const newAuthorIds = allAuthorIds.filter(x => !oldAuthorLookup[x]);

        const newAuthors = await this.getAuthors(newAuthorIds);
        const authors = [...oldAuthors, ...newAuthors];
        const authorLookup = toLookup(authors, x => x.id);

        console.log('getConversation_orMoreMessages: Get authors END',
            'oldAuthors.length', oldAuthors.length,
            'newAuthors.length', newAuthors.length,
        );

        const messagesWithAuthors = allMessages.map(x => {
            return {
                ...x,
                author: authorLookup[x.authorId]
            };
        });

        console.log('getConversation_orMoreMessages END',
            'messages.length', allMessages.length,
            'authors.length', authors.length,
        );

        return {
            ...oldConversation,
            messages: messagesWithAuthors,
            authors,
        };
    }

    private async getConversationData_byName(conversationName: string): Promise<T.ChatConversation_DataWithId> {
        return firestore.getDocumentByValue<T.ChatConversation_DataWithId>(T.CONVERSATIONS_COLLECTION, T.CONVERSATION_NAME, conversationName);
    }

    private async getConversationData_byId(conversationId: string) {
        return firestore.getDocument<T.ChatConversation_DataWithId>(T.CONVERSATIONS_COLLECTION, conversationId);
    }

    private async getMessages_before(conversationId: string, startBefore: T.ChatMessage = null, limit = 10): Promise<T.ChatMessage_DataWithId[]> {
        return firestore.getDocumentsByValue_paged<T.ChatMessage_DataWithId>(T.MESSAGES_COLLECTION, T.CONVERSATION_ID, conversationId, T.TIMESTAMP, 'desc', startBefore && startBefore.timestamp, limit);
    }

    private async getMessages_after(conversationId: string, startAfter: T.ChatMessage): Promise<T.ChatMessage_DataWithId[]> {
        // Get all messages after (should be a small number)
        const limit = 100;
        const messages = await firestore.getDocumentsByValue_paged<T.ChatMessage_DataWithId>(T.MESSAGES_COLLECTION, T.CONVERSATION_ID, conversationId, T.TIMESTAMP, 'asc', startAfter.timestamp, limit);
        return messages.reverse();
    }

    private async getAuthors(authorIds: string[]): Promise<T.ChatAuthor_DataWithId[]> {
        return firestore.getDocuments<T.ChatAuthor_DataWithId>(T.AUTHORS_COLLECTION, authorIds);
    }

    // Subscribe
    subscribeToConversation(conversation: T.ChatConversation): O.SlimObservable<T.ChatConversation> {
        let c = conversation;

        const o = firestore.subscribe<T.ChatMessage_DataWithId>(
            T.MESSAGES_COLLECTION, T.CONVERSATION_ID, c.id,
            T.TIMESTAMP, 'asc', c.messages[0] && c.messages[0].timestamp);

        const subject = new O.SlimSubject<T.ChatConversation>(() => o.unsubscribe());

        o.subscribe(async (newMessages) => {
            const m = toUniqueItems([...newMessages, ...c.messages], x => x.id).sort((a, b) => b.timestamp - a.timestamp);
            c = await this.populateConversation(c, m);
            subject.next(c);
        });

        return subject;
    }


    // List Conversations
    async getConversationList(): Promise<T.ChatConversation_DataWithId[]> {
        return firestore.getDocuments_all<T.ChatConversation_DataWithId>(T.CONVERSATIONS_COLLECTION);
    }

    // Create Conversation
    async createConversation(conversationName: string) {
        await firestore.createDocument<T.ChatConversation_Data>(T.CONVERSATIONS_COLLECTION, {
            name: conversationName
        });
    }

    // Create Author
    async getOrCreateAuthor(userId: string, displayName: string, photoUrl: string) {
        console.log('getOrCreateAuthor START',
            'userId', userId,
            'displayName', displayName,
            'photoUrl', photoUrl,
        );

        let author = await this.getAuthorByUserId(userId);

        if (!author) {
            console.log('getOrCreateAuthor: Author not found - create',
                'author', author,
            );

            await this.createAuthor(userId, displayName, photoUrl);
            author = await this.getAuthorByUserId(userId);
        }

        console.log('getOrCreateAuthor END',
            'author', author,
        );

        return author;
    }

    private async getAuthorByUserId(userId: string): Promise<T.ChatAuthor> {
        return firestore.getDocumentByValue<T.ChatAuthor>(T.AUTHORS_COLLECTION, T.USER_ID, userId);
    }

    private async createAuthor(userId: string, displayName: string, photoUrl: string) {
        await firestore.createDocument<T.ChatAuthor_Data>(T.AUTHORS_COLLECTION, {
            userId,
            displayName,
            photoUrl,
        });
    }

    // Create Message
    async createMessage(conversation: T.ChatConversation, author: T.ChatAuthor, content: T.ChatMessageContent) {
        return this.createMessage_inner(conversation.id, author.id, content);
    }

    private async createMessage_inner(conversationId: T.ChatConversationId, authorId: T.ChatAuthorId, content: T.ChatMessageContent) {
        console.log('createMessage_inner START',
            'conversationId', conversationId,
            'authorId', authorId,
            'content', content,
        );

        await firestore.createDocument<T.ChatMessage_Data>(T.MESSAGES_COLLECTION, {
            conversationId,
            authorId,
            content,
            timestamp: Date.now(),
        });

        console.log('createMessage_inner END',
        );
    }


}
