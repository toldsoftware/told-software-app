import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { MapDemoScreen } from './map-demo';
import { PushNofiticationDemoScreen } from './push-notification-demo';

export const demoScreens = {
    MapDemo: { screen: MapDemoScreen },
    PushNotificationDemo: { screen: MapDemoScreen },
};

export class DemoListScreen extends React.Component {
    static navigationOptions = {
        title: 'Demo List'
    };
    render() {
        const { navigate } = this.props.navigation;
        return (
            <View>
                <Button title="Map Demo" onPress={() => navigate('MapDemo')} />
                <Button title="Push Notification Demo" onPress={() => navigate('PushNotificationDemo')} />
            </View>
        );
    }
}