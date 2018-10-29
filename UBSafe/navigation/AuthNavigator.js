import { Platform, StatusBar } from "react-native";
import { createStackNavigator } from "react-navigation";
import SignUp from "../screens/SignUp.js";
import SignIn from "../screens/SignIn.js";

const headerStyle = {
  marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
};

export default createStackNavigator({
  SignIn: {
    screen: SignIn,
    navigationOptions: {
      title: "Sign In",
      headerStyle
    }
  },
  SignUp: {
    screen: SignUp,
    navigationOptions: {
      title: "Sign Up",
      headerStyle
    }
  }
});