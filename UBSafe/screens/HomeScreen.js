import React from 'react';
import { MapView } from 'expo';
import { AsyncStorage } from "react-native";

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  // We'll add more to state later but for now we'll just add current location data
  constructor(props) {
    super(props);

    this.state = {
      latitude: 0.0,
      longitude: 0.0,
      error: null,
      showUserLocation : true,
      followsUserLocation : true
    };

    global.user = this.props.navigation.getParam('user');
  }

  // On simulators, this defaults to San Francisco for some reason
  // so to properly test this, we'll have to download the app
  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
        });
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 },
    );
  }

  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('user');

      if (value !== null) {
        // We have data!!
        return value;
      }
     } catch (error) {
       console.log(error);
       return null;
     }
  }

  render() {
    return (
      <MapView
        style={{
          flex: 1
        }}
        initialRegion={{
          latitude: this.state.latitude,
          longitude: this.state.longitude,
          latitudeDelta: 0.00922,
          longitudeDelta: 0.00421
        }}
        region={{
          latitude: this.state.latitude,
          longitude: this.state.longitude,
          latitudeDelta: 0.00922,
          longitudeDelta: 0.00421
        }}
        showsUserLocation= {this.state.showUserLocation}
      />
    );
  }
}
