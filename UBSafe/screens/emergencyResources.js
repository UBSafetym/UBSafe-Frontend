import React from "react";
import call from "react-native-phone-call";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList
} from 'react-native';
import { List, ListItem } from 'react-native-elements';

export default class EmergencyResourcesScreen extends React.Component {
    
    callTU = (receiver) => {
      call(receiver).catch(console.error);
    };

    // Currently, leftIconOnPress is firing immediately which it shouldn't be
    renderItem = ({ item }) => {
      return (
        <ListItem 
          title={ item.name }
          hideChevron={ true }
          leftIcon={ { name: 'call' } }
          leftIconOnPress={this.callTU(item.number)}
        />
      );
    }

    render() {
      // We'll add more numbers to this list
      const emergencyNumbers = [
        { name: "Campus Security", number: { number: '6048222222', prompt: true } },
        { name: "Poison Control", number: { number: '333333333', prompt: true } }
      ];

      return (
        <List>
          <FlatList
            data={emergencyNumbers}
            renderItem={this.renderItem}
            keyExtractor={item => item.name}
          />
        </List>
      );
    }
  }
