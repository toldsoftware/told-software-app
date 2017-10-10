import * as React from 'react';
import { View, Button } from 'react-native';
import { MapDemoScreen } from './map-demo';
import { FirebaseDemoScreen } from './firebase-demo';
import { ComponentBase } from './base';
export const demoScreens = {
    MapDemo: { screen: MapDemoScreen },
    PushNotificationDemo: { screen: MapDemoScreen },
    FirebaseDemo: { screen: FirebaseDemoScreen },
};
export class DemoListScreen extends ComponentBase {
    render() {
        const { navigate } = this.props.navigation;
        return (<View>
                <Button title="Map Demo" onPress={() => navigate('MapDemo')}/>
                <Button title="Push Notification Demo" onPress={() => navigate('PushNotificationDemo')}/>
                <Button title="Firebase Demo" onPress={() => navigate('FirebaseDemo')}/>
            </View>);
    }
}
DemoListScreen.navigationOptions = {
    title: 'Demo List'
};
