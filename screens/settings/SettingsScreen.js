import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { Button } from 'react-native-elements';
import { Banner } from '../../components';
import { colors } from '../../styles';
import { bindActionCreators } from 'redux';
import * as AuthenticationActionCreators from '../../actions/authentication';

class SettingsScreen extends Component {
  logOutPressed = () => {
    this.props.deauthorize();
  };

  render() {
    return (
      <View style={styles.container}>
        <Banner navigation={this.props.navigation} />
        <View style={styles.contentWrap}>
          <Button
            raised
            icon={{ name: 'lock-open' }}
            title="SIGN OUT"
            backgroundColor={colors.red}
            onPress={this.logOutPressed}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start'
  },
  contentWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(AuthenticationActionCreators, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsScreen);
