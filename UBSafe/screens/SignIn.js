import React from 'react';
import { Platform, StatusBar, StyleSheet, View, Navigator } from 'react-native';
import { AppLoading, Asset, Font, Icon } from 'expo';
import { Button } from 'react-native-elements';
import * as firebase from 'firebase';
import 'firebase/firestore';

const fbAppId = '259105561413030';

// Initialize Firebase
var firebaseConfig = {
  apiKey: "AIzaSyAmqSW01bK3HiI13OUk4zA6o4QQZot4eR8",
  authDomain: "ubsafe-a816e.firebaseapp.com",
  databaseURL: "https://ubsafe-a816e.firebaseio.com",
  projectId: "ubsafe-a816e",
  storageBucket: "ubsafe-a816e.appspot.com",
  messagingSenderId: "160002718260"
};

firebase.initializeApp(firebaseConfig);
authentication = firebase.auth();

db = firebase.firestore();

db.settings({
  timestampsInSnapshots: true
});

// Listen for authentication state to change.
authentication.onAuthStateChanged((user) => {
  if (user != null) {
  }
});

export default class SignIn extends React.Component {
  render(){
    return ( 
      <View style={styles.loginButtonSection}>
        <Button
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
    
      var docRef = db.collection('users').doc(authentication.currentUser.providerData[0].uid);

      docRef.get().then(function(doc) {
        if (doc.exists) {
            context.props.navigation.navigate('Main', {authentication: authentication, db: db});
        }
        else {
          context.props.navigation.navigate('SignUp', {authentication: authentication, db: db});
        }
      }).catch(function(error) {
          console.log("Error getting document:", error);
      });
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