import React from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GeoPoint } from 'firebase/firestore';
import { AsyncStorage } from 'react-native';

const homePlace = { description: 'Home', geometry: { location: { lat: 48.8152937, lng: 2.4597668 } }};
const workPlace = { description: 'Work', geometry: { location: { lat: 48.8496818, lng: 2.2940881 } }};
const api_base = "http://ubsafe.azurewebsites.net/api/";

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

  getCurrentLocation(){
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          currentLat: position.coords.latitude,
          currentLong: position.coords.longitude,
          error: null,
        });
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
  }

  startVirtualSafewalkSession(lat, long) {
    this._retrieveData('user').then(function(user){
      var travellerID = user.UserID;
      var watcherIDs = this.props.navigation.state.params.companions.map(companion => companion.UserID);
      var travellerDest = new GeoPoint(lat, long);
      var travellerLocation = new GeoPoint(lat, long);
      getCurrentLocation();
      var travellerSource = new GeoPoint(this.state.currentLat, this.state.currentLong);
      /*
      this._retrieve('db').then(function(db){
        var db = db;
        
      });*/
      fetch(api_base + 'companionsessions', {
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
          "travellerLocation": travellerLocation
        }),
      }).then( response => {
        if(response.status === 200) {
          this.props.navigation.navigate("VirtualSafeWalkSessionScreen", {session: response.responseData});
          console.log("yay!");
        }
        else {
          console.log(response);
        }
    });
    console.log(lat + " " + long);
  });
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
          //renderLeftButton={()  => <Image source={require('path/custom/left-icon')} />}
          //renderRightButton={() => <Text>Custom text after the input</Text>}
        />
    );
  }
}