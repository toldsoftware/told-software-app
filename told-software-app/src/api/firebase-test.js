import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { firestore, auth } from './firebase-api';

export class FirebaseTest extends React.Component {
  fsTest = "";
  authTest = "";

  pressTestFirestore = () => {
    this.fsTest += 'Test Firestore... ';
    this.setState({});

    // Add Collection
    const c = firestore.collection("collection-a");

    // Add Doc
    c.add({
      keyA: 'valA',
      keyB: 'valB',
      keyC: 'valC',
    });

    // Get all Docs
    c.get().then((querySnapshot) => {
      querySnapshot.forEach((doc => {
        this.fsTest += "GOT DOC" + doc.id + " => " + JSON.stringify(doc.data());
        this.setState({});
      }))
    });

  };

  pressTestAuth = () => {
    this.authTest += 'Test Auth... ';
    this.setState({});

    // Create User
    auth.createUserWithEmailAndPassword('rick@toldpro.com', '1234567890').then(() => {
      this.authTest += 'Created User... ';
      this.setState({});
    }).catch((error) => {
      this.authTest += 'Created User ERROR: ' + error.code + ' - ' + error.message;
      this.setState({});
    });

    // Sign In
    auth.signInWithEmailAndPassword('rick@toldpro.com', '1234567890').then(() => {
      this.authTest += 'Signed In... ' + auth.currentUser;
      this.setState({});
    }).catch((error) => {
      this.authTest += 'Signed In ERROR: ' + error.code + ' - ' + error.message;
      this.setState({});
    });

    // // Log Out
    // auth.currentUser('rick@toldpro.com', '1234567890').then(() => {
    //   this.authTest += 'Signed In... ';
    //   this.setState({});
    // }).catch((error) => {
    //   this.authTest += 'Signed In ERROR: ' + error.code + ' - ' + error.message;
    //   this.setState({});
    // });
  };

  render() {
    return (
      <View>
        <Button onPress={this.pressTestFirestore} title="Test Firestore"></Button>
        <Text>{this.fsTest}</Text>

        <Button onPress={this.pressTestAuth} title="Test Auth"></Button>
        <Text>{this.authTest}</Text>
      </View>
    );
  }
}
