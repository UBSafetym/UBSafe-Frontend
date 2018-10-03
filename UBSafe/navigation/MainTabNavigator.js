import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import VirtualSafeWalkScreen from '../screens/VirtualSafeWalkScreen';
import SafetyKitScreen from '../screens/SafetyKitScreen';
import { Icon } from 'react-native-elements';

const HomeStack = createStackNavigator({
  Home: HomeScreen,
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Emergency Resources',
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
});

VirtualSafewalkStack.navigationOptions = {
  tabBarLabel: 'Virtual Safewalk',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? `ios-walk${focused ? '' : '-outline'}` : 'md-walk'}
    />
  ),
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
  VirtualSafewalkStack,
  SafetyKitStack,
});
