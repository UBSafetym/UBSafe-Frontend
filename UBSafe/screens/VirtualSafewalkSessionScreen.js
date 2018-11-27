import React from 'react';
import { StyleSheet, View, FlatList, Alert } from 'react-native';
import { MapView } from 'expo';
import { Marker, Circle } from 'react-native-maps';
import { List, ListItem, Button } from 'react-native-elements';
import * as firebase from 'firebase';
import { Firebase } from '../firebaseConfig.js';
import store from '../store.js';

db = Firebase.firestore();
db.settings({
    timestampsInSnapshots: true
});
authentication = Firebase.auth();

const nice = 69.0; // nice
const feetPerMile = 5280.0;
const feetPerDegree = nice * feetPerMile; // nice
const metersPerDegree = 110000;
export default class VirtualSafewalkSessionScreen extends React.Component {
  state = {
    timer: null,
    sessionID: null,
    showUserLocation: true,
    regionLat: 0.0,
    regionLong: 0.0,
    travellerLat: 0.0,
    travellerLong: 0.0,
    sourceLat: 0.0,
    sourceLong: 0.0,
    destinationLat: 0.0,
    destinationLong: 0.0,
    latitudeDelta: 0.00922,
    longitudeDelta: 0.00421,
    error: null,
    joinedWatchers: [],
    active: true,
    unsubscribe: null,
    loading: false,
    radius: 5,
    nearBySent: false,
    reachedSent: false
  }

  getMagnitude(curLat, curLong) {
    var latSquared = Math.pow(Math.abs(this.state.travellerLat - curLat), 2);
    var longSquared = Math.pow(Math.abs(this.state.travellerLong - curLong), 2);
    var magnitude = Math.sqrt(latSquared + longSquared);
    var changeInPositionInFeet = magnitude * feetPerDegree;

    return changeInPositionInFeet;
  }

  updateUserLocation(travellerLat, travellerLong) {
    this.setState({ travellerLat: travellerLat, travellerLong: travellerLong });
    db.collection("companion_sessions").doc(this.props.navigation.getParam('session').id).update({
      travellerLoc: new firebase.firestore.GeoPoint(travellerLat, travellerLong)
    })
  }

  checkReachedOrNearDestination() {
    console.log("Check near or reached destination");
    var distanceFromDestination = this.getMagnitude(this.state.destinationLat, this.state.destinationLong);
    if(distanceFromDestination < 300.0){
      return "reached";
    }
    else if(distanceFromDestination < 600.0){
      return "near";
    }

    return "neither";
  }

