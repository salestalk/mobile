import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import { LoginScreen } from './authentication';
import { MainTabNavigator } from '../navigation/tabs';

class RootContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.auth.user) {
      return <MainTabNavigator />;
    }
    return <LoginScreen />;
  }
}

// State
const mapStateToProps = state => {
  return {
    auth: _.get(state, 'auth', null)
  };
};

export default connect(mapStateToProps)(RootContainer);
