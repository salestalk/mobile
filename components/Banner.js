import React, { Component } from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles';

class Banner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      navigation: props.navigation
    };
  }

  _backButtonPressed() {
    if (this.props.navigation) {
      this.props.navigation.goBack(null);
    }
  }

  render() {
    return (
      <View style={styles.banner}>
        <View style={styles.middle}>
          <Image
            source={require('../assets/images/salestalk-logo-green.png')}
            style={styles.image}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.green,
    flexDirection: 'row',
    height: 80,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 40 : 20,
    paddingHorizontal: 12
  },
  image: {
    height: 26,
    resizeMode: 'contain',
    tintColor: '#fff',
    margin: 4
  },
  title: {
    fontSize: 18,
    fontWeight: '200',
    color: '#fff',
    margin: 8
  },
  leftIcon: {
    width: 60,
    flex: 1
  },
  rightIcon: {
    width: 60
  },
  middle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default Banner;