  getSourcePosition() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          sourceLat: position.coords.latitude,
          sourceLong: position.coords.longitude,
          error: null,
        });
        db.collection("companion_sessions").doc(this.props.navigation.getParam('session').id).update({
          travellerSource: { 
                            _lat: position.coords.latitude, 
                            _long: position.coords.longitude
                           }
        });
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: true, maximumAge: 1000 },
    );
  }

  alertEndSession() {
    Alert.alert(
      'Are you sure you want to end your session?',
      'You will not be able to return to this session',
      [
        {text: 'OK', onPress: () => this.endSession()},
      ],
      { cancelable: true }
    )
  }

  alertCompanions() {
    Alert.alert(
      'Send alert to companions?',
      '',
      [
        {text: 'Send Alert', onPress: () => this.sendEmergencyAlert()},
      ],
      { cancelable: true }
    )
  }

  sendReachedDestinationAlert(){
    fetch(store.api_base + 'alert/' + this.props.navigation.getParam('session').id, {
      method: 'POST',
      headers:{
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionID: this.props.navigation.getParam('session').id,
        alertCode: store.alertsToCodes['REACHED_DESTINATION']
      }),
    });
  }

  sendEmergencyAlert() {
    fetch(store.api_base + 'alert/' + this.props.navigation.getParam('session').id, {
      method: 'POST',
      headers:{
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionID: this.props.navigation.getParam('session').id,
        alertCode: store.alertsToCodes['ALARM_TRIGGERED']
      }),
    }).then( response => {
      Alert.alert(
        'Alert Sent',
        'Call 911 if you are in immediate danger',
        [
          {text: 'Close', onPress: () => console.log("ok pressed")},
        ],
        { cancelable: false }
      )
      // Maybe we gotta do different DB updating stuff?
      db.collection("companion_sessions").doc(this.props.navigation.getParam('session').id).update({
        travellerLoc: new firebase.firestore.GeoPoint(this.state.travellerLat, this.state.travellerLong),
      }).then(function() {
        // Idk if we need a promise
      });
    });
  }

  // I'm going to make a different function for pressing the 'end session' button
  // but it might be best to put it in here
  endSession() {
    this.setState({ loading: true }); 
    clearInterval(this.state.timer);
    this.state.unsubscribe();
    var context = this;
    fetch(store.api_base + 'alert/' + this.props.navigation.getParam('session').id, {
      method: 'POST',
      headers:{
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionID: context.props.navigation.getParam('session').id,
        alertCode: store.alertsToCodes['REACHED_DESTINATION']
      }),
    }).then(response => {
        db.collection("companion_sessions").doc(context.props.navigation.getParam('session').id).update({
          active: false
        }).then(function(){
          context.setState({loading: false});
          context.state.unsubscribe();
          context.setState({ nearBySent: false, reachedSent: false });
          context.props.navigation.navigate('RatingsScreen', { companions: context.state.joinedWatchers, sessionID: context.state.sessionID });
        })
    });
  }

  alertReachedDestination() {
    fetch(store.api_base + 'alert/' + this.props.navigation.getParam('session').id, {
      method: 'POST',
      headers:{
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionID: this.props.navigation.getParam('session').id,
        alertCode: store.alertsToCodes['REACHED_DESTINATION']
      }),
    });
  }

  alertNearDestination() {
    fetch(store.api_base + 'alert/' + this.props.navigation.getParam('session').id, {
      method: 'POST',
      headers:{
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionID: this.props.navigation.getParam('session').id,
        alertCode: store.alertsToCodes['NEAR_DESTINATION']
      }),
    });
  }

  checkUserPosition() {
    navigator.geolocation.getCurrentPosition(
      (location) => {
        var travellerLat = location.coords.latitude;
        var travellerLong = location.coords.longitude;
        
        // For now, we're not gonna have a notification for reaching their destination
        // Maybe will handle this in changeInPosition instead
        
        var status = this.checkReachedOrNearDestination(travellerLat, travellerLong);
        console.log(status);
        if(status === "reached" && !this.state.reachedSent) {
          this.setState({ reachedSent: true });
          console.log(this.state.reachedSent);
          this.alertReachedDestination();
        }
        else if(status === "near" && !this.state.nearBySent) {
          this.setState({ nearBySent: true });
          this.alertNearDestination();
        }
        
        console.log("checkUserPosition");
        var changeInPositionInFeet = this.getMagnitude(location.coords.latitude, location.coords.longitude);
        // We'll change this back to 20 once we're done with testing
        if(changeInPositionInFeet > 5) {
          this.updateUserLocation(travellerLat, travellerLong);
        }
      },
      (error) => console.log(error),
      { enableHighAccuracy: true, maximumAge: 1, distanceFilter: 1 },
    );
  }

  componentDidMount() {
    // If the current user is the traveller, set up a watchPosition that will update
    // the state's current traveller position when the traveller's position changes
    if(!store.session || store.session.traveller.id == store.user.userID){
      var session = this.props.navigation.getParam('session');

      // Set up to get original position of the user and their destination
      this.getSourcePosition();
      this.setState({
        regionLat: session.data.travellerLoc._lat,
        regionLong: session.data.travellerLoc._long,
        travellerLat: session.data.travellerLoc._lat,
        travellerLong: session.data.travellerLoc._long,
        destinationLat: session.data.travellerDest._lat,
        destinationLong: session.data.travellerDest._long
      });

      // Set up the timer that will check user location every 2000 seconds
      let timer = setInterval(this.checkUserPosition.bind(this), 2000);
      this.setState({timer});

      // If a new watcher has been added to the session, we want to know that so we can rate them afterwards
      var context = this;
      var unsubscribe = db.collection("companion_sessions").doc(session.id).onSnapshot(function(doc) {
        var joinedWatchers = doc.data().joinedWatchers;
        context.setState({ joinedWatchers: joinedWatchers, sessionID: session.id }); // Gotta change this to take in the session id when coming from push notification
      });
      this.setState({ unsubscribe: unsubscribe });

      Alert.alert(
        'Virtual Companion Session Created',
        '',
        [
          {text: 'OK', onPress: () => console.log("Virtual companion session ok")},
        ],
        { cancelable: false }
      )
    }

    // If the current user is a companion, set up a listener on the current session record in Firestore
    else {
      // Get all the intial information about the session and add the
      // current companion to joinedWatchers
      var docRef = db.collection("companion_sessions").doc(store.session.id);
      var context = this;
      docRef.get().then(function(doc){
        if(doc.exists) {
          var data = doc.data();
          var latitudeDelta = Math.abs(data.travellerSource._lat - data.travellerDest._lat) * 2.0;
          var longitudeDelta = Math.abs(data.travellerSource._long - data.travellerDest._long) * 2.0;
          // var radius = Math.sqrt(latitudeDelta * longitudeDelta * Math.pow(metersPerDegree, 2) / (200.0 * 3.14));
          var radius = Math.sqrt(latitudeDelta*longitudeDelta/200.0);
          context.setState({
            regionLat: (data.travellerSource._lat + data.travellerDest._lat)/2.0,
            regionLong: (data.travellerSource._long + data.travellerDest._long)/2.0,
            travellerLat: data.travellerLoc._lat,
            travellerLong: data.travellerLoc._long,
            destinationLat: data.travellerDest._lat,
            destinationLong: data.travellerDest._long,
            sourceLat: data.travellerSource._lat,
            sourceLong: data.travellerSource._long,
            latitudeDelta: latitudeDelta,
            longitudeDelta: longitudeDelta,
            radius: radius
          });
          var watchers = doc.data().joinedWatchers;
          watchers.push(store.user);
          docRef.update({
            joinedWatchers: watchers
          });
        }
        else{
          console.log("heck");
        }
      });

      // Setup the listener on the session document
      var unsubscribe = docRef.onSnapshot(function(doc) {
        var active = doc.data().active;
        if(!active){
          // Push notification will be handled somewhere
          store.session = null;
          context.state.unsubscribe();
          context.props.navigation.navigate('VirtualSafewalk'); // Idk if this is gonna work
        }
        var travellerLat = doc.data().travellerLoc._lat;
        var travellerLong = doc.data().travellerLoc._long;
        context.setState({ travellerLat: travellerLat, 
                        travellerLong: travellerLong 
                      });
      });
      this.setState({ unsubscribe: unsubscribe });
    }
  }

  renderItem = ({ item }) => {
    return (
      <ListItem 
        title={ item.userName + ', ' + item.gender + ', ' + item.age }
        hideChevron={ true } />
    );
  }

  renderMarkers() {
    return this.props.places.map((place, i) => (
      <Marker key={i} title={place.name} coordinate={place.coords} />
    ))
  }

  updateRegion(region) {
    // var newRadius = Math.sqrt(region.latitudeDelta * region.longitudeDelta * Math.pow(metersPerDegree, 2) / (200.0 * 3.14));
    var newRadius = Math.sqrt(region.latitudeDelta*region.longitudeDelta/(3.14*200.0)) * (metersPerDegree/3.0);
    this.setState({ regionLat: region.latitude,
                    regionLong: region.longitude,
                    latitudeDelta: region.latitudeDelta,
                    longitudeDelta: region.longitudeDelta,
                    radius: newRadius
    });
  }

  render() {
    if(!store.session || store.session.traveller.id == store.user.userID) {
      return(
        <View style={styles.rootContainer}>
          <View style={styles.buttonsContainer}>
            <Button
              full
              rounded
              primary
              style={styles.button}
              backgroundColor="#F31431"
              title="Alert Companions"
              onPress={()=> this.alertCompanions()}
              loading={this.state.loading}
              disabled={this.state.loading}
            />

            <Button
              full
              rounded
              primary
              style={styles.button}
              backgroundColor="#005073"
              title="End Virtual Companion Session"
              onPress={()=> this.alertEndSession()}
              loading={this.state.loading}
              disabled={this.state.loading}
            />
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
    else {
      return(
        <MapView
              style={styles.mapView}
              initialRegion={{
              latitude: this.state.regionLat,
              longitude: this.state.regionLong,
              latitudeDelta: this.state.latitudeDelta,
              longitudeDelta: this.state.longitudeDelta
            }}
            region={{
              latitude: this.state.regionLat,
              longitude: this.state.regionLong,
              latitudeDelta: this.state.latitudeDelta,
              longitudeDelta: this.state.longitudeDelta
            }}
            onRegionChangeComplete={(region) => this.updateRegion(region)}
            pitchEnabled={false}
          >
            <Marker key={1} title={"Source"} coordinate={{longitude: this.state.sourceLong, latitude: this.state.sourceLat}} />
            <Marker key={2} title={"Destination"} coordinate={{longitude: this.state.destinationLong, latitude: this.state.destinationLat}} />
            <Circle
              radius={this.state.radius}
              center={{ latitude: this.state.travellerLat, longitude: this.state.travellerLong }}
              fillColor="#4885ed"
              strokeColor="#FFFFFF"
            />
          </MapView>
      );
    }
  }
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1
  },
  mapContainer: {
    flex: 7,
    position: 'relative'
  },
  mapView: {
    ...StyleSheet.absoluteFillObject 
  },
  watchersContainer: {
    flex: 3
  },
  buttonsContainer: {
    flex: 7,
    justifyContent: 'flex-end'
  },
  button: {
    marginTop: 10
  }
});