import React, { Component } from 'react';
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  AsyncStorage,
  Platform,
  TextInput,
  ActivityIndicator,
  Alert
} from 'react-native';
import { connect } from 'react-redux';
import { FormLabel, FormInput, Button } from 'react-native-elements';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../styles';
import { BASE_URL } from '../../constants';

const DATE_TIME_FORMAT = 'MM/DD/YYYY h:mm a';

class PhoneCallScreen extends Component {
  static navigationOptions = {
    title: 'Phone Call',
    headerTintColor: colors.white,
    headerStyle: {
      backgroundColor: colors.green
    },
    headerBackTitle: ''
  };

  constructor(props) {
    super(props);
    var startDate = new Date();
    startDate.setMinutes(startDate.getMinutes() + 30);
    startDate.setMinutes(0);
    endDate = new Date(startDate);
    endDate.setMinutes(30);
    this.state = {
      isLoading: false,
      leadId: this.props.navigation.state.params.leadId,
      note: '',
      isStartVisible: false,
      isEndVisible: false,
      startDate: moment(startDate).format(DATE_TIME_FORMAT),
      endDate: moment(endDate).format(DATE_TIME_FORMAT),
      eventPayload: {
        activityId: 0,
        type: 'Phone Call',
        title: '',
        description: 'Note from Mobile',
        assignedTo: this.props.user.userId,
        leadId: this.props.navigation.state.params.leadId,
        startDate: {
          year: null,
          month: null,
          day: null,
          hour: null,
          minute: null
        },
        endDate: {
          year: null,
          month: null,
          day: null,
          hour: null,
          minute: null
        },
        completedOn: {
          year: null,
          month: null,
          day: null,
          hour: null,
          minute: null
        }
      }
    };
  }

  _hideStartDateTimePicker = () => this.setState({ isStartVisible: false });

  _hideEndDateTimePicker = () => this.setState({ isEndVisible: false });

  _handleStartDatePicked = date => {
    this.setState({
      startDate: moment(date).format(DATE_TIME_FORMAT),
      endDate: moment(date)
        .add(30, 'minutes')
        .format(DATE_TIME_FORMAT)
    });
    this._hideStartDateTimePicker();
  };

  _handleEndDatePicked = date => {
    this.setState({ endDate: moment(date).format(DATE_TIME_FORMAT) });
    this._hideEndDateTimePicker();
  };

  componentDidMount() {}

  _onSavePressed = () => {
    this.setState({ isLoading: true });
    var payload = this.state.eventPayload;
    var start = new Date(this.state.startDate);
    var end = new Date(this.state.endDate);
    payload.startDate = {
      year: start.getFullYear(),
      month: start.getMonth(),
      day: start.getDate(),
      hour: start.getHours(),
      minute: start.getMinutes()
    };
    payload.endDate = {
      year: end.getFullYear(),
      month: end.getMonth(),
      day: end.getDate(),
      hour: end.getHours(),
      minute: end.getMinutes()
    };
    payload.title = this.state.title;

    fetch(`${BASE_URL}open/ManageActivity`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-auth': `${this.props.user.tenantId}|${this.props.user.domainId}`
      },
      body: JSON.stringify(payload)
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        if (responseJson.error.length > 0) {
          Alert.alert(
            'Error Saving Phone Call Please Try Again',
            responseJson.error,
            [{ text: 'OK', onPress: () => {} }],
            { cancelable: false }
          );
        } else {
          console.log(responseJson);
          this.props.navigation.goBack(null);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  _nameChanged = () => {};

  _onStartDatePressed = () => this.setState({ isStartVisible: true });
  _onEndDatePressed = () => this.setState({ isEndVisible: true });

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.green} />
        </View>
      );
    }
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.formLabel}>Phone Call Description</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={title => this.setState({ title })}
          value={this.state.title}
        />
        <View style={styles.buttonInputGroup}>
          <TextInput
            editable={false}
            style={styles.textInput}
            placeholder="Start Date"
            onChangeText={startDate => this.setState({ startDate })}
            value={this.state.startDate}
          />
          <TouchableOpacity
            onPress={this._onStartDatePressed}
            style={styles.inputGroupButton}
          >
            <Ionicons
              name={'ios-calendar-outline'}
              size={26}
              style={{ color: colors.green }}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.buttonInputGroup}>
          <TextInput
            editable={false}
            style={styles.textInput}
            placeholder="End Date"
            onChangeText={endDate => this.setState({ endDate })}
            value={this.state.endDate}
          />
          <TouchableOpacity
            onPress={this._onEndDatePressed}
            style={styles.inputGroupButton}
          >
            <Ionicons
              name={'ios-calendar-outline'}
              size={26}
              style={{ color: colors.green }}
            />
          </TouchableOpacity>
        </View>
        <Button
          backgroundColor={colors.green}
          stye={styles.saveButton}
          icon={{
            name: 'save',
            type: 'material',
            buttonStyle: styles.someButtonStyle
          }}
          title="Create Phone Call"
          onPress={this._onSavePressed.bind(this)}
        />
        <DateTimePicker
          mode="datetime"
          date={new Date(this.state.startDate)}
          isVisible={this.state.isStartVisible}
          onConfirm={this._handleStartDatePicked}
          onCancel={this._hideStartDateTimePicker}
        />
        <DateTimePicker
          mode="datetime"
          date={new Date(this.state.endDate)}
          minimumDate={new Date(this.state.startDate)}
          isVisible={this.state.isEndVisible}
          onConfirm={this._handleEndDatePicked}
          onCancel={this._hideEndDateTimePicker}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
    padding: 10
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
    color: 'rgba(0,0,0,0.8)'
  },
  textInput: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.green,
    fontSize: 16,
    height: 40,
    padding: 5,
    marginBottom: 20,
    color: 'rgba(0,0,0,0.8)',
    flex: 1
  },
  buttonInputGroup: {
    flexDirection: 'row'
  },
  saveButton: {
    alignSelf: 'flex-end',
    backgroundColor: colors.green
  },
  inputGroupButton: {
    marginLeft: 10,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  date: {
    color: '#777',
    fontSize: 12
  }
});

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.auth.user
  };
};

module.exports = connect(mapStateToProps)(PhoneCallScreen);
