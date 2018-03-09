import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Picker,
} from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';

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
      selected: 0,
      questions: [
        "Add a new question...",
        'What should I do with the rest of my paycheck?',
        'What movie should I watch tonight?',
        'Where should I go have dinner?',
        'What color socks should I wear?'
      ]
    }
  }

  render() {
    const rainbow = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];
    const items = this.state.questions.map((q, i) => {
      return <Picker.Item label={q} value={q} key={i} />
    })
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          <Text style={{color: '#870000'}}>D</Text>
          <Text style={{color: '#ff0000'}}>e</Text>
          <Text style={{color: '#ff5000'}}>s</Text>
          <Text style={{color: '#ff9000'}}>i</Text>
          <Text style={{color: '#ffc700'}}>c</Text>
          <Text style={{color: '#eeff00'}}>i</Text>
          <Text style={{color: '#aeff00'}}>o</Text>
          <Text style={{color: '#00ff3b'}}>n</Text>
          <Text> </Text>
          <Text style={{color: '#00ffed'}}>m</Text>
          <Text style={{color: '#0099ff'}}>a</Text>
          <Text style={{color: '#1500ff'}}>k</Text>
          <Text style={{color: '#6a00ff'}}>e</Text>
          <Text style={{color: '#bb00ff'}}>r</Text>
          <Text style={{color: '#870067'}}>!</Text>
        </Text>
        <Text style={styles.prompt}>
          What are you trying to decide?
        </Text>
        <Picker
          style={styles.menu}
          itemStyle={styles.menuItem}
          selectedValue={this.state.questions[this.state.selected]}
          onValueChange={(itemValue, itemIndex) => this.setState({selected: itemIndex})}
        >
          {items}
        </Picker>
        <Button
          onPress={() => console.log(this.state.selected)}
          title="Pick for me!"
          color="red"
        />
        <Button
          onPress={() => console.log(this.state.selected)}
          title="See all options"
          color="red"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'black',
    flexDirection: 'column'
  },
  welcome: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
  },
  prompt: {
    color: 'red',
    fontSize: 20,
    textAlign: 'center',
    marginTop: 30
  },
  menuItem: {
    color: 'lightgrey',
    fontSize: 16,
  }
});
