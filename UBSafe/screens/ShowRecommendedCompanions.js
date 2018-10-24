import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import {
    FlatList
  } from 'react-native';
import { List, ListItem } from 'react-native-elements';
import { AsyncStorage } from "react-native";

export default class RecommendedCompanions extends React.Component {
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

  // Currently, leftIconOnPress is firing immediately which it shouldn't be
  renderItem = ({ item }) => {
    return (
      <ListItem 
        title={ item.userName + ' ' + item.gender + ' ' + item.age }
        hideChevron={ true }
      />
    );
  }

  render() {
    const companions = this.props.navigation.state.params.companions
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
