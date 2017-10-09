import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { FirebaseTest } from '../api/firebase-test';

export class FirebaseDemoScreen extends React.Component {
    static navigationOptions = {
        title: 'Firebase Demo'
    };
    render() {
        return <FirebaseTest />;
    }
}