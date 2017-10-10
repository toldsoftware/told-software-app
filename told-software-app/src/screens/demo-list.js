"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_native_1 = require("react-native");
const map_demo_1 = require("./map-demo");
const firebase_demo_1 = require("./firebase-demo");
const base_1 = require("./base");
exports.demoScreens = {
    MapDemo: { screen: map_demo_1.MapDemoScreen },
    PushNotificationDemo: { screen: map_demo_1.MapDemoScreen },
    FirebaseDemo: { screen: firebase_demo_1.FirebaseDemoScreen },
};
class DemoListScreen extends base_1.ComponentBase {
    render() {
        const { navigate } = this.props.navigation;
        return (<react_native_1.View>
                <react_native_1.Button title="Map Demo" onPress={() => navigate('MapDemo')}/>
                <react_native_1.Button title="Push Notification Demo" onPress={() => navigate('PushNotificationDemo')}/>
                <react_native_1.Button title="Firebase Demo" onPress={() => navigate('FirebaseDemo')}/>
            </react_native_1.View>);
    }
}
DemoListScreen.navigationOptions = {
    title: 'Demo List'
};
exports.DemoListScreen = DemoListScreen;
