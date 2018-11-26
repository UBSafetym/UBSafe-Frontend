import React from 'react';
import { View, StyleSheet } from 'react-native';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { Button } from 'react-native-elements';

export default class ConfirmDestinationScreen extends React.Component {

  state = {
    loading: false
  }

  confirmDestination() {
    this.setState({ loading: true });
    navigator.geolocation.getCurrentPosition(
      (position) => {
        var travellerSource = new firebase.firestore.GeoPoint(position.coords.latitude, position.coords.longitude);
        var travellerLocation = new firebase.firestore.GeoPoint(position.coords.latitude, position.coords.longitude);
        this.setState({ loading: false });
        this.props.navigation.navigate('DestinationLoadingScreen', { watcherIDs: this.props.navigation.getParam('watcherIDs'), 
                                                                     travellerDest: this.props.navigation.getParam('travellerDest'),
                                                                     travellerSource: travellerSource,
                                                                     travellerLocation: travellerLocation 
                                                                   });
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: true, maximumAge: 1000 }
    );
  }

  render(){
    return(
      <View style={styles.buttonContainer}>
        <Button
          full
          rounded
          primary
          backgroundColor="#005073"
          title="Start Session"
          onPress={()=> this.confirmDestination()}
          disabled={this.state.loading}
          loading={this.state.loading}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
 }
})