import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Button } from 'react-native-elements';
import store from '../store.js';

export default class LogoutScreen extends React.Component {
  state = {
    loading: false
  }

  logout(){
    store.user = null;
    store.session = null;
    this.props.navigation.dangerouslyGetParent().dangerouslyGetParent().dangerouslyGetParent().navigate('Auth');
  }

  cancel(){
  this.props.navigation.dangerouslyGetParent().dangerouslyGetParent().navigate('HomeStack');
  }    
    
  render(){
    return(
      <View style={styles.container}>
        <Text style={styles.confirmation}>Are you sure you want to log out?
        </Text>
        <Button style={styles.logoutButton}
          loading={this.state.loading}
          disabled={this.state.loading}
          full
          rounded
          primary
          backgroundColor="#F31431"
          title='Logout'
          onPress = {() => this.logout()}
        />
        <Button style={styles.cancelButton}
          loading={this.state.loading}
          disabled={this.state.loading}
          full
          rounded
          primary
          backgroundColor="#23297A"
          title='Cancel'
          onPress = {() => this.cancel()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    logoutButton: {
        position: 'absolute',
        top: 260,
        right: 10
    },
    cancelButton: {
        position: 'absolute',
        top: 260,
        left: 10
    },
    confirmation: {
        position: 'absolute',
        fontSize: 20,
        fontWeight: 'bold',
        top: 160
    }
});