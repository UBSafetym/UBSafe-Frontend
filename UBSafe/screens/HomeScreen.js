import React from 'react';
import { MapView } from 'expo';
import { Firebase } from '../firebaseConfig.js';
import store from '../store.js'
db = Firebase.firestore();
db.settings({
    timestampsInSnapshots: true
});

authentication = Firebase.auth();

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    latitude: 0.0,
    longitude: 0.0,
    error: null,
    showUserLocation : true,
    followsUserLocation : true
  };

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

    var deviceToken = store.deviceToken;
      
    db.collection('users').doc(authentication.currentUser.providerData[0].uid).update({ deviceToken: deviceToken }).then(function(data){
      console.log("Oh heck ya bud");
    })
    .catch(function(error){
      console.log("heck");
      console.log(error);
    })
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
