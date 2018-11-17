import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import Expo, { AppLoading, Font, Icon } from 'expo';
import AppNavigator from './navigation/AppNavigator';
import store from './store.js';

/*
  LISTEN TO LocationUpdateTrigger in the DB for Users
  When it's set to true, you have to update the record
*/

async function getToken() {
  // Remote notifications do not work in simulators, only on device
  if (!Expo.Constants.isDevice) {
    return;
  }
  let { status } = await Expo.Permissions.askAsync(
    Expo.Permissions.NOTIFICATIONS,
  );
  if (status !== 'granted') {
    return;
  }
  let value = await Expo.Notifications.getExpoPushTokenAsync();
  store.deviceToken = value;
}


export default class App extends React.Component {
  state = {
    isLoadingComplete: false
  };

  // Write case statement here for handling each of the types of push notifications
  handleNotification = ({ origin, data }) => {
    console.log("Notification received");
    console.log(data);
    var alert_type = store.codesToAlerts[data.alarmType];

    switch(alert_type){

      case('TERMINATED'):

      case('REACHED_DESTINATION'):

      case('MOVING_AWAY'):

      case('ALARM_TRIGGERED'):

      case('STAGNANT'):

      case('CONNECTION_LOST'):

      case('ALERT_NEARBY_USERS'):

      case('INVITED_TO_SESSION'):
        store.sessionID = data.sessionID;

      case('JOINED_SESSION'):


      default:

    }
  };

  componentDidMount(){
    let context = this;
    getToken().then(function(){
      context.listener = Expo.Notifications.addListener(context.handleNotification);
    });
  }

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return(
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          <AppNavigator />
        </View>
      );
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Icon.Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      }),
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  }
});
