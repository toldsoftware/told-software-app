import * as React from 'react';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import { ComponentBase } from './base';
import { image_rick } from '../components/assets';
export class HomeScreen extends ComponentBase {
    render() {
        const { navigate } = this.props.navigation;
        return (<View style={styles.container}>
        <Image source={image_rick} style={styles.profile}/>
        
        <Text style={styles.heading}>Hello, I'm Rick Love!</Text>
        <Text style={styles.heading}>Owner of Told Software LLC</Text>
        <Text style={styles.pargraph}>We solve your stresss, so you can serve your customers.</Text>
        <Text style={styles.pargraph}>This app demonstrates some of the components that we can build for you.</Text>
        <Text style={styles.pargraph}>Also, if you have any questions you can chat with me directly using this app.</Text>
        <Button title="Chat with Rick Love" onPress={() => navigate('Chat')}/>
        <Button title="Open Demo List" onPress={() => navigate('DemoList')}/>
      </View>);
    }
}
HomeScreen.navigationOptions = {
    title: 'Told Software'
};
const styles = StyleSheet.create({
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
