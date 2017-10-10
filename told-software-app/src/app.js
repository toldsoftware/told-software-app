import React from 'react';
import { View, Text } from 'react-native';
export class AppComponent extends React.Component {
    render() {
        return (<View>
        <Text>Hello TEST!</Text>
      </View>);
    }
}
// import * as React from 'react';
// import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
// import { StackNavigator, NavigationActions } from 'react-navigation';
// import { HomeScreen } from './screens/home';
// import { DemoListScreen, demoScreens } from './screens/demo-list';
// 
// // TODO: Handle Notifications in App
// // https://docs.expo.io/versions/latest/guides/push-notifications.html
// 
// 
// 
// export const AppComponent = StackNavigator({
//   Home: { screen: HomeScreen },
//   DemoList: { screen: DemoListScreen },
//   ...demoScreens,
// }, {
//     navigationOptions: (({ navigation }) => ({
//       // headerTintColor: 'blue',
//       headerTitleStyle: styles.headerTitle,
//       headerRight: (
//         <TouchableOpacity onPress={() => goBackHome(navigation)} >
//           <Image source={require('../img/told-logo-128.png')} style={styles.image} />
//         </TouchableOpacity>
//       )
//     })) as any
//   }
// );
//
// const goBackHome = (navigation) => {
//   navigation.dispatch(NavigationActions.reset({
//     index: 0,
//     actions: [
//       NavigationActions.navigate({ routeName: 'Home' })
//     ]
//   }));
//   // while (navigation.state.params.name != 'Home') {
//   //   navigation.goBack();
//   // }
// };
//
// const styles = StyleSheet.create({
//   headerTitle: {
//     fontSize: 18,
//   },
//   image: {
//     width: 32,
//     height: 32
//   }
// });
