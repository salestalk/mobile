import React, { Component } from 'react';
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-elements';
import moment from 'moment';
import { connect } from 'react-redux';
import { colors } from '../../styles';
import { BASE_URL } from '../../constants';

class ActivityDetailScreen extends Component {
  static navigationOptions = {
    title: 'Activity Detail',
    headerTintColor: colors.white,
    headerStyle: {
      backgroundColor: colors.green
    },
    headerBackTitle: ''
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      activityId: this.props.navigation.state.params,
      note: '',
      activity: {
        ActivityId: this.props.navigation.state.params,
        Title: 'Some Appointment',
        StartDate: moment(new Date()).format('LLLL'),
        EndDate: moment(new Date()).format('LLLL')
      }
    };
  }

  componentWillMount() {
    this._fetchActivityDetail();
  }

  _fetchActivityDetail = () => {
    console.log('making call');
    return fetch(
      `${BASE_URL}open/getactivity/${this.state.activity.ActivityId}`,
      {
        method: 'GET',
        headers: {
          'x-auth': `${this.props.user.tenantId}|${this.props.user.domainId}`
        }
      }
    )
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    console.log(this.state.activity);
    if (this.state.isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.green} />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <Text style={styles.formLabel}>TITLE</Text>
        <Text style={styles.description}>{this.state.activity.Title}</Text>
        <Text style={styles.formLabel}>START DATE</Text>
        <Text style={styles.description}>{this.state.activity.StartDate}</Text>
        <Text style={styles.formLabel}>END DATE</Text>
        <Text style={styles.description}>{this.state.activity.EndDate}</Text>
        <Button
          backgroundColor={colors.green}
          stye={styles.saveButton}
          icon={{
            name: 'save',
            type: 'material',
            buttonStyle: styles.someButtonStyle
          }}
          title="Mark Completed"
        />
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.auth.user
  };
};

module.exports = connect(mapStateToProps)(ActivityDetailScreen);

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
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 0,
    color: colors.green
  },
  description: {
    fontSize: 16,
    fontWeight: '300',
    marginBottom: 30
  }
});
