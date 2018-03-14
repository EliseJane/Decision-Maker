import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/EvilIcons';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  ListView,
  Alert,
  Button,
  TextInput
} from 'react-native';

export default class AllOptions extends Component<> {
  constructor(props) {
    super(props);
    this.state = {
      options: props.options,
      text: ''
    };
  }

  renderRow = (row, sect, id) => {
    const rainbow = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];
    return (
      <View style={styles.row}>
        <TouchableHighlight onPress={() => this.deleteAlert(id)}>
          <Icon name="trash" size={40} color="lightgrey" />
        </TouchableHighlight>
        <Text
          key={id}
          style={{margin: 10, fontSize: 20, color: rainbow[id%6]}}
        >
        {row}
        </Text>
      </View>
    );
  }

  createDataSource = () => {
    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return ds.cloneWithRows(this.state.options);
  }

  deleteAlert = (id) => {
    console.log("ID INSIDE DELETEALERT: ", id);
    Alert.alert(
      'Delete Option',
      'Are you sure you want to delete this option?',
      [
        {text: "Yes, I'm sure", onPress: () => this.deleteOption(id), style: 'destructive'},
        {text: 'Cancel', onPress: () => {}, style: 'cancel'}
      ]
    )
  }

  deleteOption = (id) => {
    let options = this.state.options;
    const option = options[id];

    this.props.db.transaction((tx) => {
      tx.executeSql(`DELETE FROM Options WHERE option = '${option}';`)
    }).then(() => {
      options.splice(id, 1);
      this.setState({options: options});
    }).catch(this.errorCB);
  }

  errorCB = (err) => {
    console.log("error: ", err);
  }

  addOption = () => {
    this.props.db.transaction((tx) => {
      tx.executeSql(`INSERT INTO Options (option, question_id) VALUES ('${this.state.text}', (SELECT id FROM Questions WHERE question = '${this.props.question}'));`);
    }).then(() => {
      let options = this.state.options;
      options.push(this.state.text);
      this.setState({options: options, text: ''});
    }).catch(this.errorCB);
  }

  backToHome = () => {
    this.props.navigator.popToTop();
  }

  render() {
    return(
      <View style={styles.container}>
        <Text style={styles.question}>{this.props.question}</Text>
        <TextInput
          style={styles.add}
          placeholder="+ Add a new option"
          onChangeText={(text) => this.setState({text})}
          value={this.state.text}
        />
        <Button
          onPress={this.addOption}
          title="Save"
          color="lightgrey"
        />
        <Button
          onPress={this.backToHome}
          title="Done"
          color="lightgrey"
        />
        <ListView
          style={styles.list}
          dataSource={this.createDataSource()}
          renderRow={this.renderRow}
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
  question: {
    marginTop: 100,
    marginRight: 20,
    marginBottom: 20,
    marginLeft: 20,
    fontSize: 30,
    color: 'lightgray',
    textAlign: 'center'
  },
  list: {
    marginLeft: 50
  },
  row: {
    flexDirection: 'row'
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
