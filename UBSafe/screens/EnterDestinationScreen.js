import React from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { Alert } from 'react-native';
import store from '../store.js';

const homePlace = { description: 'Home', geometry: { location: { lat: 48.8152937, lng: 2.4597668 } }};
const workPlace = { description: 'Work', geometry: { location: { lat: 48.8496818, lng: 2.2940881 } }};

export default class EnterDestinationScreen extends React.Component {

  state = {
    destLat: 0.0,
    destLong: 0.0,
    currentLat: 0.0,
    currentLong: 0.0,
    error: null,
    showUserLocation : true,
    followsUserLocation : true
  }

  getCurrentLocation(travellerID, watcherIDs, travellerDest){
    navigator.geolocation.getCurrentPosition(
      (position) => {
        var travellerSource = new firebase.firestore.GeoPoint(position.coords.latitude, position.coords.longitude);
        var travellerLocation = new firebase.firestore.GeoPoint(position.coords.latitude, position.coords.longitude);
        fetch(store.api_base + 'companionsession', {
          method: 'POST',
          headers:{
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "travellerID": travellerID,
            "watcherIDs": watcherIDs,
            "travellerDest": travellerDest,
            "travellerSource": travellerSource,
            "travellerLocation": travellerLocation,
            "lastUpdated": 0
          }),
        }).then( response => {
          console.log(response);
          if(response.status === 200) {
            response.json().then(responseJSON =>{
              console.log("anus");
              console.log(responseJSON.responseData);
              store.session = responseJSON.responseData.data;
              store.session.id = responseJSON.responseData.id;
              this.props.navigation.navigate('VirtualSafewalkSessionScreen', { session: responseJSON.responseData });
              console.log("yay!");
            });
          }
          else {
            console.log("Error creating companion session");
            console.log(response);
            Alert.alert(
              'Cannot start session',
              'Heck',
              [
                {text: 'OK', onPress: () => console.log('OK Pressed')},
              ],
              { cancelable: false }
            )
          }
        });
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: true, maximumAge: 1000 },
    );
  }

  startVirtualSafewalkSession(lat, long) {
    var user = store.user;
    var travellerID = user.userID;
    var watcherIDs = this.props.navigation.state.params.companions.map(companion => companion.userID);
    var travellerDest = new firebase.firestore.GeoPoint(lat, long);
    this.getCurrentLocation(travellerID, watcherIDs, travellerDest);
  }

  render(){
    return (
        <GooglePlacesAutocomplete
          placeholder='Search'
          minLength={2} // minimum length of text to search
          autoFocus={false}
          returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
          listViewDisplayed='auto'    // true/false/undefined
          fetchDetails={true}
          renderDescription={row => row.description} // custom description render
          onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
            this.startVirtualSafewalkSession(details.geometry.location.lat, details.geometry.location.lng);
          }}
          
          getDefaultValue={() => ''}
          
          query={{
            // available options: https://developers.google.com/places/web-service/autocomplete
            key: 'AIzaSyDyKy4keRw2KcjkqFsiw8BtTLKghrupJ5c',
            language: 'en', // language of the results
            types: 'geocode' // default: 'geocode'
          }}
          
          styles={{
            textInputContainer: {
              width: '100%'
            },
            description: {
              fontWeight: 'bold'
            },
            predefinedPlacesDescription: {
              color: '#1faadb'
            }
          }}
          
          currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
          currentLocationLabel="Current location"
          nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
          GoogleReverseGeocodingQuery={{
            // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
          }}
          GooglePlacesSearchQuery={{
            // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
            rankby: 'distance',
            types: 'food'
          }}

          filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
          predefinedPlaces={[homePlace, workPlace]}

          debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
        />
    );
  }
}