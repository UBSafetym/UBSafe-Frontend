import React from 'react';
import { View } from 'react-native';
import { Card, Button, FormLabel, FormInput } from "react-native-elements";
//import 'firebase/database';
import 'firebase/firestore'
import SelectMultiple from 'react-native-select-multiple'

const genders = ['Male', 'Female', 'Other'];

export default class SignUp extends React.Component {
  authentication = this.props.navigation.getParam('authentication');

  state = {
    user_id: authentication.currentUser.providerData[0].uid,
    access_token: authentication.currentUser.uid,
    username: null,
    age: null,
    gender: null,
    minimumAge: null,
    maximumAge: null,
    preferredProximity: null,
    preferredGenders: []
  }

  onSelectionsChange = (preferredGenders) => {
    this.setState({ preferredGenders })
  }

  createUser(context) {
    db = this.props.navigation.getParam('db');

    db.collection('users').doc(context.state.user_id).set({
      UserID: context.state.user_id,
      UserName: context.state.username,
      Age: parseInt(context.state.age, 10),
      Gender: context.state.gender,
        Preferences: {
          AgeMin: parseInt(context.state.minimumAge, 10),
          AgeMax: parseInt(context.state.maximumAge, 10),
          Proximity: parseInt(context.state.preferredProximity, 10),
          Female: context.state.preferredGenders.map(entry => entry.label).includes('Female'),
          Male: context.state.preferredGenders.map(entry => entry.label).includes('Male'),
          Other: context.state.preferredGenders.map(entry => entry.label).includes('Other')
        }
    }).then(function(data){
      db.ref('Users/' + context.state.user_id).once('value').then(function(data){
        global.user = data;
        context.props.navigation.navigate('Main', {user: authentication.currentUser, db: db})
      });
    });
  }

  render() {
    return (
      <View>
        <Card>
          <FormLabel>Username</FormLabel>
          <FormInput placeholder="Username..."
            onChangeText={(username) => this.setState({ username })}
          />

          <FormLabel>Age</FormLabel>
          <FormInput placeholder="Age..."
            onChangeText={(age) => this.setState({ age })}
          />

          <FormLabel>Gender</FormLabel>
          <FormInput placeholder="Gender..."
            onChangeText={(gender) => this.setState({ gender })}
          />

          <FormLabel>Minimum Companion Age</FormLabel>
          <FormInput placeholder="18-50..."
            onChangeText={(minimumAge) => this.setState({ minimumAge })}
          />

          <FormLabel>Maximum Companion Age</FormLabel>
          <FormInput placeholder="18-50..."
            onChangeText={(maximumAge) => this.setState({ maximumAge })}
          />

          <FormLabel>Preferred Proximity</FormLabel>
          <FormInput placeholder="In Kilometres..."
            onChangeText={(preferredProximity) => this.setState({ preferredProximity })}
          />

          <FormLabel>Preferred Genders</FormLabel>
          <SelectMultiple
            items={genders}
            selectedItems={this.state.preferredGenders}
            onSelectionsChange={this.onSelectionsChange}
          />

          <Button
            buttonStyle={{ marginTop: 20 }}
            backgroundColor="#03A9F4"
            title="SIGN UP"
            onPress={() => this.createUser(this)}
          />
        </Card>
      </View>
    );
  }
}
