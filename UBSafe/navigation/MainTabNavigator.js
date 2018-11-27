import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import EmergencyResourcesScreen from '../screens/EmergencyResources.js';
import VirtualSafeWalkScreen from '../screens/VirtualSafeWalkScreen.js';
import RecommendedCompanions from '../screens/ShowRecommendedCompanions.js'
import EnterDestinationScreen from '../screens/EnterDestinationScreen.js';
import VirtualSafewalkSessionScreen from '../screens/VirtualSafewalkSessionScreen.js';
import DestinationLoadingScreen from '../screens/DestinationLoadingScreen.js';
import RatingsScreen from '../screens/ratingsScreen.js';
import LogoutScreen from '../screens/LogoutScreen.js';
import store from '../store.js';
import ConfirmDestinationScreen from '../screens/ConfirmDestinationScreen.js';

onSelectionsChange = (preferredGenders, context) => {
  context.setState({ preferredGenders })
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

const paramsToProps = (SomeComponent, context) => { 
  // turns this.props.navigation.state.params into this.params.<x>
  return class extends React.Component {
    render() {
      console.log("dingus");
      console.log(context);
      const {navigation, ...otherProps} = this.props
      const {state: {params}} = navigation
      return <SomeComponent {...this.props} {...params} />
    }
  }
}

const HomeStack = createStackNavigator({
  Home: HomeScreen,
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-home${focused ? '' : '-outline'}`
          : 'md-home'
      }
    />
  ),
};

const EmergencyResourcesStack = createStackNavigator({
  EmergencyResources: EmergencyResourcesScreen,
});

EmergencyResourcesStack.navigationOptions = {
  tabBarLabel: 'Emergency \nResources',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-alert${focused ? '' : '-outline'}`
          : 'md-alert'
      }
    />
  ),
};

var VirtualSafeWalkInitialRoute = (store.session == null || store.session == undefined) ? 'VirtualSafewalk' : 'VirtualSafewalkSessionScreen';

const VirtualSafewalkStack = createStackNavigator({
  VirtualSafewalk: { 
    screen: paramsToProps(VirtualSafeWalkScreen, this),
    navigationOptions:{}
  },
  ShowRecommendedCompanions: {
    screen: RecommendedCompanions,
    navigationOptions: {
      title: "Select Companions"
    }
  },
  EnterDestinationScreen: {
    screen: EnterDestinationScreen,
    navigationOptions: {
      title: "Enter Destination"
    }
  },
  ConfirmDestinationScreen: {
    screen: ConfirmDestinationScreen,
    navigationOptions: {
      title: "Confirm Destination"
    }
  }, 
  DestinationLoadingScreen: {
    screen: DestinationLoadingScreen,
    navigationOptions: {
      headerLeft: null,
      tabBarVisible: false
    }
  },
  VirtualSafewalkSessionScreen: {
    screen: VirtualSafewalkSessionScreen,
    navigationOptions: {
      title: "Virtual Safewalk",
      headerLeft: null,
      tabBarVisible: false,
      gesturesEnabled: false
    }
  },
  RatingsScreen: {
    screen: RatingsScreen,
    navigationOptions: {
      title: "Rate Your Safewalk",
      headerLeft: null,
      tabBarVisible: false,
      gesturesEnabled: false
    }
  }
}, { initialRouteName: VirtualSafeWalkInitialRoute });

VirtualSafewalkStack.navigationOptions = ({ navigation }) => {
  var visible = (navigation.state.routes[navigation.state.index].routeName === 'VirtualSafewalkSessionScreen') ||
                (navigation.state.routes[navigation.state.index].routeName === 'RatingsScreen');

  let navigationOptions = {
                          tabBarLabel: 'Virtual Safewalk', 
                          tabBarIcon: ({ focused }) => (
                            <TabBarIcon
                              focused={focused}
                              name={Platform.OS === 'ios' ? `ios-walk${focused ? '' : '-outline'}` : 'md-walk'}
                            />
                          ),
                          tabBarVisible: !visible
                          }
  
  return navigationOptions
};
<VirtualSafewalkStack
  screenProps={savePreferences}
/>

const LogoutStack = createStackNavigator({
  Logout: LogoutScreen
});

LogoutStack.navigationOptions = {
  tabBarLabel: 'Logout',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? `ios-log-out${focused ? '' : '-outline'}` : 'logout'}
    />
  ),
};

var MainTabInitialRoute = (store.session == null || store.session == undefined) ? 'HomeStack' : 'VirtualSafewalkStack';
const MainTabNavigator = createBottomTabNavigator({
  HomeStack,
  EmergencyResourcesStack,
  VirtualSafewalkStack,
  LogoutStack
}, { initialRouteName: MainTabInitialRoute });

export default MainTabNavigator;
