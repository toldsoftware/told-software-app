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
        this._conversation = conversation;
        if (this._conversation) { return; }

        this._conversation = conversation = await api.getConversation_byName('Test Chat');

        if (!this._conversation) {
            await api.createConversation_inner('Test Chat');
            this._conversation = conversation = await api.getConversation_byName('Test Chat');
        }

        let userId = auth.currentUser.uid;

        if (!userId) {
            await auth.signInWithEmailAndPassword('rick@toldpro.com', '1234567890');
            userId = auth.currentUser.uid;
        }

        this._userAuthor = userAuthor = await api.getOrCreateAuthor(userId, auth.currentUser.displayName, auth.currentUser.photoURL);

        this.setState({});
    };

    render() {
        return (
            <ConversationView conversation={this._conversation} userAuthor={this._userAuthor} onUserCreateMessage={() => { console.log('onUserCreateMessage') }} />
        );
    }
}
