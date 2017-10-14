import * as React from 'react';
import { StyleSheet, Text, View, Button, TextInput, ScrollView, KeyboardAvoidingView } from 'react-native';
import * as T from '../types';
import { QuoteCartoon } from '../../svg/client/quote-cartoon';

const colors = {
    backgroundColor_user: '#3333FF',
    borderColor_user: '#222288',
    text_user: '#FFFFFF',
    backgroundColor_other: '#88FF88',
    borderColor_other: '#228822',
    text_other: '#000000',
};

export class ConversationView extends React.Component<{ conversation: T.ChatConversation, userAuthor: T.ChatAuthor, onUserCreateMessage: (content: T.ChatMessageContent) => void }> {
    render() {
        return (
            <View style={styles.container}>
                <ScrollView ref='scrollView' onContentSizeChange={() => (this.refs.scrollView as any as ScrollView).scrollToEnd()}>
                    <MessageList {...this.props} />
                </ScrollView>
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


const MessageView = (props: { isUser: boolean, content: T.ChatMessageContent }) => {
    const backgroundColor = props.isUser ? colors.backgroundColor_user : colors.backgroundColor_other;
    const borderColor = props.isUser ? colors.borderColor_user : colors.borderColor_other;

    return (
        <View style={props.isUser ? styles.userMessageContainer : styles.otherMessageContainer}>
            <QuoteCartoon colors={{ backgroundColor, borderColor }} isPointingRight={props.isUser}>
                <Text style={props.isUser ? styles.userMessage : styles.otherMessage}>{props.content.text}</Text>
            </QuoteCartoon>
        </View >
    );
};


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
            <View style={styles.entryContainer}>
                <TextInput style={styles.entry} value={this.state.messageText} onChangeText={(text) => this.setState({ messageText: text })} />
                <Button title='Send' disabled={!this.state.messageText}
                    onPress={this.send} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyboardAvoidingView: {
        flex: 1,
    },
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
        paddingRight:16,
        marginLeft: 16,
        fontSize: 14,
        textAlign: 'right',
        color: colors.text_user,
        backgroundColor: 'transparent',
        // backgroundColor: '#3333CC',
        // borderRadius: 8,
        // borderStyle: 'solid',
        // borderColor: '#000000',
        // borderWidth: 1,
    },
    otherMessage: {
        padding: 8,
        paddingLeft:16,
        marginRight: 16,
        fontSize: 14,
        textAlign: 'left',
        backgroundColor: 'transparent',
        color: colors.text_other,

        // backgroundColor: '#FFFFFF',
        // color: '#000000',
        // borderRadius: 8,
        // borderStyle: 'solid',
        // borderColor: '#000000',
        // borderWidth: 1,
    },
    entryContainer: {
        flexDirection: 'row',
    },
    entry: {
        flex: 1,
        backgroundColor: '#CCCCCC',
    }
});