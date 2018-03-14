import React, { Component } from 'react';
import {
  StyleSheet,
  NavigatorIOS
} from 'react-native';
import FrontPage from './FrontPage';

export default class App extends Component<{}> {
  render() {
    return (
      <NavigatorIOS
        style={styles.container}
        initialRoute={{
          title: 'All Questions',
          component: FrontPage,
        }}
        barTintColor='red'
        tintColor="lightgrey"
        titleTextColor="black"
        translucent={true}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
