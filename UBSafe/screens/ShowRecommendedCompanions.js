import React from 'react';
import { StyleSheet, View } from 'react-native';
import { FlatList } from 'react-native';
import { List, ListItem, CheckBox, Button } from 'react-native-elements';

export default class RecommendedCompanions extends React.Component {
  state = { 
    selectedCompanions: [],
    loading: false
  }

  toggleCompanion(item) {
    var selectedCompanions = [...this.state.selectedCompanions]; // make a separate copy of the array
    if(this.state.selectedCompanions.includes(item)) {
      item.checked = false;
      var index = selectedCompanions.indexOf(item);
      selectedCompanions.splice(index, 1);
      this.setState({ selectedCompanions: selectedCompanions });
    }
    else {
      item.checked = true;
      selectedCompanions.push(item);
      this.setState({ selectedCompanions: selectedCompanions });
    }
  };

  enterLocation(){
    this.setState({ loading: true });
    this.props.navigation.navigate('EnterDestinationScreen', {companions: this.state.selectedCompanions});
  };

  // Currently, leftIconOnPress is firing immediately which it shouldn't be
  renderItem = ({ item }) => {
    const checked = this.state.selectedCompanions.includes(item);
    return (
      <ListItem
        key={item.userID}
        title={
          <CheckBox
            title={item.userName + ', ' + item.gender + ', ' + item.age}
            onPress={() => this.toggleCompanion(item)}
            checked={checked}
          />
        }
      />
    );
  }

  render() {
    const companions = this.props.navigation.state.params.companions
    return (
      <View style={styles.rootContainer}>
        <View style={styles.companionsContainer}>
          <List>
            <FlatList
              data={companions}
              renderItem={this.renderItem}
              extraData={this.state.selectedCompanions}
              keyExtractor={item => item.userID}
            />
          </List>
        </View>
        <View style={styles.startSesssionContainer}>
          <Button
            full
            rounded
            primary
            backgroundColor="#005073"
            title="Start Safewalk"
            onPress={()=> this.enterLocation()}
            disabled={this.state.selectedCompanions.length <= 0 || this.state.selectedCompanions.length > 4}
            loading={this.state.loading}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1
  },
  companionsContainer:{
    flex: 9
  },
  startSesssionContainer: {
    flex: 1
  }
})
