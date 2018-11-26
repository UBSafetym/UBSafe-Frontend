import React from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as firebase from 'firebase';
import 'firebase/firestore';

export default class EnterDestinationScreen extends React.Component {

  state = {
    error: null
  }

  startVirtualSafewalkSession(destLat, destLong) {
    var watcherIDs = this.props.navigation.state.params.companions.map(companion => companion.userID);
    var travellerDest = new firebase.firestore.GeoPoint(destLat, destLong);
    this.props.navigation.navigate('ConfirmDestinationScreen', { watcherIDs: watcherIDs, travellerDest: travellerDest });
  }

  render(){
    return (
          <GooglePlacesAutocomplete
            placeholder='Search'
            minLength={2} // minimum length of text to search
            autoFocus={false}
            loader={true}
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
            
            currentLocation={false} // Will add a 'Current location' button at the top of the predefined places list
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

            debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
          />
    );
  }
}