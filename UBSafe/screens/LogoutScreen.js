import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-elements';
import store from '../store.js';

export default class LogoutScreen extends React.Component {
  state = {
    loading: false
  }

  logout(){
    store.user = null;
    store.session = null;
    console.log("heyo");
    this.props.navigation.dangerouslyGetParent().dangerouslyGetParent().dangerouslyGetParent().navigate('Auth');
  }

  render(){
    return(
      <View style={styles.loginButtonSection}>
        <Button
          loading={this.state.loading}
          disabled={this.state.loading}
          full
          rounded
          primary
          backgroundColor="#F31431"
          title='Logout'
          onPress = {() => this.logout()}
        />
      </View>
    );
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