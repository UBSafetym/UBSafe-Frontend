import React from 'react';
import { Platform, StatusBar, StyleSheet, View, Alert } from 'react-native';
import Expo, { AppLoading, Font, Icon } from 'expo';
import { NavigationActions } from 'react-navigation';
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

function savePreferences(context) {
  context.setState({ loading: true, prefLoad: true });
  // GOTTA CHANGE THIS
  if(context.state.prefProximity == null)
  {
    context.setState({prefProximity: 100});
  }

  var user = store.user;//
  var user_id = user.userID;
  fetch(store.api_base + 'users/' +user_id, {
    method: 'PUT',
    headers:{
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "preferences.ageMin": parseInt(context.state.prefAgeMin, 10),
      "preferences.ageMax": parseInt(context.state.prefAgeMax, 10),
      "preferences.proximity": parseInt(context.state.prefProximity, 10),
      "preferences.female": context.state.preferredGenders.map(entry => entry.label).includes('Female'),
      "preferences.male": context.state.preferredGenders.map(entry => entry.label).includes('Male'),
      "preferences.other": context.state.preferredGenders.map(entry => entry.label).includes('Other')
    }),
  }).then( response => {
    context.setState({ loading: false, prefLoad: false });
    if(response.status === 200) {
      Alert.alert(
        'Preferences Updated',
        '',
        [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ],
        { cancelable: false }
      )
      console.log("yay!");
    }
    else {
      console.log("Error saving preferences");
      console.log(response);
    }
  });
}

function findCompanions(context) {
    var user = store.user;
    var user_id = user.userID;
    context.setState({ loading: true, findSessionLoad: true });
    fetch(store.api_base + 'recommendations/' + user_id)
      .then((responseJson) => responseJson.json())
      .then( (response) => {
        context.setState({ loading: false, findSessionLoad: false });
        if(response.responseData.length > 0)
        {
          context.props.navigation.navigate('ShowRecommendedCompanions', {companions: response.responseData })
        }
        else
        {
          Alert.alert(
            'No Recommended Companions found',
            'Please change your preferences',
            [
              {text: 'OK', onPress: () => console.log('OK Pressed')},
            ],
            { cancelable: false }
          )
        }
      });
}


export default class App extends React.Component {
  state = {
    isLoadingComplete: false
  };

  navigateToSafewalk() {
    this.navigator.dispatch(NavigationActions.navigate(
      { routeName: 'Main', action: NavigationActions.navigate(
        { routeName: 'VirtualSafewalkStack', action: NavigationActions.navigate(
          { routeName: 'VirtualSafewalkSessionScreen'}
        )}
      )}
    ));
  }

  navigateToHomeScreen() {
    this.navigator.dispatch(NavigationActions.navigate( { routeName: 'Main', action: NavigationActions.navigate({ routeName: 'HomeStack' }) }));
  }

  // Write case statement here for handling each of the types of push notifications
  handleNotification = ({ origin, data }) => {
    console.log("Notification received");
    console.log(data);
    var alert_type = store.codesToAlerts[data.alertCode];

    switch(alert_type){

      case('TERMINATED'):
        Alert.alert(
          'Walking Session Ended',
          'Thank you for being safe!',
          [
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ],
          { cancelable: false }
        )
        break;

      case('REACHED_DESTINATION'):
        Alert.alert(
          'Traveller Has Reached Their Destination',
          'Thank you for being safe!',
          [
            {text: 'OK', onPress: () => this.navigateToHomeScreen()},
          ],
          { cancelable: false }
        )
        break;
      case('MOVING_AWAY'):
        break;

      case('ALARM_TRIGGERED'):
        Alert.alert(
          'Traveller is in danger!',
          'Reach out to the appropriate authorities if necessary',
          [
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ],
          { cancelable: false }
        )
        break;

      case('STAGNANT'):
        break

      case('CONNECTION_LOST'):
        break;

      case('ALERT_NEARBY_USERS'):
        Alert.alert(
          'Nearby traveller is in danger!',
          'Reach out to the appropriate authorities if necessary',
          [
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ],
          { cancelable: false }
        )
        break;
      // You'll check if the current user is null in the global store
      // if null, set session
      // otherwise navigate correctly somehow
      case('INVITED_TO_SESSION'):
        store.session = data.data;
        store.session.id = data.id;
        if(store.user) {
          Alert.alert(
            'You have been invited to a virtual safewalk session',
            'Join ' + data.data.traveller.name + '\'s session?',
            [
              {text: 'OK', onPress: () => this.navigateToSafewalk()},
              {text: 'Cancel', onPress: () => console.log("Cancel pressed")}
            ],
            { cancelable: true }
          )
        }
        
        break;
      
      case('JOINED_SESSION'):
        break;
      case('NEAR_DESTINATION'):
        Alert.alert(
          'Traveller is Near Their Destination',
          '',
          [
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ],
          { cancelable: false }
        )
        break;
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
          <AppNavigator 
            ref={nav => { this.navigator = nav; }} 
            screenProps={{savePreferences: savePreferences, findCompanions: findCompanions}}
          />
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
