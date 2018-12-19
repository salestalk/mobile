import React, { Component } from 'react';
import { Text, View, Modal, Picker, TouchableOpacity } from 'react-native';
import { colors } from '../../../styles';

export default class CompanySelectModal extends Component {
  valueChange = (itemValue, itemIndex) => {
    this.props.onChange(itemValue);
  };

  render() {
    return (
      <Modal
        transparent={true}
        animationType={'none'}
        visible={this.props.visible}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.7)',
            justifyContent: 'flex-end'
          }}
        >
          <View
            style={{
              height: 30,
              flexDirection: 'row',
              justifyContent: 'flex-end'
            }}
          >
            <TouchableOpacity onPress={this.props.onSuccess}>
              <View style={{ paddingHorizontal: 10 }}>
                <Text
                  style={{
                    color: colors.BRIGHT_GREEN,
                    fontSize: 16,
                    fontWeight: 'bold'
                  }}
                >
                  OK
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <Picker
          style={{ backgroundColor: 'white' }}
          selectedValue={this.props.selected}
          onValueChange={this.valueChange}
        >
          {this.props.companies.map(comp => {
            return (
              <Picker.Item key={comp.name} label={comp.name} value={comp.id} />
            );
          })}
        </Picker>
      </Modal>
    );
  }
}
