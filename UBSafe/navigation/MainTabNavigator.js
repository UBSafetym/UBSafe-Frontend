import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import EmergencyResourcesScreen from '../screens/EmergencyResources.js';
import VirtualSafeWalkScreen from '../screens/VirtualSafeWalkScreen.js';
import SafetyKitScreen from '../screens/SafetyKitScreen.js';
import RecommendedCompanions from '../screens/ShowRecommendedCompanions.js'
import EnterDestinationScreen from '../screens/EnterDestinationScreen.js';
import VirtualSafewalkSessionScreen from '../screens/VirtualSafewalkSessionScreen.js';
import RatingsScreen from '../screens/ratingsScreen.js';

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
  VirtualSafewalkSessionScreen: {
    screen: VirtualSafewalkSessionScreen,
    navigationOptions: {
      title: "Virtual Safewalk",
      headerLeft: null,
      tabBarVisible: false
    }
  },
  RatingsScreen: {
    screen: RatingsScreen,
    navigationOptions: {
      title: "Rate Your Safewalk",
      headerLeft: null,
      tabBarVisible: false
    }
  }
});

VirtualSafewalkStack.navigationOptions = ({ navigation }) => {
  var visible = (navigation.state.routes[navigation.state.index] === 'VirtualSafewalkSessionScreen') ||
                (navigation.state.routes[navigation.state.index] === 'RatingsScreen');
  let navigationOptions = {
                          tabBarLabel: 'Virtual Safewalk', 
                          tabBarIcon: ({ focused }) => (
                            <TabBarIcon
                              focused={focused}
                              name={Platform.OS === 'ios' ? `ios-walk${focused ? '' : '-outline'}` : 'md-walk'}
                            />
                          ),
                          tabBarVisible: visible
                          }
  
  return navigationOptions
};

const SafetyKitStack = createStackNavigator({
  SafetyKit: SafetyKitScreen,
});

SafetyKitStack.navigationOptions = {
  tabBarLabel: 'Safety Kit',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? `ios-medkit${focused ? '' : '-outline'}` : 'md-medkit'}
    />
  ),
};

export default createBottomTabNavigator({
  HomeStack,
  EmergencyResourcesStack,
  VirtualSafewalkStack,
  SafetyKitStack,
});
