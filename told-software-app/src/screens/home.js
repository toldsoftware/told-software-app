"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_native_1 = require("react-native");
const base_1 = require("./base");
const assets_1 = require("../components/assets");
class HomeScreen extends base_1.ComponentBase {
    render() {
        const { navigate } = this.props.navigation;
        return (<react_native_1.View style={styles.container}>
        <react_native_1.Image source={assets_1.image_rick} style={styles.profile}/>
        
        <react_native_1.Text style={styles.heading}>Hello, I'm Rick Love!</react_native_1.Text>
        <react_native_1.Text style={styles.heading}>Owner of Told Software LLC</react_native_1.Text>
        <react_native_1.Text style={styles.pargraph}>We solve your stresss, so you can serve your customers.</react_native_1.Text>
        <react_native_1.Text style={styles.pargraph}>This app demonstrates some of the components that we can build for you.</react_native_1.Text>
        <react_native_1.Text style={styles.pargraph}>Also, if you have any questions you can chat with me directly using this app.</react_native_1.Text>
        <react_native_1.Button title="Chat with Rick Love" onPress={() => navigate('Chat')}/>
        <react_native_1.Button title="Open Demo List" onPress={() => navigate('DemoList')}/>
      </react_native_1.View>);
    }
}
HomeScreen.navigationOptions = {
    title: 'Told Software'
};
exports.HomeScreen = HomeScreen;
const styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    profile: {
        width: 200,
        height: 200,
    },
    heading: {
        padding: 8,
        fontSize: 16,
    },
    pargraph: {
        padding: 8,
        fontSize: 14,
        textAlign: 'left'
    }
});
