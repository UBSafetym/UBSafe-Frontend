import React from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { MapView } from 'expo';
import { Marker } from 'react-native-maps';
import { List, ListItem } from 'react-native-elements';
import { GeoPoint } from 'firebase/firestore';
import { Firebase } from '../firebaseConfig.js';
import store from '../store.js';

db = Firebase.firestore();
db.settings({
    timestampsInSnapshots: true
});
authentication = Firebase.auth();

const api_base = "http://ubsafe.azurewebsites.net/api/";
const nice = 69; // nice
export default class VirtualSafewalkSessionScreen extends React.Component {
  state = {
    sessionID: null,
    showUserLocation: true,
    travellerLat: 0.0,
    travellerLong: 0.0,
    sourceLat: 0.0,
    sourceLong: 0.0,
    destinationLat: 0.0,
    destinationLong: 0.0,
    error: null,
    joinedWatchers: [{userName: "cormac", gender: "male", age: "21"}],
    active: true
  }

  getMagnitude(curLat, curLong) {
    const feetPerDegree = nice * 5280; // nice
    var latSquared = Math.pow(Math.abs(this.state.travellerLat - curLat), 2);
    var longSquared = Math.pow(Math.abs(this.state.travellerLong - curLong), 2);
    var magnitude = Math.sqrt(latSquared + longSquared);
    var changeInPositionInFeet = magnitude * feetPerDegree;

    return changeInPositionInFeet;
  }

  updateUserLocation(db, travellerLat, travellerLong) {
    db.collection("companion_sessions").doc(this.props.navigation.getParam('session').id).update({
      travellerLoc: new GeoPoint(travellerLat, travellerLong)
    })
  }

  checkReachedDestination() {
    var distanceFromDestination = this.getMagnitude(this.state.destinationLat, this.state.destinationLong);
    return distanceFromDestination < 40;
  }

