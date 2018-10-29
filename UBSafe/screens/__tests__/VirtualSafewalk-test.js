import React from 'react';
import VirtualSafeWalkScreen from '../VirtualSafeWalkScreen.js'
import { shallow } from 'enzyme';



describe('VirtualSafeWalkScreen', () => {
  describe('when user updates their preferences', () => {
    it ('correctly updates the state parameters in the component', () => {
      const wrapper = shallow(
        <VirtualSafeWalkScreen/>,
      );

      // Store user data for Cormac's account because we aren't testing signup/login
      // so we have to hardcode this
      wrapper.instance()._storeData('user', {UserId: '10215891348511047'});
      
      // Check that the component's state is initally null for all fields
      expect(wrapper.state().user_id).toEqual(null);
      expect(wrapper.state().prefAgeMin).toEqual(null);
      expect(wrapper.state().prefAgeMax).toEqual(null);
      expect(wrapper.state().prefProximity).toEqual(null);
      expect(wrapper.state().preferredGenders).toEqual([]);

      
      // Get the form input elements, define the inputs we want to make, and trigger a changeText
      const ageMinElement = wrapper.find('.ageMin');
      const ageMaxElement = wrapper.find('.ageMax');
      const prefProximityElement = wrapper.find('.proximity');
      //const prefGendersElement = wrapper.find('.genders');

      const minAgeInput = "18";
      const maxAgeInput = "44";
      const prefProximityInput = "-1";
      //const prefGendersInput = [{ label: 'female' }, { label: 'male' }];

      ageMinElement.simulate('changeText', minAgeInput);
      ageMaxElement.simulate('changeText', maxAgeInput);
      prefProximityElement.simulate('changeText', prefProximityInput);

      // After changing the text of the inputs, the initially null state fields should now
      // equal the values we passed to them in the changeText actions
      expect(wrapper.state().prefAgeMin).toEqual(minAgeInput);
      expect(wrapper.state().prefAgeMax).toEqual(maxAgeInput);
      expect(wrapper.state().prefProximity).toEqual(prefProximityInput);
      //expect(wrapper.state().preferredGenders).toEqual(prefGendersInput);

    });
  });
});
