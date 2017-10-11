export interface ChatConversation_Data {
    conversationId: string;
    name: string;
}

export interface ChatConversation extends ChatConversation_Data {
    messages: ChatMessage[];
    authors: ChatAuthor_Data[];
}

export interface ChatMessage_Data {
    messageId: string;
    conversationId: string;
    authorId: string;
    content: ChatMessageContent;
    timestamp: number;
}

export interface ChatMessageContent {
    text: string;
}

export interface ChatMessage extends ChatMessage_Data {
    author: ChatAuthor_Data;
}

export interface ChatAuthor_Data {
    authorId: string;
    userId: string;
    displayName: string;
    photoUrl: string;
}

export interface ChatAuthor extends ChatAuthor_Data {
}

export const CONVERSATION_ID: keyof ChatConversation_Data & keyof ChatMessage_Data = 'conversationId';
export const CONVERSATION_NAME: keyof ChatConversation_Data = 'name';
// export const MESSAGE_ID: keyof ChatMessage_Data = 'messageId';
export const AUTHOR_ID: keyof ChatMessage_Data & keyof ChatAuthor_Data = 'authorId';
export const USER_ID: keyof ChatAuthor_Data = 'userId';
export const TIMESTAMP: keyof ChatMessage_Data = 'timestamp';

export const CONVERSATIONS_COLLECTION = 'chat-conversations';
export const MESSAGES_COLLECTION = 'chat-messages';
export const AUTHORS_COLLECTION = 'chat-authors';