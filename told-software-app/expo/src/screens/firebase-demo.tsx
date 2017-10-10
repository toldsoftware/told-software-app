import * as React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { FirebaseTest } from '../../../common/firebase/client/firebase-test';

export class FirebaseDemoScreen extends React.Component {
    static navigationOptions = {
        title: 'Firebase Demo'
    };
    render() {
        return <FirebaseTest />;
    }
}