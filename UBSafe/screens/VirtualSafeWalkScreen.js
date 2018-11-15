import React from 'react';
import { View, Alert } from 'react-native';
import { Button, FormLabel, FormInput } from 'react-native-elements';
import SelectMultiple from 'react-native-select-multiple';
import { AsyncStorage } from "react-native";

const genders = ['Male', 'Female', 'Other'];
//var api_base = "http://localhost:8080/";
var api_base = "http://ubsafe.azurewebsites.net/api/";

export default class VirtualSafeWalkScreen extends React.Component {
  state = {
    user_id: null,
    prefAgeMin: null,
    prefAgeMax: null,
    prefProximity: null,
    preferredGenders: []
  }

  async _retrieveData() {
    try {
      var value = await AsyncStorage.getItem('user');
      var valueJson = JSON.parse(value);
        console.log(valueJson);
      return valueJson;
     } catch (error) {
       console.log(error);
       return null;
     }
  }

  onSelectionsChange = (preferredGenders) => {
    this.setState({ preferredGenders })
  }

  _storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.log(error);
    }
  }

  savePreferences(context) {
    if(context.state.prefProximity == null)
    {
      context.setState({prefProximity: -1});
    }

    this._retrieveData().then(function(data) {
      var user = data;
      console.log(data);
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
          console.log(response);
        }
      });
    });
  }

  findCompanions(context) {
    this._retrieveData().then(function(data){

      var user = data;
      var user_id = user.UserID;

      fetch(api_base + 'recommendations/' + user_id)
        .then((responseJson) => responseJson.json())
        .then( (response) => {
          console.log(response);
            if(response.length > 0)
            {
              console.log(typeof response);
              context.props.navigation.navigate('ShowRecommendedCompanions', {companions: response })
            }
            else
            {
              console.log("No Recommended Companions returned");
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
          backgroundColor="#189ad3"
          title="Save Preferences"
          onPress={()=> this.savePreferences(this)}
        />

        <Button
          backgroundColor="#005073"
          title="Find Virtual Companion"
          onPress={()=> this.findCompanions(this)}
        />
      </View>
    );
  }
}