  getSourcePosition(){
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          sourceLat: position.coords.latitude,
          sourceLong: position.coords.longitude,
          error: null,
        });
        db.collection("companion_session").doc(this.props.navigation.getParam('session').id).update({
          travellerSource: { 
                            _lat: position.coords.latitude, 
                            _long: position.coords.longitude
                           }
        });
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
    
  }

  endSession(db){
    fetch(api_base + 'alert', {
      method: 'POST',
      headers:{
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionID: this.props.navigation.getParam('session').id,
        alertCode: store.alertsToCodes['REACHED_DESTINATION']
      }),
    }).then( response => {
      db.collection("companion_sessions").doc(this.props.navigation.getParam('session').id).update({
        travellerLoc: new GeoPoint(this.state.travellerLong, this.state.travellerLong),
        active: false // Maybe we shouldn't do this. Maybe this should be done when the rating is given
      }).then(function(){
        // Idk if we need a promise
        this.props.navigation.navigate('RateSessionScreen', { companions: this.state.joinedWatchers, sessionID: this.state.sessionID });
      });
    });
  }

  // Might have to change this to componentWillMount()
  componentDidMount() {
    var user = store.user;
    // If the current user is the traveller, set up a watchPosition that will update
    // the state's current traveller position when the traveller's position changes
    // GOTTA HAVE A DIFFERENT CHECK CAUSE THIS WILL BE NULL IF THEY'RE A COMPANION JOINING FROM PUSH NOTIFICIATIONS

    //if(user.userID == this.props.navigation.getParam('session').data.traveller.id) {
    if(!store.sessionID){
      var session = this.props.navigation.getParam('session');
      // Set a watcher on the traveller's position
      // When the position changes, the component's lat/long state will be changed
      // and depending on how far they've moved, we'll update the db as well
      // REFACTOR IN THE FUTURE TO NOT BE SO SPAGHETTIFIED
      this.getSourcePosition();
      this.setState({
        travellerLat: session.data.travellerLoc._lat,
        travellerLong: session.data.travellerLoc._long,
        destinationLat: session.data.travellerDest._lat,
        destinationLong: session.data.travellerDest._long
      });

      navigator.geolocation.watchPosition(
        (location) => {
          var travellerLat = location.coords.latitude;
          var travellerLong = location.coords.longitude;
          this.setState({ travellerLat: travellerLat, travellerLong: travellerLong });
          
          var reachedDestination = this.checkReachedDestination(travellerLat, travellerLong);
          if(reachedDestination) {
            this.endSession(db);
          }
          var changeInPositionInFeet = this.getMagnitude(travellerLat, travellerLong);
          if(changeInPositionInFeet > 20) {
            this.updateUserLocation(db, travellerLat, travellerLong);
          }
        }, 
        (error) => {

        },
        { distanceFilter: 1, enableHighAccuracy: true }
      );

      // If a new watcher has been added to the session, we want to know that so we can rate them afterwards
      var context = this;
      db.collection("companion_sessions").doc(session.id).onSnapshot(function(doc) {
        var joinedWatchers = doc.data().joinedWatchers;
        context.setState({ joinedWatchers: joinedWatchers, sessionID: session.id }); // Gotta change this to take in the session id when coming from push notification
      });
    }
    // If the current user is a companion, set up a listener on the current session record in Firestore
    // PROBABLY NEED TO CHANGE THE 'this.props.navigation.blahblah' here because a companion
    // wouldn't be navigating form the previous screen where this data is set
    else {
      var docRef = db.collection("companion_sessions").doc(store.sessionID);

      docRef.get().then(function(doc){
        if(doc.exists) {
          var data = doc.data();
          this.setState({
            travellerLat: data.travellerLoc._lat,
            travellerLong: data.travellerLoc._long,
            destinationLat: data.travellerDest._lat,
            destinationLong: data.travellerDest._long,
            sourceLat: data.travellerSource._lat,
            sourceLong: data.travellerSource._long
          });
        }
        else{
          console.log("heck");
        }
      });

      docRef.onSnapshot(function(doc) {
        var active = doc.data().active;
        if(!active){
          // Push notification will be handled somewhere
          this.props.navigation.navigate('Home'); // Idk if this is gonna work
        }
        var travellerLat = doc.data().travellerLoc._lat;
        var travellerLong = doc.data().travellerLoc._long;
        this.setState({ travellerLat: travellerLat, 
                        travellerLong: travellerLong 
                      });
      });
    }
  }

  renderItem = ({ item }) => {
    return (
      <ListItem 
        title={ item.userName + ' ' + item.gender + ' ' + item.age }
        hideChevron={ true } />
    );
  }

  renderMarkers() {
    return this.props.places.map((place, i) => (
      <Marker key={i} title={place.name} coordinate={place.coords} />
    ))
  }

  render() {
    // Should have 2 returns: 1 for the traveller and 1 for the companions
    // Traveller screen should just have the buttons for reaching out for help/ending the sesion
    // Companions should just have the map view of the traveller with source and dest
    return(
      <View style={{flex: 1, position: 'relative'}}>
        <View style={styles.mapContainer}>
          <MapView
              style={styles.mapView}
              initialRegion={{
              latitude: this.state.travellerLat,
              longitude: this.state.travellerLong,
              latitudeDelta: 0.00922,
              longitudeDelta: 0.00421
            }}
            region={{
              latitude: this.state.travellerLat,
              longitude: this.state.travellerLong,
              latitudeDelta: 0.00922,
              longitudeDelta: 0.00421
            }}
            showsUserLocation= {this.state.showUserLocation}
          >
            <Marker key={1} title={"Source"} coordinate={{longitude: this.state.sourceLong, latitude: this.state.sourceLat}} />
            <Marker key={2} title={"Destination"} coordinate={{longitude: this.state.destinationLong, latitude: this.state.destinationLat}} />
          </MapView>
        </View>
        <View style={styles.watchersContainer}>
          <List>
            <FlatList
              data={this.state.joinedWatchers}
              renderItem={this.renderItem}
              extraData={this.state.joinedWatchers}
              keyExtractor={item => item.userName}
            />
          </List>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mapContainer: {
    flex: 7,
    position: 'relative'
  },
  mapView: {
    ...StyleSheet.absoluteFillObject 
  },
  watchersContainer: {
    flex: 3
  }
});