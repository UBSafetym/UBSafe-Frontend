import React from 'react';
//import { ScrollView, StyleSheet } from 'react-native';
import { FlatList } from 'react-native';
import { List, ListItem } from 'react-native-elements';

export default class RecommendedCompanions extends React.Component {
  state = {  }

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
