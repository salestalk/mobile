import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { colors } from '../styles';

const MainLoading = () => {
  return (
    <View style={styles.blueWrap}>
      <Image
        source={require('../assets/images/salestalk-logo-green.png')}
        resizeMode="contain"
        style={styles.image}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  blueWrap: {
    flex: 1,
    backgroundColor: colors.green,
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    marginHorizontal: 40,
    height: 50
  }
});

export default MainLoading;
