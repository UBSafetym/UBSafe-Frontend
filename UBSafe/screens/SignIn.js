import React from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { Button } from 'react-native-elements';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { GeoFirestore } from 'geofirestore';
import { Firebase } from '../firebaseConfig.js';
import store from '../store.js';
import { NavigationActions } from 'react-navigation';

const fbAppId = '259105561413030';

db = Firebase.firestore();
db.settings({
    timestampsInSnapshots: true
});
authentication = Firebase.auth();
geoFirestore = new GeoFirestore(db.collection('user_locations'));

export default class SignIn extends React.Component {
  state = {
    loading: false,
    error: null
  }
  render() {
    return (
      <View style={styles.loginButtonSection}>
        <Button
          loading={this.state.loading}
          disabled={this.state.loading}
          full
          rounded
          primary
          backgroundColor="#3B5998"
          title='Login with Facebook'
          onPress = {() => this.facebookLogin(this)}
        />
      </View>
    );
  }

  async facebookLogin(context) {
    const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync(fbAppId, {
        permissions: ['public_profile'],
    });

    if (type === 'success') {

      // Build Firebase credential with the Facebook access token.
      const credential = firebase.auth.FacebookAuthProvider.credential(token);

      // Sign in with credential from the Facebook user.
      authentication.signInAndRetrieveDataWithCredential(credential).catch((error) => {
        // Handle Errors here.
      });

      if(authentication.currentUser){
        context.setState({ loading: true });
        var docRef = db.collection('users').doc(authentication.currentUser.providerData[0].uid);
        docRef.get().then(function(doc){
            if(doc.exists) {
              var user = doc.data();
              user.userID = authentication.currentUser.providerData[0].uid;
              store.user = user; // saves user in global store

              navigator.geolocation.getCurrentPosition(
                (position) => {
                  var latitude = position.coords.latitude;
                  var longitude = position.coords.longitude;
                  geoFirestore.set(user.userID, { coordinates: new firebase.firestore.GeoPoint(latitude, longitude)}).then(() => {
                    context.setState({ loading: false });
                    if(store.sessionID) {
                      context.props.navigation.navigate('Main', {}, NavigationActions.navigate({routeName: 'VirtualSafewalkStack', action: NavigationActions.navigate({routeName: 'VirtualSafewalkSessionScreen'})}));
                    }
                    else{
                      context.props.navigation.navigate('Main');
                    }
                  }, (error) => {
                    console.log('Error: ' + error);
                  });
                },
                (error) => context.setState({ error: error.message, loading: false }),
                { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
              );
            }
            else {
              context.props.navigation.navigate('SignUp', {authentication: authentication, db: db});
            }
        }).catch(function(error){
            console.log("Error getting document:", error);
        });
      }
      else{

      }
    }
  }
}

const styles = StyleSheet.create({
  loginButtonSection: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
 }
});
