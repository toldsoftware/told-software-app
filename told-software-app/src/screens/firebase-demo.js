import * as React from 'react';
import { FirebaseTest } from '../api/firebase-test';
export class FirebaseDemoScreen extends React.Component {
    render() {
        return <FirebaseTest />;
    }
}
FirebaseDemoScreen.navigationOptions = {
    title: 'Firebase Demo'
};
