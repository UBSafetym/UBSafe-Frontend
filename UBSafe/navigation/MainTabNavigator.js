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
  VirtualSafewalk: VirtualSafeWalkScreen,
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
                          tabBarLabel: 'Travel', 
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
