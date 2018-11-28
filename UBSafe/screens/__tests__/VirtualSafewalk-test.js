import React from 'react';
import VirtualSafeWalkScreen from '../VirtualSafeWalkScreen.js'
import { shallow } from 'enzyme';
import { FormLabel, FormInput, Button } from 'react-native-elements';
import SelectMultiple from 'react-native-select-multiple';
import store from '../../store.js';

function getCompanions(context) {
  return 1;
}

function savePreferences(context) {
  return 1;
}

describe('VirtualSafeWalkScreen', () => {
  store.user = {
    "age": 21,
    "deviceToken": "ExponentPushToken[Z6NnYfK2C1vtqH-TsDkWT1]",
    "gender": "Male",
    "preferences": {
      "ageMax": 50,
      "ageMin": 1,
      "female": true,
      "male": true,
      "other": true,
      "proximity": 100,
    },
    "userID": "10215891348511047",
    "userName": "John Smith",
  }
  it('Renders properly', () => {
    const wrapper = shallow( 
                            <VirtualSafeWalkScreen
                              screenProps={{findCompanions: getCompanions, savePreferences: savePreferences}}
                            /> );

    expect(wrapper.find(FormLabel).length).toBe(4);
    expect(wrapper.find(FormInput).length).toBe(3);
    expect(wrapper.find(Button).length).toBe(2);
    expect(wrapper.find(SelectMultiple).length).toBe(1);
  });

  it('correctly updates the state parameters in the component', () => {
    const wrapper = shallow( 
                            <VirtualSafeWalkScreen
                            screenProps={{findCompanions: getCompanions, savePreferences: savePreferences}}
                          /> );

    // Store user data for Cormac's account because we aren't testing signup/login
    // so we have to hardcode this
    
    // Check that the component's state is initally null for all fields
    expect(wrapper.state().user_id).toEqual(null);
    expect(wrapper.state().prefAgeMin).toEqual("1");
    expect(wrapper.state().prefAgeMax).toEqual("50");
    expect(wrapper.state().prefProximity).toEqual("100");
    expect(wrapper.state().preferredGenders).toEqual([{label: "Male", value: "Male"}, 
                                                      {label: "Female", value: "Female"},
                                                      {label: "Other", value: "Other"}
                                                    ]);

    // Get the form input elements, define the inputs we want to make, and trigger a changeText
    const ageMinElement = wrapper.find('.ageMin');
    const ageMaxElement = wrapper.find('.ageMax');
    const prefProximityElement = wrapper.find('.proximity');

    const minAgeInput = "18";
    const maxAgeInput = "44";
    const prefProximityInput = "-1";

    ageMinElement.simulate('changeText', minAgeInput);
    ageMaxElement.simulate('changeText', maxAgeInput);
    prefProximityElement.simulate('changeText', prefProximityInput);

    // After changing the text of the inputs, the initially null state fields should now
    // equal the values we passed to them in the changeText actions
    expect(wrapper.state().prefAgeMin).toEqual(minAgeInput);
    expect(wrapper.state().prefAgeMax).toEqual(maxAgeInput);
    expect(wrapper.state().prefProximity).toEqual(prefProximityInput);

    wrapper.find('.savePrefButton').props().onPress();
    wrapper.find('.findCompanionsButton').props().onPress();
  });

  it('Allows you to update your age preferences (valid minAge and maxAge)', () => {
    const wrapper = shallow( 
                            <VirtualSafeWalkScreen
                            screenProps={{findCompanions: getCompanions, savePreferences: savePreferences}}
                          /> );

    // Check that the button is disabled before any data is input into the form fields
    expect(wrapper.find('.savePrefButton').props().disabled).toBe(false);

    // Check that the component's state is initally null for all fields
    expect(wrapper.state().user_id).toEqual(null);
    expect(wrapper.state().prefAgeMin).toEqual("1");
    expect(wrapper.state().prefAgeMax).toEqual("50");
    expect(wrapper.state().prefProximity).toEqual("100");
    expect(wrapper.state().preferredGenders).toEqual([{label: "Male", value: "Male"}, 
                                                      {label: "Female", value: "Female"},
                                                      {label: "Other", value: "Other"}
                                                    ]);
    wrapper.setState({ preferredGenders: ['blah']});

    // Get the form input elements, define the inputs we want to make, and trigger a changeText
    const ageMinElement = wrapper.find('.ageMin');
    const ageMaxElement = wrapper.find('.ageMax');

    const minAgeInput = "20";
    const maxAgeInput = "35";

    ageMinElement.simulate('changeText', minAgeInput);
    ageMaxElement.simulate('changeText', maxAgeInput);

    expect(wrapper.state().prefAgeMin).toEqual(minAgeInput);
    expect(wrapper.state().prefAgeMax).toEqual(maxAgeInput);
    // Save preference button should be enabled since min and max age inputs are valid
    expect(wrapper.find('.savePrefButton').props().disabled).toBe(false); 
  });

  it('Does not allow you to update your age preferences (invalid minAge and maxAge)', () => {
    const wrapper = shallow( 
      <VirtualSafeWalkScreen
      screenProps={{findCompanions: getCompanions, savePreferences: savePreferences}}
    /> );

    // Check that the button is disabled before any data is input into the form fields
    expect(wrapper.find('.savePrefButton').props().disabled).toBe(false);

    // Check that the component's state is initally null for all fields
    expect(wrapper.state().user_id).toEqual(null);
    expect(wrapper.state().prefAgeMin).toEqual("1");
    expect(wrapper.state().prefAgeMax).toEqual("50");
    expect(wrapper.state().prefProximity).toEqual("100");
    expect(wrapper.state().preferredGenders).toEqual([{label: "Male", value: "Male"}, 
                                                      {label: "Female", value: "Female"},
                                                      {label: "Other", value: "Other"}
                                                    ]);

    // Get the form input elements, define the inputs we want to make, and trigger a changeText
    const ageMinElement = wrapper.find('.ageMin');
    const ageMaxElement = wrapper.find('.ageMax');

    const minAgeInput = "40";
    const maxAgeInput = "35";

    ageMinElement.simulate('changeText', minAgeInput);
    ageMaxElement.simulate('changeText', maxAgeInput);

    expect(wrapper.state().prefAgeMin).toEqual(minAgeInput);
    expect(wrapper.state().prefAgeMax).toEqual(maxAgeInput);
    // Save preference button should be enabled since min and max age inputs are valid
    expect(wrapper.find('.savePrefButton').props().disabled).toBe(true);
  });

  it('Does not allow you to save preferences with empty form', () => {
    const wrapper = shallow( 
                            <VirtualSafeWalkScreen
                            screenProps={{findCompanions: getCompanions, savePreferences: savePreferences}}
                          /> );

    // Check that the button is disabled before any data is input into the form fields
    expect(wrapper.find('.savePrefButton').props().disabled).toBe(false);

    // Check that the component's state is initally null for all fields
    expect(wrapper.state().user_id).toEqual(null);
    expect(wrapper.state().prefAgeMin).toEqual("1");
    expect(wrapper.state().prefAgeMax).toEqual("50");
    expect(wrapper.state().prefProximity).toEqual("100");
    expect(wrapper.state().preferredGenders).toEqual([{label: "Male", value: "Male"}, 
                                                      {label: "Female", value: "Female"},
                                                      {label: "Other", value: "Other"}
                                                    ]);

    // Get the form input elements, define the inputs we want to make, and trigger a changeText
    const ageMinElement = wrapper.find('.ageMin');
    const ageMaxElement = wrapper.find('.ageMax');

    const minAgeInput = "";
    const maxAgeInput = "";

    ageMinElement.simulate('changeText', minAgeInput);
    ageMaxElement.simulate('changeText', maxAgeInput);
    wrapper.setState({ prefProximity: null, preferredGenders: []});
    // Should still be disabled because no fields were updated
    expect(wrapper.find('.savePrefButton').props().disabled).toBe(true);
  });
});
