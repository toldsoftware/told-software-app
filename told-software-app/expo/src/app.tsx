import * as React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { StackNavigator, NavigationActions, NavigationScreenProp } from 'react-navigation';
import { HomeScreen } from './screens/home';
import { ChatScreen } from './screens/chat';
import { DemoListScreen, demoScreens } from './screens/demo-list';
import { image_toldLogo128 } from './components/assets';

// TODO: Handle Notifications in App
// https://docs.expo.io/versions/latest/guides/push-notifications.html

type Navigation = NavigationScreenProp<{}, {}>;

export const AppComponent = StackNavigator({
  Home: { screen: HomeScreen },
  Chat: { screen: ChatScreen },
  DemoList: { screen: DemoListScreen },
  ...demoScreens,
}, {
    navigationOptions: (({ navigation }: { navigation: Navigation }) => ({
      // headerTintColor: 'blue',
      headerTitleStyle: styles.headerTitle,
      headerRight: (
        <TouchableOpacity onPress={() => goBackHome(navigation)} >
          <Image source={image_toldLogo128} style={styles.image} />
        </TouchableOpacity>
      )
    })) as any
  }
);

const goBackHome = (navigation: Navigation) => {
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
