import React from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import { Button, FormLabel, FormInput } from 'react-native-elements';
import SelectMultiple from 'react-native-select-multiple';
import store from '../store.js';

const genders = ['Male', 'Female', 'Other'];

export default class VirtualSafeWalkScreen extends React.Component {
  state = {
    user_id: null,
    prefAgeMin: null,
    prefAgeMax: null,
    prefProximity: null,
    preferredGenders: [],
    loading: false,
    prefLoad: false,
    findSessionLoad: false
  }

  onSelectionsChange = (preferredGenders) => {
    this.setState({ preferredGenders })
  }

  componentWillMount(){
    var preferredGenders = [];
    if(store.user.preferences.male) preferredGenders.push({label: "Male", value: "Male"});
    if(store.user.preferences.female) preferredGenders.push({label: "Female", value: "Female"});
    if(store.user.preferences.other) preferredGenders.push({label: "Other", value: "Other"});

    this.setState({ 
                    prefAgeMin: (store.user.preferences.ageMin).toString(),
                    prefAgeMax:  store.user.preferences.ageMax.toString(),
                    prefProximity: store.user.preferences.proximity.toString(),
                    preferredGenders: preferredGenders
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
      <View>
        <FormLabel>Minimum Companion Age</FormLabel>
          <FormInput placeholder="18-50..."
            defaultValue={this.state.prefAgeMin}
            onChangeText={(prefAgeMin) => this.setState({ prefAgeMin })}
            className="ageMin"
          />

        <FormLabel>Maximum Companion Age</FormLabel>
        <FormInput placeholder="18-50..."
          defaultValue={this.state.prefAgeMax}
          onChangeText={(prefAgeMax) => this.setState({ prefAgeMax })}
          className="ageMax"
        />

        <FormLabel>Preferred Companion Proximity</FormLabel>
        <FormInput placeholder=""
          defaultValue={this.state.prefProximity}
          onChangeText={(prefProximity) => this.setState({ prefProximity })}
          className="proximity"
        />

        <FormLabel>Preferred Genders</FormLabel>
        <SelectMultiple
          className="genders"
          items={genders}
          selectedItems={this.state.preferredGenders}
          onSelectionsChange={this.onSelectionsChange}
        />

        <Button
          full
          rounded
          primary
          style={styles.button}
          className="savePrefButton"
          backgroundColor="#189ad3"
          title="Save Preferences"
          disabled={!fieldsFilled}
          onPress={()=> this.props.screenProps.savePreferences(this)}
          disabled={this.state.loading || !fieldsFilled}
          loading={this.state.prefLoad}
        />

        <Button
          full
          rounded
          primary
          style={styles.button}
          className="findCompanionsButton"
          backgroundColor="#005073"
          title="Find Virtual Companion"
          onPress={()=> this.props.screenProps.findCompanions(this)}
          disabled={this.state.loading}
          loading={this.state.findSessionLoad}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    marginTop: 10
  }
});