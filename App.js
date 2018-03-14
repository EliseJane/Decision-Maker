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
          title: 'Desicion Maker',
          component: FrontPage,
        }}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
