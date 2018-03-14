import React, { Component } from 'react';
import AllOptions from './AllOptions';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput
} from 'react-native';

export default class NewQuestion extends Component<> {
  constructor(props) {
    super(props);
    this.state = {
      text: ''
    };
  }

  addQuestion = () => {
    const q = this.state.text;
    this.props.db.transaction((tx) => {
      tx.executeSql(`INSERT INTO Questions (question) VALUES ('${q}');`);
    }).then(() => {
      this.props.questions.push(q);
      this.setState({text: ''});
      this.props.navigator.push({
        title: q,
        component: AllOptions,
        passProps: {question: q, options: [], db: this.props.db}
      });
    }).catch(this.errorCB);
  }

  render() {
    return(
      <View style={styles.container}>
        <Text style={styles.title}>
          <Text style={{color: 'maroon'}}>W</Text>
          <Text style={{color: 'darkred'}}>h</Text>
          <Text style={{color: 'crimson'}}>a</Text>
          <Text style={{color: 'orangered'}}>t</Text>
          <Text> </Text>
          <Text style={{color: 'tomato'}}>a</Text>
          <Text style={{color: 'darkorange'}}>r</Text>
          <Text style={{color: 'orange'}}>e</Text>
          <Text> </Text>
          <Text style={{color: 'goldenrod'}}>y</Text>
          <Text style={{color: 'yellow'}}>o</Text>
          <Text style={{color: 'yellowgreen'}}>u</Text>
          <Text> </Text>
          <Text style={{color: 'greenyellow'}}>t</Text>
          <Text style={{color: 'limegreen'}}>r</Text>
          <Text style={{color: 'green'}}>y</Text>
          <Text style={{color: 'darkgreen'}}>i</Text>
          <Text style={{color: 'seagreen'}}>n</Text>
          <Text style={{color: 'teal'}}>g</Text>
          <Text> </Text>
          <Text style={{color: 'mediumturquoise'}}>t</Text>
          <Text style={{color: 'deepskyblue'}}>o</Text>
          <Text> </Text>
          <Text style={{color: 'blue'}}>d</Text>
          <Text style={{color: 'royalblue'}}>e</Text>
          <Text style={{color: 'blueviolet'}}>c</Text>
          <Text style={{color: 'darkviolet'}}>i</Text>
          <Text style={{color: 'indigo'}}>d</Text>
          <Text style={{color: 'violet'}}>e</Text>
          <Text style={{color: 'plum'}}>?</Text>
        </Text>
        <TextInput
          style={styles.add}
          placeholder="+ Add a new question"
          onChangeText={(text) => this.setState({text})}
        />
        <Button
          onPress={this.addQuestion}
          title="Save"
          color="lightgrey"
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
  title: {
    marginRight: 20,
    marginBottom: 20,
    marginLeft: 20,
    fontSize: 30,
    color: 'lightgray',
    textAlign: 'center'
  },
  add: {
    fontSize: 20,
    backgroundColor: 'lightgrey',
    color: 'black',
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    padding: 10
  }
});
