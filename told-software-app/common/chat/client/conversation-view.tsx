import * as React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import * as T from '../types';

export class ConversationView extends React.Component<{ conversation: T.ChatConversation, userAuthor: T.ChatAuthor, onUserCreateMessage: (content: T.ChatMessageContent) => void }> {
    render() {
        return (
            <View>
                <MessageList {...this.props} />
            </View>
        );
    }
}

const MessageList = (props: { conversation: T.ChatConversation, userAuthor: T.ChatAuthor }) => (
    <View>
        {props.conversation.messages.map(x => (
            <MessageView key={x.messageId} isUser={x.authorId == this.props.userAuthor.authorId} content={x.content} />
        ))}
    </View>
);


const MessageView = (props: { isUser: boolean, content: T.ChatMessageContent }) => (
    <Text style={props.isUser ? styles.userMessage : styles.otherMessage}>{props.content.text}</Text>
);

const styles = StyleSheet.create({
    userMessage: {
        padding: 8,
        fontSize: 14,
        textAlign: 'right',
        back: '#3333CC',
        color: '#FFFFFF',
        borderRadius: 8,
        borderStyle: 'solid',
        borderColor: '#000000',
        borderWidth: 1,
    },
    otherMessage: {
        padding: 8,
        fontSize: 14,
        textAlign: 'left',
        // back: '#FFFFFF',
        // color: '#000000',
        borderRadius: 8,
        borderStyle: 'solid',
        borderColor: '#000000',
        borderWidth: 1,
    }
});