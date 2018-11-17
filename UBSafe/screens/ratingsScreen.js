import React from 'react';
import { StyleSheet, View} from 'react-native';
import { Button, Rating, Text  } from 'react-native-elements';
import Firebase from '../firebaseConfig.js';

db = Firebase.firestore();
db.settings({
    timestampsInSnapshots: true
});

export default class RatingsScreen extends React.Component{

  state={
    rating: 0,
    loading: false
  }
  
  submitRating(){
    var rating = this.state.rating;
    fetch(api_base + 'companionsession/' + this.props.navigation.getParam('sessionID') + '/rate', {
      method: 'POST',
      headers:{
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        rating: rating
      }),
    }).then( response => {
      if(response.status === 200){
        db.collection("companion_sessions").doc(this.props.navigation.getParam('sessionID')).delete().then(function(){
          Alert.alert(
            'Thank you for getting home safely',
            [
              {text: 'OK', onPress: () => console.log('OK Pressed')},
            ],
            { cancelable: false }
          )
          this.props.navigation.navigate('HomeScreen'); // WILL THIS WORK?
        })
      }
      else {
        Alert.alert(
          'Could not submit rating',
          [
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ],
          { cancelable: false }
        )
      }
    })
  }

  render(){
    return (
      <View style={styles.container}>
        <Text h3>{"Rate Your Session"}</Text>
        <Rating
          onFinishRating={(rating) => this.setState({ rating: rating })}
          showRating
          type="star"
          startingValue={this.state.rating}
          imageSize={40}
        />
        <Button
          style={styles.button}
          backgroundColor="#005073"
          title="Submit Rating"
          onPress={()=> this.submitRating()}
          disabled={this.state.loading}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    marginTop: 80
  },
  ratingContainer: {
    flex: 4
  },
  sendRatingContainer: {
    flex: 1
  }
});