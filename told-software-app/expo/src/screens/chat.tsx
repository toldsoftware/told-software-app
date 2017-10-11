import * as React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { ConversationTest } from '../../../common/chat/client/conversation-test';

export class ChatScreen extends React.Component {
    static navigationOptions = {
        title: 'Chat'
    };
    render() {
        return <ConversationTest />;
    }
}