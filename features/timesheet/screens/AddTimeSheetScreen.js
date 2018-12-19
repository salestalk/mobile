import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Keyboard,
  KeyboardAvoidingView
} from 'react-native';
import moment from 'moment';
import { Constants, Haptic } from 'expo';
import { Feather } from '@expo/vector-icons';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { colors } from '../../../styles';
import { getCompanyList } from '../util';
import { CompanySelectModal } from '../components';

export default class AddTimeSheetScreen extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      laoding: false,
      isStartDateTimePickerVisible: false,
      isEndDateTimePickerVisible: false,
      companies: [],
      companyModalVisible: false,
      company: null,
      tempCompany: '',
      hours: 0,
      startDate: '',
      endDate: '',
      valid: false
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
    getCompanyList(this.props.screenProps.user)
      .then(res => res.json())
      .then(result => {
        const companies = result.data.map(companies => {
          return {
            name: companies[0].Value,
            id: companies[1].Value
          };
        });
        this.setState({ loading: false, companies });
      })
      .catch(e => {
        console.log('error', e);
        this.setState({ loading: false, companies: [] });
      });
  }

  handleChangeCompany = value => {
    this.setState({ companyModalVisible: false });
  };

  showCompany = () => {
    this.setState({ companyModalVisible: true });
  };

  _showStartDateTimePicker = () =>
    this.setState({ isStartDateTimePickerVisible: true });
  _showEndDateTimePicker = () =>
    this.setState({ isEndDateTimePickerVisible: true });

  _hideDateTimePicker = () =>
    this.setState({
      isStartDateTimePickerVisible: false,
      isEndDateTimePickerVisible: false
    });

  _handleStartDatePicked = date => {
    this.setState({ startDate: date });
    this._hideDateTimePicker();
  };

  _handleEndDatePicked = date => {
    this.setState({ endDate: date });
    this._hideDateTimePicker();
  };

  showDate = () => {};

  trashNewPressed = () => {
    Haptic.notification(Haptic.NotificationFeedbackType.Success);
    this.props.navigation.goBack();
  };

  valid = () => {
    return this.state.company && this.state.startDate && this.state.endDate;
  };

  submit = () => {
    if (this.valid()) {
    }
  };

  render() {
    return (
      <View style={[styles.newTimeSheetWrap]}>
        <View style={styles.newTimeSheetWrapHeader}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
              <Text
                style={{
                  color: colors.white,
                  fontSize: 20
                }}
              >
                Add Timesheet Entry
              </Text>
              <Text
                style={{
                  color: colors.white,
                  fontSize: 14,
                  fontWeight: '300'
                }}
              >
                create new timesheet below
              </Text>
            </View>
            <View>
              <TouchableOpacity onPress={this.trashNewPressed}>
                <Feather name="trash" color={colors.white} size={20} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{
              padding: 15
            }}
          >
            <View style={styles.row}>
              <View>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '300'
                  }}
                >
                  Company
                </Text>
              </View>
              <TouchableOpacity onPress={this.showCompany}>
                <View style={styles.inputBox}>
                  <Text style={styles.inputPlaceholder}>
                    {this.state.company
                      ? this.state.companies.filter(
                          c => c.id == this.state.company
                        )[0].name
                      : 'Choose Company...'}
                  </Text>
                  <Feather name="chevron-down" size={20} color={'#333'} />
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.row}>
              <View>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '300'
                  }}
                >
                  Start Date
                </Text>
              </View>
              <TouchableOpacity onPress={this._showStartDateTimePicker}>
                <View style={styles.inputBox}>
                  <Text style={styles.inputPlaceholder}>
                    {this.state.startDate === ''
                      ? `Choose Start Date...`
                      : moment(this.state.startDate).calendar()}
                  </Text>
                  <Feather name="chevron-down" size={20} color={'#333'} />
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.row}>
              <View>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '300'
                  }}
                >
                  End Date
                </Text>
              </View>
              <TouchableOpacity onPress={this._showEndDateTimePicker}>
                <View style={styles.inputBox}>
                  <Text style={styles.inputPlaceholder}>
                    {this.state.endDate === ''
                      ? `Choose End Date...`
                      : moment(this.state.endDate).calendar()}
                  </Text>
                  <Feather name="chevron-down" size={20} color={'#333'} />
                </View>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={this.submit}>
              <View
                style={{
                  backgroundColor: this.valid()
                    ? colors.BRIGHT_GREEN
                    : colors.GREY,
                  height: 50,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Text style={{ color: colors.white, fontSize: 16 }}>
                  Save Timesheet
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <DateTimePicker
          titleIOS={'Start Date'}
          date={
            this.state.startDate === ''
              ? moment()
                  .subtract(4, 'hours')
                  .toDate()
              : this.state.startDate
          }
          isVisible={this.state.isStartDateTimePickerVisible}
          onConfirm={this._handleStartDatePicked}
          onCancel={this._hideDateTimePicker}
          mode={'datetime'}
          minuteInterval={5}
        />
        <DateTimePicker
          titleIOS={'End Date'}
          date={this.state.endDate === '' ? new Date() : this.state.endDate}
          isVisible={this.state.isEndDateTimePickerVisible}
          onConfirm={this._handleEndDatePicked}
          onCancel={this._hideDateTimePicker}
          mode={'datetime'}
          minuteInterval={5}
        />
        <CompanySelectModal
          selected={this.state.company}
          onChange={value => {
            this.setState({ company: value });
          }}
          companies={this.state.companies}
          visible={this.state.companyModalVisible}
          onSuccess={this.handleChangeCompany}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    marginBottom: 30
  },
  inputBox: {
    flexDirection: 'row',
    marginTop: 5,
    paddingHorizontal: 10,
    height: 40,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: '#CCC',
    borderWidth: 0.5,
    borderRadius: 6,
    backgroundColor: '#F8F8F8'
  },
  inputPlaceholder: { fontWeight: '400', color: '#444' },
  newTimeSheetWrap: {
    flex: 1,
    backgroundColor: colors.white
  },
  newTimeSheetWrapHeader: {
    height: 120,
    paddingHorizontal: 10,
    paddingTop: Constants.statusBarHeight,
    justifyContent: 'center',
    backgroundColor: colors.BRIGHT_GREEN
  }
});
