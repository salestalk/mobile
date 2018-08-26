import React, { Component } from 'react';
import {
  Dimensions,
  StyleSheet,
  StatusBar,
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { colors } from '../../styles';
import { bindActionCreators } from 'redux';
import * as AuthenticationActionCreators from '../../actions/authentication';

export class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      password: ''
    };
  }

  _loginPressed = () => {
    this.props.loginRequest(this.state.userName, this.state.password);
  };
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.imageWrap}>
          <Image
            source={require('../../assets/images/salestalk-logo-green.png')}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
        <View style={styles.textBoxWrap}>
          <TextInput
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.loginText}
            placeholder="Email Address"
            placeholderTextColor="rgba(0,0,0,0.3)"
            onChangeText={text => {
              this.setState({ userName: text });
            }}
            value={this.state.userName}
          />
        </View>
        <View style={styles.textBoxWrap}>
          <TextInput
            style={styles.passwordText}
            placeholder="Password"
            placeholderTextColor="rgba(0,0,0,0.3)"
            secureTextEntry={true}
            onChangeText={text => {
              this.setState({ password: text });
            }}
            value={this.state.password}
          />
        </View>

        <TouchableOpacity
          style={styles.signInButton}
          onPress={this._loginPressed}
        >
          <Text style={styles.signInButtonText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colors.green,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20
  },
  imageWrap: {
    height: 50,
    width: 280,
    marginTop: 60,
    marginBottom: 30,
    marginHorizontal: 40
  },
  image: {
    height: null,
    width: null,
    flex: 1
  },
  textBoxWrap: {
    height: 60
  },
  loginText: {
    flex: 1,
    color: colors.borderGreen,
    fontSize: 18,
    width: Dimensions.get('window').width - 20,
    backgroundColor: colors.white,
    marginBottom: 10,
    paddingHorizontal: 5,
    borderRadius: 3,
    fontWeight: '300',
    alignItems: 'stretch'
  },
  passwordText: {
    flex: 1,
    color: colors.borderGreen,
    fontSize: 18,
    backgroundColor: colors.white,
    marginBottom: 10,
    paddingHorizontal: 5,
    borderRadius: 3,
    fontWeight: '300',
    width: Dimensions.get('window').width - 20
  },
  signInButton: {
    marginTop: 30,
    borderRadius: 3,
    height: 60
  },
  signInButtonText: {
    color: colors.white,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
    fontSize: 20
  }
});

const mapStateToProps = state => ({});

// Actions
const mapDispatchToProps = dispatch => {
  return bindActionCreators(AuthenticationActionCreators, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginScreen);
