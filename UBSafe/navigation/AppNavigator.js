import { createSwitchNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import AuthNavigator from './AuthNavigator'

export default createSwitchNavigator(
  {
  // You could add another route here for authentication.
  // Read more at https://reactnavigation.org/docs/en/auth-flow.html
  Main: MainTabNavigator,
  Auth: AuthNavigator
  },
  {
    initialRouteName: 'Main',
  }
);