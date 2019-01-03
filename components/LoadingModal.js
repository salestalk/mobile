import React, { Component } from 'react';
import { Modal, ActivityIndicator, StyleSheet, View } from 'react-native';

export default class LoadingModal extends Component {
  render() {
    return (
      <Modal
        visible={this.props.visible}
        transparent={true}
        animationType={'none'}
      >
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: 'rgba(0,0,0,0.8)',
              justifyContent: 'center',
              alignItems: 'center'
            }
          ]}
        >
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: 8,
              padding: 40
            }}
          >
            <ActivityIndicator size={'large'} />
          </View>
        </View>
      </Modal>
    );
  }
}
