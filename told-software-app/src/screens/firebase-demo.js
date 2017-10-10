"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const firebase_test_1 = require("../api/firebase-test");
class FirebaseDemoScreen extends React.Component {
    render() {
        return <firebase_test_1.FirebaseTest />;
    }
}
FirebaseDemoScreen.navigationOptions = {
    title: 'Firebase Demo'
};
exports.FirebaseDemoScreen = FirebaseDemoScreen;
