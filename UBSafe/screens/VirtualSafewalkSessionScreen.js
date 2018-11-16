import React from 'react';
import { AsyncStorage, StyleSheet, View } from 'react-native';
import { MapView } from 'expo';
import { List, ListItem, FlatList} from 'react-native-elements';
import { GeoPoint } from 'firebase/firestore-types';

const nice = 69;
export default class VirtualSafewalkSessionScreen extends React.Component{
  state = {
    sessionID: null,
    showUserLocation: true,
    travellerLat: 0.0,
    travellerLong: 0.0,
    sourceLat: 100.0,
    sourceLong: 100.0,
    destinationLat: 0.0,
    destinationLong: 0.0,
    error: null,
    db: null,
    user: null,
    joinedWatchers: [],
    active: true
  }

  async _retrieveData(item) {
    try {
      var value = await AsyncStorage.getItem(item);
      var valueJson = JSON.parse(value);
      console.log(valueJson);
      return valueJson;
     } catch (error) {
       console.log(error);
       return null;
     }
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
    db.collection("companionSessions").doc(this.props.navigation.state.params.session.sessionID).update({
      travellerLocation: new GeoPoint(travellerLat, travellerLong)
    })
  }

  checkReachedDestination(){
    var distanceFromDestination = this.getMagnitude(this.state.destinationLat, this.state.destinationLong);
    return distanceFromDestination < 40;
  }

  endSession(db){
    db.collection("companionSessions").doc(this.props.navigation.state.params.session.sessionID).update({
      travellerLocation: new GeoPoint(this.state.travellerLong, this.state.travellerLong),
      active: false
    }).then(function(){
      // Idk if we need a promise
      this.props.navigation.navigate('RateSessionScreen', { companions: this.state.joinedWatchers, sessionID: this.state.sessionID });
    });
  }

  // Might have to change this to componentWillMount()
  componentDidMount() {
    this._retrieveData('db').then(function(db) {
      this.setState({ db: db });
      this._retrieveData('user').then(function(user) {
        this.setState({ user: user });
        // If the current user is the traveller, set up a watchPosition that will update
        // the state's current traveller position when the traveller's position changes
        // GOTTA HAVE A DIFFERENT CHECK CAUSE THIS WILL BE NULL IF THEY'RE A COMPANION 
        // JOINING FROM PUSH NOTIFICIATIONS
        if(user.userID == this.props.navigation.state.params.session.travellerID) {
          // Set a watcher on the traveller's position
          // When the position changes, the component's lat/long state will be changed
          // and depending on how far they've moved, we'll update the db as well
          // REFACTOR IN THE FUTURE TO NOT BE SO SPAGHETTIFIED
          this.setState({
            travellerLat: this.props.navigation.state.params.session.travellerLocation.latitude,
            travellerLong: this.props.navigation.state.params.session.travellerLocation.longitude,
            destinationLat: this.props.navigation.state.params.session.travellerDest.latitude,
            destinationLong: this.props.navigation.state.params.session.travellerDest.longitude,
            sourceLat: this.props.navigation.state.params.session.travellerSource.latitude,
            sourceLong: this.props.navigation.state.params.session.travellerSource.longitude
          });

          navigator.geolocation.watchPosition(
            (location) => {
              var travellerLat = location.coords.latitude;
              var travellerLong = location.coords.longitude;
              this.setState({ travellerLat: travellerLat, travellerLong: travellerLong });
              
              var reachedDestination = checkReachedDestination(travellerLat, travellerLong);
              if(reachedDestination) {
                endSession(db);
              }
              var changeInPositionInFeet = this.getMagnitude(travellerLat, travellerLong);
              if(changeInPositionInFeet > 20) {
                this.updateUserLocation(db, travellerLat, travellerLong);
              }
            }, 
            (error) => {

            },
            { distanceFilter: 1, enableHighAccuracy: true}
          );

          // If a new watcher has been added to the session, we want to know that so we can rate them afterwards
          db.collection("companionSessions").doc(this.props.navigation.state.params.session.sessionID).onSnapshot(function(doc) {
            var joinedWatchers = doc.data().joinedWatchers;
            this.setState({ joinedWatchers: joinedWatchers, sessionID: doc.data().sessionID });
          });
        }
        // If the current user is a companion, set up a listener on the current session record in Firestore
        // PROBABLY NEED TO CHANGE THE 'this.props.navigation.blahblah' here because a companion
        // wouldn't be navigating form the previous screen where this data is set
        else {
          var docRef = db.collection("companionSessions").doc(this.props.navigation.state.params.session.sessionID);

          docRef.get().then(function(doc){
            if(doc.exists) {
              var data = doc.data();
              this.setState({
                travellerLat: data.travellerLocation.latitude,
                travellerLong: data.travellerLocation.longitude,
                destinationLat: data.travellerDest.latitude,
                destinationLong: data.travellerDest.longitude,
                sourceLat: data.travellerSource.latitude,
                sourceLong: data.travellerSource.longitude
              });
            }
            else{
              console.log("heck");
            }
          })

          docRef.onSnapshot(function(doc) {
            var travellerLat = doc.data().travellerLocation.latitude;
            var travellerLong = doc.data().travellerLocation.longitude;
            this.setState({ travellerLat: travellerLat, 
                            travellerLong: travellerLong 
                          });
          });
        }
      });
    });
  }

  renderItem = ({ item }) => {
    return (
      <ListItem 
        title={ item.userName + ' ' + item.gender + ' ' + item.age }
        hideChevron={ true } />
    );
  }

  render() {
    return(
      <View>
        <View style={styles.mapContainer}>
          <MapView
            style={{
              flex: 1
            }}
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
}

const styles = StyleSheet.create({
  mapContainer: {
    flex: 7
  },
  watchersContainer: {
    flex: 3
  }
});