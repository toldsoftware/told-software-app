import * as React from 'react';
import { StyleSheet, Text, View, Button, ScrollView } from 'react-native';
import * as T from '../types';
import { ConversationApi } from './conversation-api';
import { ConversationView } from './conversation-view';
import { auth, resetFirestore } from '../../firebase/client/firebase-api';

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
        console.log('ConversationTest: load START');

        this._conversation = conversation;
        if (this._conversation) { return; }

        console.log('ConversationTest: load: Get Conversation');
        this._conversation = conversation = await api.getConversation_byName('Test Chat');

        if (!this._conversation) {

            console.log('ConversationTest: load: Does not Exist - Create Conversation');
            await api.createConversation('Test Chat');
            this._conversation = conversation = await api.getConversation_byName('Test Chat');
        }

        console.log('ConversationTest: load: Get Current User Id');

        // let user = auth.currentUser;

        // if (!userId) {
        //     console.log('ConversationTest: load: Login User');

        //     await auth.signInWithEmailAndPassword('rick@toldpro.com', '1234567890');
        //     userId = auth.currentUser.uid;
        // }

        await this.loadAuthor();

        console.log('ConversationTest: load: setState');

        this.setState({});

        this.subscribeToConversation();
        console.log('ConversationTest: load END');
    };

    loadAuthor = async () => {
        let user = auth.currentUser;

        if (!user) {
            this._userAuthor = userAuthor = null;
            return;
        }

        console.log('ConversationTest: loadAuthor: Get or Create Author',
            'userId', user.uid,
            'displayName', user.displayName,
            'photoURL', user.photoURL
        );

        this._userAuthor = userAuthor = await api.getOrCreateAuthor(user.uid, user.displayName, user.photoURL);
    };

    subscribeToConversation = () => {
        const s = api.subscribeToConversation(this._conversation);
        s.subscribe(x => {
            this._conversation = x;
            this.setState({});
        });
    };

    signOut = async () => {
        console.log('ConversationTest: signOut START');

        await auth.signOut();
        this.setState({});

        console.log('ConversationTest: signOut END');
    };

    loginAsRick = async () => {
        console.log('ConversationTest: loginAsRick START');

        await auth.signInWithEmailAndPassword('rick@toldpro.com', '1234567890');
        await resetFirestore();
        await this.loadAuthor();

        this.setState({});
        console.log('ConversationTest: loginAsRick END');
    };

    loginAsAnon = async () => {
        console.log('ConversationTest: loginAsAnon START');

        await auth.signInAnonymously();
        await resetFirestore();
        await this.loadAuthor();

        this.setState({});
        console.log('ConversationTest: loginAsAnon END');
    };

    sendMessage = async (message: T.ChatMessageContent) => {
        console.log('ConversationTest: sendMessage START');

        await api.createMessage(this._conversation, this._userAuthor, message);
        // Let subscription update it
        // this._conversation = await api.getNewMessages(this._conversation);
        this.setState({});

        console.log('ConversationTest: sendMessage END');
    };

    render() {

        console.log('ConversationTest: render',
            'message.length', this._conversation && this._conversation.messages.length,
            'authorId', this._userAuthor && this._userAuthor.id);

        return (
            <ScrollView>
                {!conversation && (
                    <Text>Loading...</Text>
                )}
                {conversation && (
                    <ConversationView conversation={this._conversation} userAuthor={this._userAuthor}
                        onUserCreateMessage={(x) => this.sendMessage(x)} />
                )}
                <Button title='As Rick' onPress={this.loginAsRick} />
                <Button title='As Anon' onPress={this.loginAsAnon} />
                <Button title='Sign Out' onPress={this.signOut} />
            </ScrollView>
        );
    }
}
