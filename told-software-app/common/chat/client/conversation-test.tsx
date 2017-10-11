import * as React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import * as T from '../types';
import { ConversationApi } from './conversation-api';
import { ConversationView } from './conversation-view';
import { auth } from '../../firebase/client/firebase-api';

const api = new ConversationApi();
let conversation: T.ChatConversation = null;
let userAuthor: T.ChatAuthor = null;

export class ConversationTest extends React.Component {

    _conversation: T.ChatConversation;
    _userAuthor: T.ChatAuthor;

    componentWillMount() {
        this.load();
    }

    load = async () => {
        console.log('ConversationTest: Loading...');

        this._conversation = conversation;
        if (this._conversation) { return; }

        console.log('ConversationTest: Get Conversation');
        this._conversation = conversation = await api.getConversation_byName('Test Chat');

        if (!this._conversation) {

            console.log('ConversationTest: Does not Exist - Create Conversation');
            await api.createConversation('Test Chat');
            this._conversation = conversation = await api.getConversation_byName('Test Chat');
        }

        console.log('ConversationTest: Get Current User Id');
        let userId = auth.currentUser.uid;

        if (!userId) {
            console.log('ConversationTest: Login User');

            await auth.signInWithEmailAndPassword('rick@toldpro.com', '1234567890');
            userId = auth.currentUser.uid;
        }

        console.log('ConversationTest: Get or Create Author',
            'userId', userId,
            'displayName', auth.currentUser.displayName,
            'photoURL', auth.currentUser.photoURL
        );

        this._userAuthor = userAuthor = await api.getOrCreateAuthor(userId, auth.currentUser.displayName, auth.currentUser.photoURL);

        this.setState({});
    };

    sendMessage = async (message: T.ChatMessageContent) => {
        console.log('ConversationTest: sendMessage START');

        await api.createMessage(this._conversation, this._userAuthor, message);
        await api.getMoreMessages(this._conversation);
        this.setState({});

        console.log('ConversationTest: sendMessage END');
    };

    render() {
        return (
            <View>
                {!conversation && (
                    <Text>Loading...</Text>
                )}
                {conversation && (
                    <ConversationView conversation={this._conversation} userAuthor={this._userAuthor}
                        onUserCreateMessage={(x) => this.sendMessage(x)} />
                )}
            </View>
        );
    }
}
