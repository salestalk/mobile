import _ from 'lodash';
import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ListView,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import { Feather } from '@expo/vector-icons';
import moment from 'moment';
import { colors } from '../../styles';
import { BASE_URL } from '../../constants';
import { formatPhoneNumber } from '../../lib';
const URI = `${BASE_URL}open/ListLeads/`;

class ContactListDetailScreen extends Component {
  static navigationOptions = {
    title: 'Contact List',
    headerTintColor: colors.white,
    headerStyle: {
      backgroundColor: colors.green
    },
    backButtonTitle: 'Back'
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      searchText: '',
      contactListUsers: [],
      contactList: this.props.navigation.state.params
    };
  }

  getTargetAudienceContacts() {
    return fetch(
      `${URI}?targetAudienceId=${this.state.contactList.TargetAudienceId}`,
      {
        method: 'GET',
        headers: {
          'x-auth': `${this.props.user.tenantId}|${this.props.user.domainId}`
        }
      }
    )
      .then(response => response.json())
      .then(responseJson => {
        let ds = new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 !== r2
        });
        this.setState(
          {
            isLoading: false,
            dataSource: ds.cloneWithRows(responseJson.data),
            contactListUsers: responseJson.data
          },
          function() {
            // do something with new state
          }
        );
      })
      .catch(error => {});
  }

  componentDidMount() {
    this.getTargetAudienceContacts();
  }

  _renderRow(rowData, rowID) {
    return (
      <TouchableOpacity
        onPress={() => {
          this._selectContact(rowData, rowID);
        }}
      >
        <View style={styles.row}>
          <View style={styles.infoSection}>
            <Text style={styles.text} numberOfLines={1}>
              {_.capitalize(rowData.LastName)},{' '}
              {_.capitalize(rowData.FirstName)}
            </Text>
            <Text style={styles.title} numberOfLines={1}>
              {rowData.Title}
            </Text>
            <Text style={styles.date} numberOfLines={1}>
              {formatPhoneNumber(rowData.WorkPhone)}
            </Text>
            <Text style={styles.date} numberOfLines={1}>
              {moment(rowData.LastModifiedDate).format('LLL')}
            </Text>
          </View>
          <View style={styles.iconView}>
            <Feather name="chevron-right" size={20} color="#5a9f4d" />
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  _selectContact(selectedContact) {
    var contact = { leadId: selectedContact.LeadId };
    this.props.navigation.navigate('storySoFarScreen', { ...contact });
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1, paddingTop: 20 }}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <View>
        <ListView
          enableEmptySections={true}
          removeClippedSubviews={false}
          dataSource={this.state.dataSource}
          renderRow={this._renderRow.bind(this)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  date: {
    color: '#777',
    fontSize: 12
  },
  title: {
    color: '#777',
    fontSize: 12,
    marginBottom: 5
  },
  text: {
    color: '#333',
    fontWeight: '500',
    fontSize: 16
  },
  infoSection: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start'
  },
  iconView: {
    width: 50,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    padding: 4,
    paddingVertical: 10,
    backgroundColor: 'white',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#DDDDDD',
    justifyContent: 'space-between'
  },
  searchBar: {
    paddingLeft: 30,
    fontSize: 22,
    height: 10,
    flex: 0.1,
    borderWidth: 9,
    borderColor: '#E4E4E4'
  },
  titleText: {
    color: '#333',
    fontWeight: 'bold'
  }
});

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.auth.user
  };
};

module.exports = connect(mapStateToProps)(ContactListDetailScreen);
