import React, { Component } from 'react';
import AllOptions from './AllOptions';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Picker,
  Alert,
} from 'react-native';

import SQLite from 'react-native-sqlite-storage';
SQLite.DEBUG(true);
SQLite.enablePromise(true);

const database_name = "Audrey.db";
const database_version = "1.0";
const database_displayname = "Audrey's Favorite Things";
const database_size = 200000;

export default class FrontPage extends Component<> {
  constructor() {
    super();
    this.db = null;
    this.state = {
      selected: 0,
      questions: ['What are you trying to decide?']
    }
    this.loadAndQueryDB();
  }

  loadAndQueryDB = () => {
    SQLite.echoTest().then(() => {
      SQLite.openDatabase({name : "Audrey.db", createFromLocation : "~/db/Audrey.db"}).then((DB) => {
        this.db = DB;
        this.db.transaction(this.populateInitialData).then(() => {
          this.db.transaction(this.queryQuestions).catch(this.errorCB);
        }).catch(this.errorCB);
      }).catch(this.errorCB);
    }).catch(this.errorCB);
  }

  clearDB = (tx) => {
    tx.executeSql('DROP TABLE IF EXISTS Questions;');
    tx.executeSql('DROP TABLE IF EXISTS Options;');
  }

  populateInitialData = (tx) => {
    this.clearDB(tx);

    // in future: no clearDB, only create table if not exist statements

    tx.executeSql('CREATE TABLE IF NOT EXISTS Questions( '
        + 'id INTEGER PRIMARY KEY NOT NULL, '
        + 'question VARCHAR(50) UNIQUE ); ').catch((error) => {
        this.errorCB(error)
    });

    tx.executeSql('CREATE TABLE IF NOT EXISTS Options( '
        + 'id INTEGER PRIMARY KEY NOT NULL, '
        + 'option VARCHAR(50) UNIQUE, '
        + 'question_id INTEGER, '
        + 'FOREIGN KEY ( question_id ) REFERENCES Questions ( id ) ON DELETE CASCADE ); ').catch((error) => {
        this.errorCB(error)
    });

    tx.executeSql('INSERT INTO Questions (question) VALUES ("What should I do with the rest of my paycheck?");');
    tx.executeSql('INSERT INTO Questions (question) VALUES ("What color socks should I wear?");');

    tx.executeSql('INSERT INTO Options (option, question_id) VALUES ("Get a pedicure!", 1);');
    tx.executeSql('INSERT INTO Options (option, question_id) VALUES ("Pay bills :-( ", 1);');
    tx.executeSql('INSERT INTO Options (option, question_id) VALUES ("Buy school supplies", 1);');
    tx.executeSql('INSERT INTO Options (option, question_id) VALUES ("Red", 2);');
    tx.executeSql('INSERT INTO Options (option, question_id) VALUES ("Blue", 2);');
    tx.executeSql('INSERT INTO Options (option, question_id) VALUES ("Purple", 2);');
    tx.executeSql('INSERT INTO Options (option, question_id) VALUES ("Black", 2);');
  }

  // checkIfPopulated = (tx) => {
  //   console.log("INSIDE CHECKIFPOPULATED");
  //   tx.executeSql('SELECT COUNT(question) as q FROM Questions;').catch(() => {
  //     console.log("INSIDE ERROR CATCH");
  //     this.populateInitialData(tx).then((tx) => {
  //       this.queryQuestions(tx);
  //     }).catch(error=>console.log(error));
  //   }).then(([tx, results]) => {
  //     console.log("INSIDE SELECT COUNT");
  //     if (results.rows.item(0).q < 2) {
  //       console.log("INSIDE SELECT COUNT IF");
  //       this.populateInitialData(tx).then((tx) => {
  //         this.queryQuestions(tx);
  //       }).catch(error=>console.log(error));
  //     } else {
  //       console.log("INSIDE SELECT COUNT ELSE");
  //       this.queryQuestions(tx);
  //     }
  //   });
  // }

  queryQuestions = (tx) => {
    tx.executeSql('SELECT question FROM Questions;').then(([tx,results]) => {
      const len = results.rows.length;
      let questions = this.state.questions;
      for (let i = 0; i < len; i++) {
        let row = results.rows.item(i);
        questions.push(row.question);
      }
      this.setState({questions: questions});
    }).catch(this.errorCB);
  }

  newQuestion = () => {

  }

  pickRandom = () => {
    const q = this.state.questions[this.state.selected];
    this.db.transaction(tx => {
      tx.executeSql(`SELECT option FROM Options WHERE Options.question_id = (SELECT id AS q_id FROM Questions WHERE question = '${q}')`)
      .then( ([tx,result]) => {
        const len = result.rows.length;
        const rand = Math.floor(Math.random() * len);
        Alert.alert(
          result.rows.item(rand).option,
          null,
          [{text: "OK", onPress: () => {}}]
        )
      }).catch(this.errorCB);
    }).catch(this.errorCB);
  }

  seeOptions = () => {
    const q = this.state.questions[this.state.selected];
    let options = [];
    this.db.transaction(tx => {
      tx.executeSql(`SELECT option FROM Options WHERE Options.question_id = (SELECT id AS q_id FROM Questions WHERE question = '${q}')`)
      .then( ([tx,result]) => {
        const len = result.rows.length;
        for (let i = 0; i < len; i++) {
          let row = result.rows.item(i);
          options.push(row.option);
        }
        this.props.navigator.push({
          title: q,
          component: AllOptions,
          passProps: {question: q, options: options, db: this.db}
        });
      })
    });
  }

  deleteAlert = () => {
    Alert.alert(
      'Delete Question',
      'Are you sure you want to delete this question and all of its associated options?',
      [
        {text: "Yes, I'm sure", onPress: this.deleteQuestion, style: 'destructive'},
        {text: 'Cancel', onPress: () => {}, style: 'cancel'}
      ]
    )
  }

  deleteQuestion = () => {
    let questions = this.state.questions;
    const question = questions[this.state.selected];

    this.db.transaction((tx) => {
      tx.executeSql(`DELETE FROM Questions WHERE question = '${question}';`)
    }).then(() => {
      questions.splice(this.state.selected, 1);
      this.setState({questions: questions, selected: 0});
    }).catch(this.errorCB);
  }

  errorCB = (err) => {
    console.log("error: ", err);
  }

  render() {
    const items = this.state.questions.map((q, i) => {
      return <Picker.Item label={q} value={q} key={i} />
    });

    const buttons = this.state.selected === 0 || this.state.questions.length === 1 ?
      (<Button
        onPress={this.newQuestion}
        title="Add new question"
        color='red'
      />) :
      (<View style={styles.row}>
        <Button
          onPress={this.pickRandom}
          title="Pick for me!"
          color="red"
        />
        <Button
          onPress={this.seeOptions}
          title="See all options"
          color="red"
        />
      </View>);

    const disabled = this.state.selected === 0 || this.state.questions.length === 1 ?
        true : false;

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
          <Picker
            style={styles.menu}
            itemStyle={styles.menuItem}
            selectedValue={this.state.questions[this.state.selected]}
            onValueChange={(itemValue, itemIndex) => this.setState({selected: itemIndex})}
          >
            {items}
          </Picker>
        {buttons}
        <Button
          disabled={disabled}
          onPress={this.deleteAlert}
          title="Delete question"
          color="yellow"
          style={styles.delete}
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
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  menuItem: {
    color: 'lightgrey',
    fontSize: 16,
  },
  menu: {
    margin: 20
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  delete: {
    fontSize: 10
  }
});
