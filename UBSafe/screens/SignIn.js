import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-elements';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { Firebase } from '../firebaseConfig.js';
import store from '../store.js';

const fbAppId = '259105561413030';

db = Firebase.firestore();
db.settings({
    timestampsInSnapshots: true
});
authentication = Firebase.auth();

export default class SignIn extends React.Component {
  render() {
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
        docRef.get().then(function(doc){
            if(doc.exists) {
              var user = doc.data();
              user.UserID = authentication.currentUser.providerData[0].uid;
              store.user = user; // saves user in global store
              context.props.navigation.navigate('Main', {authentication: authentication, db: db});
            }
            else {
              context.props.navigation.navigate('SignUp', {authentication: authentication, db: db});
            }
        }).catch(function(error){
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
