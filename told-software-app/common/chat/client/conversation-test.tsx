import * as React from 'react';
import { StyleSheet, Text, View, Button, ScrollView, KeyboardAvoidingView } from 'react-native';
import * as T from '../types';
import { ConversationApi } from './conversation-api';
import { ConversationView } from './conversation-view';
import { auth } from '../../firebase/client/firebase-api';
import { SlimObservable } from '../../utils/observable';

const api = new ConversationApi();

export class ConversationTest extends React.Component {

    _conversation: T.ChatConversation;
    _userAuthor: T.ChatAuthor;
    _subscription: SlimObservable<T.ChatConversation>;

    componentWillMount() {
        this.load();
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    load = async () => {
        console.log('ConversationTest: load START');

        console.log('ConversationTest: load: Get Conversation');
        this._conversation = await api.getConversation_byName('Test Chat');

        if (!this._conversation) {

            console.log('ConversationTest: load: Does not Exist - Create Conversation');
            await api.createConversation('Test Chat');
            this._conversation = await api.getConversation_byName('Test Chat');
        }

        console.log('ConversationTest: load: Get Current User Id');

        if (!auth.currentUser) {
            console.log('ConversationTest: load: Login User');
            await auth.signInAnonymously();
        }

        await this.loadAuthor();

        console.log('ConversationTest: load: setState');

        this.setState({});

        this.subscribeToConversation();
        console.log('ConversationTest: load END');
    };

    loadAuthor = async () => {
        let user = auth.currentUser;

        if (!user) {
            this._userAuthor = null;
            return;
        }

        console.log('ConversationTest: loadAuthor: Get or Create Author',
            'userId', user.uid,
            'displayName', user.displayName,
            'photoURL', user.photoURL
        );

        this._userAuthor = await api.getOrCreateAuthor(user.uid, user.displayName, user.photoURL);
    };

    subscribeToConversation = () => {
        this.unsubscribe();

        this._subscription = api.subscribeToConversation(this._conversation);
        this._subscription.subscribe(x => {
            this._conversation = x;
            this.setState({});
        });
    };

    unsubscribe = () => {
        if (this._subscription) {
            this._subscription.unsubscribe();
            this._subscription = null;
        }
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
        await this.loadAuthor();
        await this.subscribeToConversation();

        this.setState({});
        console.log('ConversationTest: loginAsRick END');
    };

    loginAsAnon = async () => {
        console.log('ConversationTest: loginAsAnon START');

        await auth.signInAnonymously();
        await this.loadAuthor();
        await this.subscribeToConversation();

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
        const conversation = this._conversation;

        console.log('ConversationTest: render',
            'message.length', this._conversation && this._conversation.messages.length,
            'authorId', this._userAuthor && this._userAuthor.id);

        return (
            <View style={styles.container} ref='view'>
                <KeyboardAvoidingView style={styles.keyboardAvoidingView} behavior={'padding'} keyboardVerticalOffset={64}>
                    <View style={styles.actionContainer}>
                        <Button title='As Rick' onPress={this.loginAsRick} />
                        <Button title='As Anon' onPress={this.loginAsAnon} />
                        <Button title='Sign Out' onPress={this.signOut} />
                    </View>
                    {!conversation && (
                        <Text>Loading...</Text>
                    )}
                    {conversation && (
                        <ConversationView conversation={this._conversation} userAuthor={this._userAuthor}
                            onUserCreateMessage={(x) => this.sendMessage(x)} />
                    )}
                </KeyboardAvoidingView>
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
    actionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
});
