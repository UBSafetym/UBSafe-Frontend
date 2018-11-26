import React from 'react';
import store from '../store.js';
import { Alert, View, StyleSheet, ActivityIndicator } from 'react-native';

export default class DestinationLoadingScreen extends React.Component {
  componentDidMount() {
    fetch(store.api_base + 'companionsession', {
      method: 'POST',
      headers:{
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "travellerID": store.user.userID,
        "watcherIDs": this.props.navigation.getParam('watcherIDs'),
        "travellerDest": this.props.navigation.getParam('travellerDest'),
        "travellerSource": this.props.navigation.getParam('travellerSource'),
        "travellerLocation": this.props.navigation.getParam('travellerLocation'),
        "lastUpdated": 0
      }),
    }).then( response => {
      if(response.status === 200) {
        response.json().then(responseJSON => {
          console.log("Session successfully created")
          console.log(responseJSON.responseData);
          store.session = responseJSON.responseData.data;
          store.session.id = responseJSON.responseData.id;
          this.setState({ loading: false });
          this.props.navigation.navigate('VirtualSafewalkSessionScreen', { session: responseJSON.responseData });
        });
      }
      else {
        console.log("Error creating companion session");
        console.log(response);
        Alert.alert(
          'Cannot start session',
          'Heck',
          [
            {text: 'OK', onPress: () => console.log("Heck")},
          ],
          { cancelable: false }
        )
      }
    });
  }

  render(){
    return(
      <View style={[styles.container, styles.horizontal]}>
        <ActivityIndicator 
          size="large" 
          color="#0000ff"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10
  }
})