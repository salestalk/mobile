import React, { Component } from 'react';
import { View, StatusBar } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import { LoginScreen } from './authentication';
import { MainTabNavigator } from '../navigation/tabs';
import TimeSheetNavigator from '../navigation/stacks/TimeSheetNavigator';

class RootContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { user } = this.props.auth;
    if (user) {
      if (user.timeSheetOnly) {
        return (
          <View style={{ flex: 1 }}>
            <StatusBar barStyle={'default'} />
            <TimeSheetNavigator screenProps={{ user }} />
          </View>
        );
      } else {
        return <MainTabNavigator />;
      }
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
