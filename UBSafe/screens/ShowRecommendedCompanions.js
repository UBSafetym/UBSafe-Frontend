import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import {
    ScrollView,
    StyleSheet,
    FlatList
  } from 'react-native';
  import { List, ListItem } from 'react-native-elements';

export default class ShowRecommendedCompanions extends React.Component { 
  companions = this.props.navigation.getParam('companions');
  state={
    // user_id: authentication.currentUser.providerData[0].uidPrefProximity,
    // access_token: authentication.currentUser.uid,
    // username: null,
    // user_id: null,
    // prefAgeMin: null,
    // prefAgeMax: null,
    // prefProximity: -1,
    // preferredGenders: []
  }

  render() {
    return (
        <List>
          <FlatList
            data={companions}
            renderItem={this.renderItem}
            keyExtractor={item => item.userName}
          />
        </List>
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
