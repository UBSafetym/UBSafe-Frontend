import React from 'react';
import { MapView } from 'expo';
import { Firebase } from '../firebaseConfig.js';
import { View, StyleSheet } from 'react-native';
import store from '../store.js';
import { Button } from 'react-native-elements';
import BluePhones from '../mapMarkers/bluePhoneLocations.json';
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
    latitudeDelta: 0.00922,
    longitudeDelta: 0.00421,
    error: null,
    showUserLocation : true,
    followsUserLocation : true,
    markers : BluePhones.features,
    showMarkers : true
  };

  // Toggles blue phone map markers
    toggleBluePhones(){
        this.setState({ showMarkers: !this.state.showMarkers });
        console.log(this.state.showMarkers);
    };

    showRegion(region){
      this.setState({ latitude: region.latitude,
                      longitude: region.longitude,
                      latitudeDelta: region.latitudeDelta,
                      longitudeDelta: region.longitudeDelta
                    });
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
      { enableHighAccuracy: false, maximumAge: 1000 },
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
    var key = 0;
    return (
      <View style={styles.parentView}>
      <MapView
        style={styles.mapContainer}
        initialRegion={{
          latitude: this.state.latitude,
          longitude: this.state.longitude,
          latitudeDelta: this.state.latitudeDelta,
          longitudeDelta: this.state.longitudeDelta
        }}
        region={{
          latitude: this.state.latitude,
          longitude: this.state.longitude,
          latitudeDelta: this.state.latitudeDelta,
          longitudeDelta: this.state.longitudeDelta
        }}
        showsUserLocation= {this.state.showUserLocation}
        onRegionChangeComplete={(region) => this.showRegion(region)}
      >
        {this.state.showMarkers && this.state.markers.map(marker => (
            <MapView.Marker
            key={key++}
            coordinate = {{
                    latitude: marker.geometry.coordinates[1],
                    longitude: marker.geometry.coordinates[0]
                }}
            title = {marker.properties.Name}
            pinColor = 'aqua'
            />
        ))}
        </MapView>
        <Button
            style={styles.bluePhoneButton}
            full
            rounded
            backgroundColor="blue"
            onPress={() => this.toggleBluePhones()}
            title={this.state.showMarkers ? "Hide Blue Phones" : "Show Blue Phones"}
        >
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    parentView : {
        position: 'relative',
        width: '100%',
        height: '100%',
        alignItems: 'center'
    },
  mapContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1
  },
    bluePhoneButton: {
        position: 'relative',
        width: 200,
        bottom: -550,
        zIndex: 100,
    }

});
