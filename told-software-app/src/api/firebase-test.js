"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_native_1 = require("react-native");
const firebase_api_1 = require("./firebase-api");
const expo_push_1 = require("./expo-push");
class FirebaseTest extends React.Component {
    constructor() {
        super(...arguments);
        this.fsTest = "";
        this.pressTestFirestore = () => {
            this.fsTest += 'Test Firestore... ';
            this.setState({});
            // Add Collection
            const c = firebase_api_1.firestore.collection("collection-a");
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
                }));
            });
        };
        this.authTest = "";
        this.pressTestAuth = () => {
            this.authTest += 'Test Auth... ';
            this.setState({});
            // Create User
            firebase_api_1.auth.createUserWithEmailAndPassword('rick@toldpro.com', '1234567890').then(() => {
                this.authTest += 'Created User... ';
                this.setState({});
            }).catch((error) => {
                this.authTest += 'Created User ERROR: ' + error.code + ' - ' + error.message;
                this.setState({});
            });
            // Sign In
            firebase_api_1.auth.signInWithEmailAndPassword('rick@toldpro.com', '1234567890').then(() => {
                this.authTest += 'Signed In... ' + firebase_api_1.auth.currentUser;
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
        this.expoPushTest = "";
        this.pressRegisterExpoPushNotification = () => {
            const user = firebase_api_1.auth.currentUser;
            const userKey = user.uid;
            expo_push_1.registerForPushNotificationsAsync(userKey).then((x) => {
                this.expoPushTest += '' + x;
                this.setState({});
            });
        };
    }
    render() {
        return (<react_native_1.View>
        <react_native_1.Button onPress={this.pressTestFirestore} title="Test Firestore"></react_native_1.Button>
        <react_native_1.Text>{this.fsTest}</react_native_1.Text>

        <react_native_1.Button onPress={this.pressTestAuth} title="Test Auth"></react_native_1.Button>
        <react_native_1.Text>{this.authTest}</react_native_1.Text>

        <react_native_1.Button onPress={this.pressRegisterExpoPushNotification} title="Test Register Expo Push Notification"></react_native_1.Button>
        <react_native_1.Text>{this.expoPushTest}</react_native_1.Text>
      </react_native_1.View>);
    }
}
exports.FirebaseTest = FirebaseTest;
