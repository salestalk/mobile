import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  TextInput,
  Keyboard,
  KeyboardAvoidingView
} from 'react-native';
import moment from 'moment';
import { Constants, Haptic } from 'expo';
import { Feather } from '@expo/vector-icons';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { colors } from '../../../styles';
import { getCompanyList, addTimeSheet, convertToMoment } from '../util';
import { CompanySelectModal } from '../components';
import { LoadingModal } from '../../../components';
export default class AddTimeSheetScreen extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    let company = null;
    let startDate = '';
    let endDate = '';
    let hours = 0;
    let notes = '';
    let id = 0;

    if (
      props.navigation.state.params &&
      props.navigation.state.params.existing
    ) {
      const { existing } = props.navigation.state.params;
      company = existing.CompanyId;
      startDate = convertToMoment(existing.TaskStart).toDate();
      endDate = convertToMoment(existing.TaskEnd).toDate();
      notes = existing.OtherText;
      id = existing.AgentHoursId;
      hours = existing.NormalHours;
    }

    this.state = {
      id,
      laoding: false,
      isStartDateTimePickerVisible: false,
      isEndDateTimePickerVisible: false,
      companies: [],
      companyModalVisible: false,
      company,
      hours,
      startDate,
      endDate,
      notes,
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
      this.setState({ loading: true });
      addTimeSheet(
        this.props.screenProps.user,
        this.state.id,
        moment.utc(this.state.startDate).format('YYYY-MM-DD hh:mmA'),
        moment.utc(this.state.endDate).format('YYYY-MM-DD hh:mmA'),
        Math.abs(this.state.endDate - this.state.startDate) / 1000 / 60 / 60,
        this.state.company,
        this.state.notes
      )
        .then(result => {
          this.setState({ loading: false });
          if (
            this.props.navigation.state.params &&
            this.props.navigation.state.params.refresh
          ) {
            this.props.navigation.state.params.refresh();
          }
          this.props.navigation.goBack();
        })
        .catch(e => {
          this.setState({ loading: false });
          console.log(e);
        });
    }
  };

  renderCompanyLabel = () => {
    if (this.state.company) {
      const filteredCompanies = this.state.companies.filter(
        c => c.id == this.state.company
      );
      if (filteredCompanies.length > 0) {
        return filteredCompanies[0].name;
      } else {
        return 'Choose Company...';
      }
    } else {
      return 'Choose Company...';
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
                {`${this.state.company ? 'Edit' : 'Add'} Timesheet Entry`}
              </Text>
              <Text
                style={{
                  color: colors.white,
                  fontSize: 14,
                  fontWeight: '300'
                }}
              >
                {`${
                  this.state.company ? 'edit' : 'create new'
                } timesheet below`}
              </Text>
            </View>
            <View>
              <TouchableOpacity onPress={this.trashNewPressed}>
                <Feather name="trash" color={colors.white} size={20} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <KeyboardAvoidingView
          behavior="padding"
          style={{ flex: 1 }}
          keyboardVerticalOffset={0}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            onScroll={() => Keyboard.dismiss()}
          >
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
                      {this.renderCompanyLabel()}
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
                    Start Date and Time
                  </Text>
                </View>
                <TouchableOpacity onPress={this._showStartDateTimePicker}>
                  <View style={styles.inputBox}>
                    <Text style={styles.inputPlaceholder}>
                      {this.state.startDate === ''
                        ? `Choose Start Date and Time...`
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
                    End Date and Time
                  </Text>
                </View>
                <TouchableOpacity onPress={this._showEndDateTimePicker}>
                  <View style={styles.inputBox}>
                    <Text style={styles.inputPlaceholder}>
                      {this.state.endDate === ''
                        ? `Choose End Date and Time...`
                        : moment(this.state.endDate).calendar()}
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
                    Notes
                  </Text>
                </View>
                <View style={styles.textInputBox}>
                  <TextInput
                    numberOfLines={3}
                    autoCapitalize={'sentences'}
                    autoCorrect={true}
                    value={this.state.notes}
                    onChangeText={text => this.setState({ notes: text })}
                    multiline={true}
                    underlineColorAndroid="transparent"
                  />
                </View>
              </View>
              <View style={styles.row}>
                <View>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '300'
                    }}
                  >
                    Notes
                  </Text>
                </View>
                <View style={styles.textInputBox}>
                  <TextInput
                    numberOfLines={3}
                    autoCapitalize={'sentences'}
                    autoCorrect={true}
                    value={this.state.notes}
                    onChangeText={text => this.setState({ notes: text })}
                    multiline={true}
                    underlineColorAndroid="transparent"
                  />
                </View>
              </View>
              <View style={styles.row}>
                <View>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '300'
                    }}
                  >
                    Hours
                  </Text>
                </View>
                <View style={styles.textInputBox}>
                  <TextInput
                    numberOfLines={1}
                    autoCapitalize={'none'}
                    autoCorrect={true}
                    value={this.state.hours}
                    keyboardType={'decimal-pad'}
                    onChangeText={text => this.setState({ hours: text })}
                    multiline={true}
                    underlineColorAndroid="transparent"
                  />
                </View>
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
        </KeyboardAvoidingView>
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
        <LoadingModal visible={this.state.loading} />
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
  textInputBox: {
    marginTop: 5,
    paddingHorizontal: 10,
    height: 60,
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
