import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  PickerIOS
} from 'react-native';

import SQLite from 'react-native-sqlite-storage';
SQLite.DEBUG(true);
SQLite.enablePromise(true);

const database_name = "Audrey.db";
const database_version = "1.0";
const database_displayname = "Audrey's Favorite Things";
const database_size = 200000;
let db;

type Props = {};
export default class App extends Component<Props> {
  constructor() {
    super();
    this.state = {
      question: "What are you trying to decide?"
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Decision Maker!
        </Text>
        <Text style={styles.instructions}>
          What are you trying to decide?
        </Text>
        <PickerIOS
          selectedValue={this.state.question}
          onValueChange={(itemValue, itemIndex) => this.setState({question: itemValue})}
        >
          <PickerIOS.Item
            label="What should I do with the rest of my paycheck?"
            value="What should I do with the rest of my paycheck?"
          />
          <PickerIOS.Item
            label="What movie should I watch?"
            value="What movie should I watch?"
          />
        </PickerIOS>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#be0000',
  },
  welcome: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});
