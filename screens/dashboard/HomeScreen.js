import _ from 'lodash';
import React, { Component } from 'react';
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  FlatList,
  Platform,
  Image
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { List, ListItem, Icon, ButtonGroup } from 'react-native-elements';
import { colors } from '../../styles';
import { BASE_URL } from '../../constants';

class HomeScreen extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired
  };

  static navigationOptions = ({ navigation }) => ({
    header: null
  });

  constructor(props) {
    super(props);
    this.state = {
      contacts: [],
      activities: [],
      selectedIndex: 0
    };
  }

  componentDidMount() {
    this._loadLeads();
    this._loadUserActivities();
  }

  _updateIndex(selectedIndex) {
    this.setState({ selectedIndex });
  }

  _loadLeads = () => {
    return fetch(
      `${BASE_URL}open/recentviewedleads/${this.props.auth.user.userId}`,
      {
        method: 'GET',
        headers: {
          'x-auth': `${this.props.auth.user.tenantId}|${
            this.props.auth.user.domainId
          }`
        }
      }
    )
      .then(response => response.json())
      .then(responseJson => {
        this.setState(
          {
            isLoading: false,
            contacts: responseJson.data,
            refreshing: false
          },
          function() {
            // do something with new state
          }
        );
      })
      .catch(error => {});
  };

  _loadUserActivities = () => {
    console.log('updating');
    return fetch(
      `${BASE_URL}open/GetUserActivities/${this.props.auth.user.userId}`,
      {
        method: 'GET',
        headers: {
          'x-auth': `${this.props.auth.user.tenantId}|${
            this.props.auth.user.domainId
          }`
        }
      }
    )
      .then(response => response.json())
      .then(responseJson => {
        this.setState(
          {
            isLoading: false,
            activities: responseJson.data,
            refreshing: false
          },
          function() {
            // do something with new state
          }
        );
      })
      .catch(error => {});
  };

  _selectContact(selectedContact) {
    var contact = {
      leadId: selectedContact.LeadId,
      updateActivities: this._loadUserActivities
    };
    this.props.navigation.navigate('storySoFarScreen', { ...contact });
  }

  onLearnMore = user => {
    this.props.navigation.navigate('Details', { ...user });
  };

  _renderBottom = () => {
    if (this.state.selectedIndex === 0) {
      if (this.state.contacts.length > 0) {
        return (
          <FlatList
            data={this.state.contacts}
            keyExtractor={item => item.LeadId.toString()}
            renderItem={this._renderContactRow.bind(this)}
          />
        );
      } else {
        return (
          <View style={styles.emptyContent}>
            <Text style={styles.emptyText}>No Recent Contacts</Text>
          </View>
        );
      }
    } else {
      if (this.state.activities.length > 0) {
        return (
          <FlatList
            data={this.state.activities}
            keyExtractor={item => item.ActivityId.toString()}
            renderItem={this._renderActivityRow.bind(this)}
          />
        );
      } else {
        return (
          <View style={styles.emptyContent}>
            <Text style={styles.emptyText}>No Current Activities</Text>
          </View>
        );
      }
    }
  };

  _renderContactRow(rowData, rowId) {
    return (
      <ListItem
        key={`${rowId}`}
        wrapperStyle={{ borderBottomColor: colors.green }}
        title={<Text>{rowData.item.Name || ''}</Text>}
        subtitle={
          <Text style={styles.subTitle}>{rowData.item.CompanyName || ''}</Text>
        }
        onPress={() => {
          this._selectContact(rowData.item, rowId);
        }}
      />
    );
  }

  _renderActivityRow(rowData, rowId) {
    console.log(rowData.item);
    return (
      <ListItem
        key={`${rowId}`}
        title={<Text>{rowData.item.Action || ''}</Text>}
        subtitle={
          <Text style={styles.subTitle}>
            Due: {moment(rowData.item.DueDate).format('LLL')}
          </Text>
        }
      />
    );
  }

  render() {
    const buttons = ['Contacts', 'Activities'];
    const { selectedIndex } = this.state;

    return (
      <View style={styles.view}>
        <View style={styles.upperView}>
          <View style={styles.greenBanner}>
            <Image
              source={require('../../assets/images/salestalk-logo-green.png')}
              style={styles.image}
            />
          </View>
          <View style={styles.recentWrap}>
            <View style={styles.recentItem}>
              <View style={styles.giantCircle}>
                <Text style={styles.recentItemNumber}>
                  {this.state.contacts.length}
                </Text>
              </View>
              <Text style={styles.recentItemLabel}>Recent Contacts</Text>
            </View>
            <View style={styles.recentItem}>
              <View style={styles.giantCircle}>
                <Text style={styles.recentItemNumber}>
                  {this.state.activities.length}
                </Text>
              </View>
              <Text style={styles.recentItemLabel}>Upcoming Activities</Text>
            </View>
          </View>
        </View>
        <View style={styles.lowerView}>
          <ButtonGroup
            onPress={this._updateIndex.bind(this)}
            selectedIndex={selectedIndex}
            buttons={buttons}
            containerStyle={{ height: 30, borderColor: colors.green }}
            textStyle={{ color: colors.green }}
            selectedButtonStyle={{ backgroundColor: colors.green }}
            selectedTextStyle={{
              color: colors.white,
              backgroundColor: colors.green
            }}
          />
          {this._renderBottom()}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    backgroundColor: colors.white,
    flex: 1
  },
  upperView: {
    height: 200,
    backgroundColor: colors.white
  },
  greenBanner: {
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
    backgroundColor: colors.green,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    resizeMode: 'contain',
    height: 40,
    margin: 10
  },
  lowerView: {
    flex: 1
  },
  listItem: {
    backgroundColor: '#CCCCCC'
  },
  list: {
    marginBottom: 20
  },
  recentWrap: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10
  },
  recentItem: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  giantCircle: {
    backgroundColor: colors.green,
    height: 60,
    width: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10
  },
  recentItemNumber: {
    fontSize: 30,
    fontWeight: '700',
    color: colors.white,
    backgroundColor: 'transparent'
  },
  recentItemLabel: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.green
  },
  subTitle: {
    color: colors.gray,
    fontSize: 12,
    lineHeight: 20
  },
  emptyContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyText: {
    color: colors.green,
    fontSize: 18
  }
});

const mapStateToProps = state => {
  return {
    auth: _.get(state, 'auth', null)
  };
};

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeScreen);
