import React from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import { Button, FormLabel, FormInput } from 'react-native-elements';
import SelectMultiple from 'react-native-select-multiple';
import store from '../store.js';

const genders = ['Male', 'Female', 'Other'];
//var api_base = "http://localhost:8080/";
const api_base = "http://ubsafe.azurewebsites.net/api/";

export default class VirtualSafeWalkScreen extends React.Component {
  state = {
    user_id: null,
    prefAgeMin: null,
    prefAgeMax: null,
    prefProximity: null,
    preferredGenders: [],
    loading: false
  }

  onSelectionsChange = (preferredGenders) => {
    this.setState({ preferredGenders })
  }

  savePreferences(context) {
    // GOTTA CHANGE THIS
    if(context.state.prefProximity == null)
    {
      context.setState({prefProximity: -1});
    }

    var user = store.user;
    var user_id = user.UserID;

    fetch(api_base + 'users/' +user_id, {
      method: 'PUT',
      headers:{
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "Preferences.AgeMin": parseInt(context.state.prefAgeMin, 10),
        "Preferences.AgeMax": parseInt(context.state.prefAgeMax, 10),
        "Preferences.Proximity": -1,
        "Preferences.Female": context.state.preferredGenders.map(entry => entry.label).includes('Female'),
        "Preferences.Male": context.state.preferredGenders.map(entry => entry.label).includes('Male'),
        "Preferences.Other": context.state.preferredGenders.map(entry => entry.label).includes('Other')
      }),
    }).then( response => {
      if(response.status === 200) {
        console.log("yay!");
      }
      else {
        console.log("Error saving preferences");
        console.log(response);
      }
    });
  }

  findCompanions(context) {
      var user = store.user;
      var user_id = user.UserID;
      context.setState({ loading: true });
      fetch(api_base + 'recommendations/' + user_id)
        .then((responseJson) => responseJson.json())
        .then( (response) => {
          context.setState({ loading: false });
          if(response.length > 0)
          {
            context.props.navigation.navigate('ShowRecommendedCompanions', {companions: response })
          }
          else
          {
            Alert.alert(
              'No Recommended Companions found',
              'Please change your preferences',
              [
                {text: 'OK', onPress: () => console.log('OK Pressed')},
              ],
              { cancelable: false }
            )
          }
        });
  }

  render() {
    return (
      <View>
        <FormLabel>Minimum Companion Age</FormLabel>
          <FormInput placeholder="18-50..."
            onChangeText={(prefAgeMin) => this.setState({ prefAgeMin })}
          />

        <FormLabel>Maximum Companion Age</FormLabel>
        <FormInput placeholder="18-50..."
          onChangeText={(prefAgeMax) => this.setState({ prefAgeMax })}
        />

        <FormLabel>Preferred Companion Proximity</FormLabel>
        <FormInput placeholder=""
          onChangeText={(prefProximity) => this.setState({ prefProximity })}
        />

        <FormLabel>Preferred Genders</FormLabel>
          <SelectMultiple
            items={genders}
            selectedItems={this.state.preferredGenders}
            onSelectionsChange={this.onSelectionsChange}
          />

        <Button
          style={styles.button}
          backgroundColor="#189ad3"
          title="Save Preferences"
          onPress={()=> this.savePreferences(this)}
        />

        <Button
          style={styles.button}
          backgroundColor="#005073"
          title="Find Virtual Companion"
          onPress={()=> this.findCompanions(this)}
          disabled={this.state.loading}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    marginTop: 10
  }
});