import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  ListView,
  Alert,
} from 'react-native';

export default class AllOptions extends Component<> {
  render() {
    const rainbow = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];
    const ops = this.props.options.map((op, i) => {
      return (<Text key={i} style={{margin: 10, fontSize: 20, color: rainbow[i%6]}}>{op}</Text>);
    });

    return(
      <View style={styles.container}>
        <Text style={styles.question}>{this.props.question}</Text>
        <View style={styles.list}>
          {ops}
        </View>
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
  question: {
    fontSize: 30,
    color: 'lightgray',
    textAlign: 'center'
  },
  list: {
    margin: 20
  }
});
