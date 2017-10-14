import * as React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { MapDemoScreen } from './map-demo';
import { PushNotificationDemoScreen } from './push-notification-demo';
// import { FirebaseDemoScreen } from './firebase-demo';
import { ComponentBase } from './base';

export const demoScreens = {
    MapDemo: { screen: MapDemoScreen },
    PushNotificationDemo: { screen: MapDemoScreen },
    // FirebaseDemo: { screen: FirebaseDemoScreen },
};

export class DemoListScreen extends ComponentBase {
    static navigationOptions = {
        title: 'Demo List'
    };
    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.container}>
                <Text style={styles.pargraph}>These are a few components that can be included in your apps.</Text>

                <Button title="Map Demo" onPress={() => navigate('MapDemo')} />
                {/* <Button title="Push Notification Demo" onPress={() => navigate('PushNotificationDemo')} /> */}
                {/* <Button title="Firebase Demo" onPress={() => navigate('FirebaseDemo')} /> */}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    pargraph: {
        padding: 8,
        fontSize: 14,
        textAlign: 'left'
    }
});