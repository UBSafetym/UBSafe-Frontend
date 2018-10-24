import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Button, FormLabel, FormInput } from 'react-native-elements';
import SelectMultiple from 'react-native-select-multiple';
import { AsyncStorage } from "react-native";

const genders = ['Male', 'Female', 'Other'];

export default class VirtualSafeWalkScreen extends React.Component {
  state={
    // user_id: authentication.currentUser.providerData[0].uidPrefProximity,
    // access_token: authentication.currentUser.uid,
    // username: null,
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
      return valueJson;
     } catch (error) {
       console.log(error);
       return null;
     }
  }

  onSelectionsChange = (preferredGenders) => {
    this.setState({ preferredGenders })
  }

  savePreferences(context) {
    if(context.state.prefProximity == null)
    {
      context.setState({prefProximity: -1});
    }
    this._retrieveData().then(function(data){
      var user = data;
      var user_id = user.UserId;

      fetch('http://ubsafe.azurewebsites.net/api/users/'+user_id, {
        method: 'POST',
        headers:{
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          PrefAgeMin: parseInt(context.state.prefAgeMin, 10),
          PrefAgeMax: parseInt(context.state.prefAgeMax, 10),
          PrefProximity: parseInt(context.state.prefProximity, 10),
          FemaleCompanionsOkay: context.state.preferredGenders.map(entry => entry.label).includes('Female'),
          MaleCompanionsOkay: context.state.preferredGenders.map(entry => entry.label).includes('Male'),
          OtherCompanionsOkay: context.state.preferredGenders.map(entry => entry.label).includes('Other')
        }),
      });
    });
  }

  findCompanions() {
    this._retrieveData().then(function(data){
      var user = data;
      var user_id = user.UserId;
    
    fetch('http://ubsafe.azurewebsites.net/api/recommendations/'+user_id)
      .then( response => {
        if(response.status === 200) {
          // Switch screens with response.json()
          if(response.json().length > 0)
          {
            context.props.navigation.navigate('ShowRecommendedCompanions', {companions: response.json()});
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
        }
        else if(response.status === 400) {
          console.log("No Recommended Companions found");
            Alert.alert(
              'No Recommended Companions found',
              'Please change your preferences',
              [
                {text: 'OK', onPress: () => console.log('OK Pressed')},
              ],
              { cancelable: false }
            )
        }
        else {
          console.log("Find companions request failed");
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
          onPress={()=> this.findCompanions()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
