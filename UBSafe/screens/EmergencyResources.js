import React from "react";
import call from "react-native-phone-call";
import { FlatList, View, Alert, StyleSheet, Text} from 'react-native';
import { List, ListItem, Button, Icon, TouchableOpacity } from 'react-native-elements';
import store from '../store.js';

export default class EmergencyResourcesScreen extends React.Component {
  callTU = (receiver) => {
    call(receiver).catch(console.error);
  };

  alertUsers(context) {
    var user = store.user;
    var user_id = user.userID;

    fetch(store.api_base + 'alert/', {
      method: 'POST',
      headers:{
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "userID": user_id,
        "alertCode": store.alertsToCodes['ALERT_NEARBY_USERS']
      }),
    }).then( response => {
      if(response.status === 200) {
        Alert.alert(
          'Alerts sent!',
          'Call 911 if you are in immediate danger',
          [
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ],
          { cancelable: false }
        )
        console.log("yay!");
      }
      else {
        Alert.alert(
          'Failed to send alerts to nearby users',
          'Call 911 if you are in immediate danger',
          [
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ],
          { cancelable: false }
        )
        console.log("Failed to send alerts to nearby users");
        console.log(response);
      }
    });
  }

  // Currently, leftIconOnPress is firing immediately which it shouldn't be
  renderItem = ({ item }) => {
    return (
      <ListItem 
        title={ item.name }
        hideChevron={ true }
        leftIcon={ { name: 'call' } }
        leftIconOnPress={() => {this.callTU(item.number)}}
      />
    );
  }

  render() {
      // We'll add more numbers to this list
      // Campus security is currently Marshall's phone number
    const emergencyNumbers = [
      { name: "911 Emergency", number: { number: '7783200245', prompt: true } },
      { name: "Campus Security", number: { number: '7783200245', prompt: true } }      
    ];

    return (
        <View style={styles.buttonContainer}>
        <Button
          style={styles.button}
          large
          full
          rounded          
          backgroundColor="#005073"
          icon={{name: 'call', type: 'material-icons'}}
          title='Call 911' 
          onPress={()=> this.callTU(emergencyNumbers[0].number)}
          />
       
        <Button
          style={styles.button}
          large
          full
          rounded          
          backgroundColor="#005073"
          icon={{name: 'security', type: 'material-icons'}}
          title='Campus Security' 
          onPress={()=> this.callTU(emergencyNumbers[1].number)}
          />
    
        <Button
          style={styles.button}
          large
          full
          rounded
          backgroundColor="#005073"
          icon={{name: 'announcement', type: 'material-icons'}}
          title='Alert Nearby Users' 
          onPress={()=> this.alertUsers()}
          />
        </View>   
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 10,
    margin: 10
  },
  buttonContainer: {
     height: '100%',
  //   alignItems: 'center',
     justifyContent: 'center'
  },
  button: {
    margin: 10,
    padding: 30
  }
});
