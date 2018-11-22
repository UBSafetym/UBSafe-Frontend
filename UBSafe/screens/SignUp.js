import React from 'react';
import { ScrollView } from 'react-native';
import { Card, Button, FormLabel, FormInput } from "react-native-elements";
import * as firebase from 'firebase';
import 'firebase/firestore'
import SelectMultiple from 'react-native-select-multiple'
import { GeoFirestore } from 'geofirestore';
import store from '../store.js';
import { Firebase } from '../firebaseConfig.js';

const genders = ['Male', 'Female', 'Other'];
const fbAppId = '259105561413030';

db = Firebase.firestore();
db.settings({
    timestampsInSnapshots: true
});
authentication = Firebase.auth();
geoFirestore = new GeoFirestore(db.collection('user_locations'));

export default class SignUp extends React.Component {

  state = {
    userID: authentication.currentUser.providerData[0].uid,
    access_token: authentication.currentUser.uid,
    userName: null,
    age: null,
    gender: null,
    prefAgeMin: null,
    prefAgeMax: null,
    prefProximity: null,
    preferredGenders: [],
    loading: false
  }

  onSelectionsChange = (preferredGenders) => {
    this.setState({ preferredGenders })
  }

  createUser(context) {
    // db = this.props.navigation.getParam('db');
    context.setState({ loading: true });
    db.collection("users").doc(this.state.userID).set({
      userID: context.state.userID,
      userName: context.state.userName,
      age: parseInt(context.state.age, 10),
      gender: context.state.gender,
        preferences: {
          ageMin: parseInt(context.state.prefAgeMin, 10),
          ageMax: parseInt(context.state.prefAgeMax, 10),
          proximity: parseInt(context.state.prefProximity, 10),
          female: context.state.preferredGenders.map(entry => entry.label).includes('Female'),
          male: context.state.preferredGenders.map(entry => entry.label).includes('Male'),
          other: context.state.preferredGenders.map(entry => entry.label).includes('Other')
        }
      })
      .then(function() {
        var user = {
          userID: context.state.userID,
          userName: context.state.userName,
          age: parseInt(context.state.age, 10),
          gender: context.state.gender,
          preferences: {
            ageMin: parseInt(context.state.prefAgeMin, 10),
            ageMax: parseInt(context.state.prefAgeMax, 10),
            proximity: parseInt(context.state.prefProximity, 10),
            female: context.state.preferredGenders.map(entry => entry.label).includes('Female'),
            male: context.state.preferredGenders.map(entry => entry.label).includes('Male'),
            other: context.state.preferredGenders.map(entry => entry.label).includes('Other')
          }
        }
        store.user = user;

        navigator.geolocation.getCurrentPosition(
          (position) => {
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;
            geoFirestore.set(user.userID, { coordinates: new firebase.firestore.GeoPoint(latitude, longitude)}).then(() => {
              context.setState({ loading: false });
              context.props.navigation.navigate('Main');
              console.log("Document successfully written!");
            }, (error) => {
              console.log('Error: ' + error);
            });
          },
          (error) => console.log(error),
          { enableHighAccuracy: true, maximumAge: 1000 },
        );
      })
      .catch(function(error) {
        console.error("Error writing document: ", error);
      });  
  }

  render() {
    const { prefAgeMin, prefAgeMax, prefProximity, preferredGenders } = this.state;
    const fieldsFilled =(parseInt(prefAgeMin, 10) > 0 ) && 
                        (parseInt(prefAgeMax, 10) > 0) &&
                        (parseInt(prefAgeMax, 10) > parseInt(prefAgeMin, 10)) && 
                        (parseInt(prefProximity, 10) > 0) &&
                        (preferredGenders.length > 0);
    return (
      <ScrollView>
          <FormLabel>Username</FormLabel>
          <FormInput placeholder="Username..."
            onChangeText={(userName) => this.setState({ userName })}
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
            onChangeText={(prefAgeMin) => this.setState({ prefAgeMin })}
          />

          <FormLabel>Maximum Companion Age</FormLabel>
          <FormInput placeholder="18-50..."
            onChangeText={(prefAgeMax) => this.setState({ prefAgeMax })}
          />

          <FormLabel>Preferred Proximity</FormLabel>
          <FormInput placeholder="In Kilometres..."
            onChangeText={(prefProximity) => this.setState({ prefProximity })}
          />

          <FormLabel>Preferred Genders</FormLabel>
          <SelectMultiple
            items={genders}
            selectedItems={this.state.preferredGenders}
            onSelectionsChange={this.onSelectionsChange}
          />

          <Button
            full
            rounded
            primary
            buttonStyle={{ marginTop: 20, marginBottom: 20 }}
            backgroundColor="#03A9F4"
            title="SIGN UP"
            onPress={() => this.createUser(this)}
            disabled={!fieldsFilled || this.state.loading}
            loading={this.state.loading}
          />
      </ScrollView>
    );
  }
}
