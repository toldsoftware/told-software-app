import React from 'react';
import { StyleSheet, Image, TouchableOpacity } from 'react-native';
import { StackNavigator, NavigationActions } from 'react-navigation';
import { HomeScreen } from './screens/home';
import { DemoListScreen, demoScreens } from './screens/demo-list';

export const AppComponent = StackNavigator({
  Home: { screen: HomeScreen },
  DemoList: { screen: DemoListScreen },
  ...demoScreens,
}, {
    navigationOptions: ({ navigation }) => ({
      // headerTintColor: 'blue',
      headerTitleStyle: styles.headerTitle,
      headerRight: (
        <TouchableOpacity onPress={() => goBackHome(navigation)} >
          <Image source={require('../img/told-logo-128.png')} style={styles.image} />
        </TouchableOpacity>
      )
    })
  }
);

const goBackHome = (navigation) => {
  navigation.dispatch(NavigationActions.reset({
    index: 0,
    actions: [
      NavigationActions.navigate({ routeName: 'Home' })
    ]
  }));
  // while (navigation.state.params.name != 'Home') {
  //   navigation.goBack();
  // }
};

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 18,
  },
  image: {
    width: 32,
    height: 32
  }
});
