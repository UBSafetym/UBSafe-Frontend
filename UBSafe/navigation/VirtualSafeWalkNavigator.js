import { Platform, StatusBar } from "react-native";
import { createStackNavigator } from "react-navigation";
import VirtualSafeWalkScreen from "../screens/VirtualSafeWalkScreen.js";
import RecommendedCompanions from "../screens/ShowRecommendedCompanions.js";

const headerStyle = {
  marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
};

export default createStackNavigator({
  VirtualSafeWalkScreen: {
    screen: VirtualSafeWalkScreen,
    navigationOptions: {
      title: "Virtual Safewalk",
      headerStyle
    }
  },
  ShowRecommendedCompanions: {
    screen: RecommendedCompanions,
    navigationOptions: {
      title: "Recommended Companions",
      headerStyle
    }
  }
});