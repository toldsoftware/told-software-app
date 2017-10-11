import { FirestoreAccess } from '../../firebase/client/firebase-api';
import * as T from '../types';
import { toUniqueValues, toLookup } from '../../utils/object';

const fs = new FirestoreAccess();

export class ConversationApi {

    // Get Conversation
    async getConversation_byName(conversationName: string): Promise<T.ChatConversation> {
        const c = await this.getConversationData_byName(conversationName);
        return await this.getConversation_orMoreMessages(c as T.ChatConversation);
    }

    async getConversation_byId(conversationId: string): Promise<T.ChatConversation> {
        const c = await this.getConversationData_byId(conversationId);
        return await this.getConversation_orMoreMessages(c as T.ChatConversation);
    }

    async getMoreMessages(conversation: T.ChatConversation): Promise<T.ChatConversation> {
        return await this.getConversation_orMoreMessages(conversation);
    }

    private async getConversation_orMoreMessages(conversation: T.ChatConversation): Promise<T.ChatConversation> {
        console.log('getConversation_orMoreMessages START');

        if (!conversation) { return null; }

        console.log('getConversation_orMoreMessages: Get messages',
            'conversation.id', conversation.id,
            'conversation.name', conversation.name,
        );

        const oldMessages = conversation.messages || [];
        const newMessages = await this.getMessages(conversation.id, oldMessages.length && oldMessages[oldMessages.length - 1]);
        const messages = [...oldMessages, ...newMessages];

        console.log('getConversation_orMoreMessages: Get messages END',
            'oldMessages.length', oldMessages.length,
            'newMessages.length', newMessages.length,
        );

        const allAuthorIds = toUniqueValues(messages.map(x => x.authorId));

        const oldAuthors = conversation.authors || [];
        const oldAuthorLookup = toLookup(oldAuthors, x => x.id);
        const newAuthorIds = allAuthorIds.filter(x => !oldAuthorLookup[x]);

        const newAuthors = await this.getAuthors(newAuthorIds);
        const authors = [...oldAuthors, ...newAuthors];
        const authorLookup = toLookup(authors, x => x.id);

        console.log('getConversation_orMoreMessages: Get authors END',
            'oldAuthors.length', oldAuthors.length,
            'newAuthors.length', newAuthors.length,
        );

        const messages_runtime = messages.map(x => {
            return {
                ...x,
                author: authorLookup[x.authorId]
            };
        });

        console.log('getConversation_orMoreMessages END',
            'messages.length', messages.length,
            'authors.length', authors.length,
        );

        return {
            ...conversation,
            messages: messages_runtime,
            authors,
        };
    }

    private async getConversationData_byName(conversationName: string): Promise<T.ChatConversation_DataWithId> {
        return fs.getDocumentByValue<T.ChatConversation_DataWithId>(T.CONVERSATIONS_COLLECTION, T.CONVERSATION_NAME, conversationName);
    }

    private async getConversationData_byId(conversationId: string) {
        return fs.getDocument<T.ChatConversation_DataWithId>(T.CONVERSATIONS_COLLECTION, conversationId);
    }

    private async getMessages(conversationId: string, startBefore: T.ChatMessage = null, limit = 10): Promise<T.ChatMessage_DataWithId[]> {
        return fs.getDocumentsByValue_paged<T.ChatMessage_DataWithId>(T.MESSAGES_COLLECTION, T.CONVERSATION_ID, conversationId, T.TIMESTAMP, 'desc', startBefore && startBefore.timestamp, limit);
    }

    private async getAuthors(authorIds: string[]): Promise<T.ChatAuthor_DataWithId[]> {
        return fs.getDocuments<T.ChatAuthor_DataWithId>(T.AUTHORS_COLLECTION, authorIds);
    }

    // List Conversations
    async getConversationList(): Promise<T.ChatConversation_DataWithId[]> {
        return fs.getDocuments_all<T.ChatConversation_DataWithId>(T.CONVERSATIONS_COLLECTION);
    }

    // Create Conversation
    async createConversation(conversationName: string) {
        await fs.createDocument<T.ChatConversation_Data>(T.CONVERSATIONS_COLLECTION, {
            name: conversationName
        });
    }

    // Create Author
    async getOrCreateAuthor(userId: string, displayName: string, photoUrl: string) {
        console.log('getOrCreateAuthor START',
        );

        let author = await this.getAuthorByUserId(userId);

        if (!author) {
            console.log('getOrCreateAuthor: Author not found - create',
                'oldAuthor', author,
            );

            await this.createAuthor(userId, displayName, photoUrl);
            author = await this.getAuthorByUserId(userId);
        }

        console.log('getOrCreateAuthor END',
            'oldAuthor', author,
        );

        return author;
    }

    private async getAuthorByUserId(userId: string): Promise<T.ChatAuthor> {
        return fs.getDocumentByValue<T.ChatAuthor>(T.AUTHORS_COLLECTION, T.USER_ID, userId);
    }

    private async createAuthor(userId: string, displayName: string, photoUrl: string) {
        await fs.createDocument<T.ChatAuthor_Data>(T.AUTHORS_COLLECTION, {
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

        await fs.createDocument<T.ChatMessage_Data>(T.MESSAGES_COLLECTION, {
            conversationId,
            authorId,
            content,
            timestamp: Date.now(),
        });

        console.log('createMessage_inner END',
        );
    }


}