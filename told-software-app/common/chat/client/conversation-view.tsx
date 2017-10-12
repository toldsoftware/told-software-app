import * as React from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import * as T from '../types';

export class ConversationView extends React.Component<{ conversation: T.ChatConversation, userAuthor: T.ChatAuthor, onUserCreateMessage: (content: T.ChatMessageContent) => void }> {
    render() {
        return (
            <View>
                <MessageList {...this.props} />
                {this.props.userAuthor && <MessageEntry {...this.props} />}
            </View>
        );
    }
}

const MessageList = (props: { conversation: T.ChatConversation, userAuthor: T.ChatAuthor }) => (
    <View>
        {props.conversation.messages.slice().reverse().map(x => (
            <MessageView key={x.id} isUser={props.userAuthor && x.authorId == props.userAuthor.id} content={x.content} />
        ))}
    </View>
);


const MessageView = (props: { isUser: boolean, content: T.ChatMessageContent }) => (
    <View style={props.isUser ? styles.userMessageContainer : styles.otherMessageContainer}>
        <Text style={props.isUser ? styles.userMessage : styles.otherMessage}>{props.content.text}</Text>
    </View>
);


export class MessageEntry extends React.Component<
    { conversation: T.ChatConversation, userAuthor: T.ChatAuthor, onUserCreateMessage: (content: T.ChatMessageContent) => void },
    { messageText: string }> {

    constructor() {
        super();
        this.state = { messageText: '' };
    }

    send = () => {
        if (!this.state.messageText) { return; }

        this.props.onUserCreateMessage({ text: this.state.messageText });
        this.setState({ messageText: '' });
    };

    render() {
        return (
            <View>
                <TextInput value={this.state.messageText} onChangeText={(text) => this.setState({ messageText: text })} />
                <Button title='Send' disabled={!this.state.messageText}
                    onPress={this.send} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    userMessageContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    otherMessageContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    userMessage: {
        padding: 8,
        marginLeft: 16,
        fontSize: 14,
        textAlign: 'right',
        backgroundColor: '#3333CC',
        color: '#FFFFFF',
        borderRadius: 8,
        borderStyle: 'solid',
        borderColor: '#000000',
        borderWidth: 1,
    },
    otherMessage: {
        padding: 8,
        marginRight: 16,
        fontSize: 14,
        textAlign: 'left',
        // backgroundColor: '#FFFFFF',
        // color: '#000000',
        borderRadius: 8,
        borderStyle: 'solid',
        borderColor: '#000000',
        borderWidth: 1,
    }
});