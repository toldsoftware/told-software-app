"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_native_1 = require("react-native");
const react_navigation_1 = require("react-navigation");
const home_1 = require("./screens/home");
const demo_list_1 = require("./screens/demo-list");
// TODO: Handle Notifications in App
// https://docs.expo.io/versions/latest/guides/push-notifications.html
exports.AppComponent = react_navigation_1.StackNavigator(Object.assign({ Home: { screen: home_1.HomeScreen }, DemoList: { screen: demo_list_1.DemoListScreen } }, demo_list_1.demoScreens), {
    navigationOptions: (({ navigation }) => ({
        // headerTintColor: 'blue',
        headerTitleStyle: styles.headerTitle,
        headerRight: (<react_native_1.TouchableOpacity onPress={() => goBackHome(navigation)}>
          <react_native_1.Image source={require('../img/told-logo-128.png')} style={styles.image}/>
        </react_native_1.TouchableOpacity>)
    }))
});
const goBackHome = (navigation) => {
    navigation.dispatch(react_navigation_1.NavigationActions.reset({
        index: 0,
        actions: [
            react_navigation_1.NavigationActions.navigate({ routeName: 'Home' })
        ]
    }));
    // while (navigation.state.params.name != 'Home') {
    //   navigation.goBack();
    // }
};
const styles = react_native_1.StyleSheet.create({
    headerTitle: {
        fontSize: 18,
    },
    image: {
        width: 32,
        height: 32
    }
});
