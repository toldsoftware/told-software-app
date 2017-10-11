import { toKeyOfStringLiteral } from "../utils/object";
import { CollectionId } from "../firebase/client/firebase-api";

export interface ChatConversation_Data {
    name: string;
}

export interface ChatConversation_DataWithId extends ChatConversation_Data {
    id: ChatConversationId;
}

export interface ChatConversation extends ChatConversation_DataWithId {
    messages: ChatMessage[];
    authors: ChatAuthor[];
}


export interface ChatMessage_Data {
    conversationId: ChatConversationId;
    authorId: ChatAuthorId;
    content: ChatMessageContent;
    timestamp: number;
}

export interface ChatMessage_DataWithId extends ChatMessage_Data {
    id: ChatMessageId;
}

export interface ChatMessage extends ChatMessage_DataWithId {
    author: ChatAuthor;
}

export interface ChatMessageContent {
    text: string;
}


export interface ChatAuthor_Data {
    userId: string;
    displayName: string;
    photoUrl: string;
}

export interface ChatAuthor_DataWithId extends ChatAuthor_Data {
    id: ChatAuthorId;
}

export interface ChatAuthor extends ChatAuthor_DataWithId {
}

export type ChatConversationId = string & { '__type': 'ChatConversationId' };
export type ChatMessageId = string & { '__type': 'ChatMessageId' };
export type ChatAuthorId = string & { '__type': 'ChatAuthorId' };

export const CONVERSATION_ID = toKeyOfStringLiteral(null as ChatMessage, 'conversationId');
export const CONVERSATION_NAME = toKeyOfStringLiteral(null as ChatConversation, 'name');
export const AUTHOR_ID = toKeyOfStringLiteral(null as ChatMessage, 'authorId');
export const USER_ID = toKeyOfStringLiteral(null as ChatAuthor, 'userId');
export const TIMESTAMP = toKeyOfStringLiteral(null as ChatMessage, 'timestamp');

export const CONVERSATIONS_COLLECTION = 'chat-conversations' as CollectionId;
export const MESSAGES_COLLECTION = 'chat-messages' as CollectionId;
export const AUTHORS_COLLECTION = 'chat-authors' as CollectionId;
