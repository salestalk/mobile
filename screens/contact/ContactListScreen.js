import React, { Component } from 'react';
import { Feather } from '@expo/vector-icons';
import moment from 'moment';
import { colors } from '../../styles';
import { connect } from 'react-redux';

import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  ListView,
  TouchableOpacity
} from 'react-native';
import { List, ListItem, SearchBar } from 'react-native-elements';
import { BASE_URL } from '../../constants';

const URI = `${BASE_URL}open/list`;

class ContactListScreen extends Component {
  static navigationOptions = {
    title: 'Contacts',
    headerTintColor: colors.white,
    headerStyle: {
      backgroundColor: colors.green,
      borderBottomWidth: 0
    },
    headerBackTitle: ''
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      searchText: '',
      contactList: []
    };
  }

  fetchTA() {
    return fetch(URI, {
      method: 'GET',
      headers: {
        'x-auth': `${this.props.user.tenantId}|${this.props.user.domainId}`
      }
    })
      .then(response => response.json())
      .then(responseJson => {
        let ds = new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 !== r2
        });
        this.setState(
          {
            isLoading: false,
            dataSource: ds.cloneWithRows(responseJson.data),
            contactList: responseJson.data
          },
          function() {}
        );
      })
      .catch(error => {
        console.log(error);
      });
  }

  componentDidMount() {
    this.fetchTA();
  }

  _selectList(contactList, Id) {
    this.props.navigation.navigate('contactListDetailScreen', {
      ...contactList
    });
  }

  setSearchText(event) {
    let searchText = event;
    let text = searchText.toLowerCase();
    const filteredContactList = this.state.contactList.filter(function(list) {
      return list.Name.toLowerCase().includes(text);
    });
    this.setState({
      searchText,
      dataSource: this.state.dataSource.cloneWithRows(filteredContactList)
    });
  }

  _renderRow(rowData, rowID) {
    return (
      <TouchableOpacity
        onPress={() => {
          this._selectList(rowData, rowID);
        }}
      >
        <View style={styles.row}>
          <View style={styles.infoSection}>
            <Text style={styles.text} numberOfLines={1}>
              {rowData.Name}
            </Text>
            {rowData.Description && (
              <Text style={styles.date} numberOfLines={1}>
                {rowData.Description}
              </Text>
            )}
            {rowData.LastModifiedDate && (
              <Text style={styles.date} numberOfLines={1}>
                {rowData.LastModifiedDate
                  ? moment(rowData.LastModifiedDate).format('LLL')
                  : moment(rowData.CreatedDate).format('LLL')}
              </Text>
            )}
          </View>
          <View style={styles.iconView}>
            <Feather name="chevron-right" size={20} color="#5a9f4d" />
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: 20
          }}
        >
          <ActivityIndicator size="large" color={colors.borderGreen} />
        </View>
      );
    }

    return (
      <View style={{ flex: 1 }}>
        <SearchBar
          lightTheme={false}
          containerStyle={{
            borderTopColor: colors.green,
            borderBottomColor: colors.green,
            backgroundColor: colors.green
          }}
          style={{ fontSize: 13 }}
          inputStyle={{
            backgroundColor: 'rgba(0,0,0,0.2)',
            fontSize: 14,
            color: 'white'
          }}
          placeholderTextColor="#E0E0E0"
          textInputRef={this.state.searchText}
          onChangeText={this.setSearchText.bind(this)}
          placeholder="Type Here..."
          clearIcon={{ color: '#E0E0E0', name: 'highlight-off' }}
          icon={{ color: '#E0E0E0', name: 'search' }}
        />
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
  text: {
    color: '#333',
    fontWeight: '500',
    fontSize: 18,
    height: 22
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
    backgroundColor: 'white',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#DDDDDD',
    height: 80,
    justifyContent: 'space-between',
    alignItems: 'center'
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
    fontWeight: '500'
  }
});

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.auth.user
  };
};

module.exports = connect(mapStateToProps)(ContactListScreen);
