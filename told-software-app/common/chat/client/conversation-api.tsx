import { firestore } from '../../firebase/client/firebase-api';
import * as T from '../types';
import { toUniqueValues, toLookup } from '../../utils/object';

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

        const oldMessages = conversation.messages || [];
        const newMessages = await this.getMessages(conversation.conversationId, 10, oldMessages.length && oldMessages[oldMessages.length - 1]);
        const messages = [...oldMessages, ...newMessages];

        const allAuthorIds = toUniqueValues(messages.map(x => x.authorId));

        const oldAuthors = conversation.authors || [];
        const oldAuthorLookup = toLookup(oldAuthors, x => x.authorId);
        const newAuthorIds = allAuthorIds.filter(x => !oldAuthorLookup[x]);

        const newAuthors = await this.getAuthors(newAuthorIds);
        const authors = [...oldAuthors, ...newAuthors];
        const authorLookup = toLookup(authors, x => x.authorId);

        const messages_runtime = messages.map(x => {
            return {
                ...x,
                author: authorLookup[x.authorId]
            };
        });

        return {
            ...conversation,
            messages: messages_runtime,
            authors,
        };
    }

    private async getConversationData_byName(conversationName: string): Promise<T.ChatConversation_Data> {
        const snapshot = await firestore.collection(T.CONVERSATIONS_COLLECTION)
            .where(T.CONVERSATION_NAME, '==', conversationName)
            .get();

        const data = snapshot.docs
            .map(x => {
                const d = x.data() as T.ChatConversation_Data;
                d.conversationId = x.id;
                return d;
            });
        return data[0];
    }

    private async getConversationData_byId(conversationId: string): Promise<T.ChatConversation_Data> {
        const snapshot = await firestore.collection(T.CONVERSATIONS_COLLECTION)
            .where(T.CONVERSATION_ID, '==', conversationId)
            .get();

        const data = snapshot.docs
            .map(x => {
                const d = x.data() as T.ChatConversation_Data;
                d.conversationId = x.id;
                return d;
            });

        return data[0];
    }

    private async getMessages(conversationId: string, count = 10, startBefore: T.ChatMessage = null): Promise<T.ChatMessage_Data[]> {

        const snapshot = await firestore.collection(T.MESSAGES_COLLECTION)
            .where(T.CONVERSATION_ID, '==', conversationId)
            .orderBy(T.TIMESTAMP, 'desc')
            .startAfter(startBefore.timestamp)
            .limit(count)
            .get();

        const data = snapshot.docs
            .map(x => {
                const d = x.data() as T.ChatMessage_Data;
                d.messageId = x.id;
                return d;
            });

        return data;
    }

    private async getAuthors(authorIds: string[]): Promise<T.ChatAuthor_Data[]> {
        const snapshot = await firestore.collection(T.AUTHORS_COLLECTION)
            .where(T.AUTHOR_ID, '==', authorIds)
            .get();

        const data = snapshot.docs
            .map(x => {
                const d = x.data() as T.ChatAuthor_Data;
                d.authorId = x.id;
                return d;
            });

        return data;
    }

    // List Conversations
    async getConversationList(): Promise<T.ChatConversation_Data[]> {
        const snapshot = await firestore.collection(T.CONVERSATIONS_COLLECTION)
            .get();

        const data = snapshot.docs
            .map(x => {
                const d = x.data() as T.ChatConversation_Data;
                d.conversationId = x.id;
                return d;
            });

        return data;
    }

    // Create Conversation
    async createConversation_inner(conversationName: string) {
        const data: T.ChatConversation_Data = {
            conversationId: undefined,
            name: conversationName
        };

        firestore.collection(T.CONVERSATIONS_COLLECTION).add(data);;
    }


    // Create Author
    async createAuthor_inner(authorName: string, authorImage: string) {
        const data: T.ChatAuthor_Data = {
            authorId: undefined,
            name: authorName,
            image: authorImage,
        };

        firestore.collection(T.AUTHORS_COLLECTION).add(data);;
    }

    // Create Message
    async createMessage(conversation: T.ChatConversation_Data, author: T.ChatAuthor_Data, content: T.ChatMessageContent) {
        return this.createMessage_inner(conversation.conversationId, author.authorId, content);
    }

    private async createMessage_inner(conversationId: string, authorId: string, content: T.ChatMessageContent) {
        const data: T.ChatMessage_Data = {
            messageId: undefined,
            conversationId,
            authorId,
            content,
            timestamp: Date.now(),
        };

        firestore.collection(T.MESSAGES_COLLECTION).add(data);;
    }


}