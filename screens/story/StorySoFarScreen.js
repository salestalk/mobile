import React, { Component } from 'react';
import {
  Text,
  View,
  Modal,
  WebView,
  TouchableHighlight,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Linking,
  ActivityIndicator
} from 'react-native';
import { List, ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import moment from 'moment';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../styles';
import { BASE_URL } from '../../constants';

class StorySoFarScreen extends Component {
  static navigationOptions = {
    title: 'Story So Far',
    headerTintColor: colors.white,
    headerStyle: {
      backgroundColor: colors.green
    },
    headerBackTitle: ''
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      searchText: '',
      lead: [],
      leadId: this.props.navigation.state.params.leadId,
      ssf: [],
      refreshing: false,
      isSSF: true,
      navigatorId: 0,
      navigator: {},
      navigators: [],
      tpVisible: false,
      tpContent: ''
    };

    this.loadNavigators = this.loadNavigators.bind(this);
  }

  componentDidMount() {
    this._loadUser();
    //this._getNavigator();
    this.loadNavigators();
  }

  loadNavigators = async () => {
    const navigatorsList = [];
    try {
      const response = await fetch(
        `${BASE_URL}open/getNavigator?id=0&leadId=0`,
        {
          method: 'GET',
          headers: {
            'x-auth': `${this.props.user.tenantId}|${this.props.user.domainId}`
          }
        }
      );
      const navigator = await response.json();
      this.setState({ navigator });
    } catch (error) {
      console.log(error);
    }
  };

  _onAddNotePressed = () => {
    var contact = { leadId: this.state.leadId };
    this.props.navigation.navigate('noteScreen', { ...contact });
  };

  _onAppointmentPressed = () => {
    var contact = {
      leadId: this.state.leadId,
      updateActivities: this.props.navigation.state.params.updateActivities
    };
    this.props.navigation.navigate('meetingScreen', { ...contact });
  };

  _onPhoneCallPressed = () => {
    var contact = { leadId: this.state.leadId };
    this.props.navigation.navigate('phoneCallScreen', { ...contact });
  };

  _onToDoPressed = () => {
    var contact = { leadId: this.state.leadId };
    this.props.navigation.navigate('toDoScreen', { ...contact });
  };

  _renderBehaviorAvatar(item) {
    return (
      <Ionicons name="ios-arrow-dropright-outline" size={20} color="#5a9f4d" />
    );
  }

  _loadUser = () => {
    return fetch(`${BASE_URL}open/lead/${this.state.leadId}`, {
      method: 'GET',
      headers: {
        'x-auth': `${this.props.user.tenantId}|${this.props.user.domainId}`
      }
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState(
          {
            lead: responseJson.data.lead,
            ssf: responseJson.data.ssf,
            refreshing: false,
            isLoading: false
          },
          function() {}
        );
      })
      .catch(error => {});
  };

  _getNavigator = () => {
    return fetch(
      `${BASE_URL}open/GetNavigator?id=${this.state.navigatorId}&leadId=${
        this.state.leadId
      }`,
      {
        method: 'GET',
        headers: {
          'x-auth': `${this.props.user.tenantId}|${this.props.user.domainId}`
        }
      }
    )
      .then(response => response.json())
      .then(responseJson => {
        this.setState(
          {
            isLoading: false,
            refreshing: false,
            navigator: responseJson
          },
          function() {
            // do something with new state
          }
        );
      })
      .catch(error => {});
  };

  _getBehaviorTitle = behavior => {
    var title = behavior.Name || '';
    if (behavior.Type === 'Activity') {
      var parts = behavior.Value.split('|');
      if (parts.length > 1) {
        title = parts[1] | ' ';
      }
      if (behavior.Name.startsWith('Created')) {
        title = behavior.Name.replace('Created ', '') + ' - ' + title;
      }

      return title || ' ';
    }

    if (behavior.Name === 'notes') {
      return 'Note Created';
    }

    return title || ' ';
  };

  _onPressBehavior(item) {
    if (item.Name.toLowerCase() === 'notes') {
      this.props.navigation.navigate('behaviorDetailScreen', { ...item });
      return;
    }
    if (item.Type.toLowerCase() === 'activity') {
      var activityId = { activityId: item.RawValue };
      this.props.navigation.navigate('activityDetailScreen', { ...activityId });
      return;
    }
  }

  _renderBehaviorRow(rowData, rowId) {
    var iconName = 'archive';
    switch (rowData.item.Type.toLowerCase()) {
      case 'deliver':
      case 'email':
      case 'softbounce':
        iconName = 'mail';
        break;
      case 'click':
        iconName = 'link';
        break;
      case 'conversation':
        iconName = 'question-answer';
        break;
      case 'activity':
        iconName = 'date-range';
        break;
      default:
        break;
    }
    return (
      <ListItem
        key={`${rowId}`}
        title={this._getBehaviorTitle(rowData.item)}
        subtitle={moment(rowData.item.CreatedDate).format('LLLL')}
        subtitleStyle={{ fontWeight: '300' }}
        leftIcon={{ color: colors.green, name: iconName, type: 'ionicons' }}
        onPress={() => this._onPressBehavior(rowData.item)}
      />
    );
  }

  _renderNavigatorRow(item, rowId) {
    let icon = 'check-circle';
    if (item.type && item.type.toLowerCase() === 'folder') icon = 'folder';
    return (
      <ListItem
        key={`${rowId}`}
        title={item.title}
        titleStyle={{
          color: (item.textColor || colors.green).toLowerCase()
        }}
        subtitleStyle={{ fontWeight: 300 }}
        leftIcon={{
          color: (item.iconColor || colors.green).toLowerCase(),
          name: icon,
          type: 'ionicons'
        }}
        onPress={() => {
          if (!item.isClickNote && item.type !== 'folder') {
            this.loadTalkingPointContent(item.id);
          }
        }}
      />
    );
  }

  async loadTalkingPointContent(tpId) {
    const response = await fetch(`${BASE_URL}open/gettpcontent?tpid=${tpId}`, {
      method: 'GET',
      headers: {
        'x-auth': `${this.props.user.tenantId}|${this.props.user.domainId}`
      }
    });
    const content = await response.json();
    this.setState({ tpVisible: true, tpContent: content.Primary });
  }

  renderNavItem(rowData, rowId) {
    return (
      <ListItem
        key={`${rowId}`}
        title={rowData.item.name}
        leftIcon={{
          color: colors.green.toLowerCase(),
          name: 'folder',
          type: 'ionicons'
        }}
      />
    );
  }

  _onRefreshBehaviors = () => {
    this.setState(
      {
        refreshing: true
      },
      () => {
        this._loadUser();
      }
    );
  };

  _renderBottomSection = () => {
    if (this.state.isSSF) {
      return (
        <List style={styles.list}>
          <FlatList
            refreshing={this.state.refreshing}
            onRefresh={this._onRefreshBehaviors}
            data={this.state.ssf}
            keyExtractor={item => `${item.BehaviorId}`}
            renderItem={this._renderBehaviorRow.bind(this)}
          />
        </List>
      );
    } else {
      return (
        <View style={styles.navigatorWrap}>
          <View style={styles.navigatorTitle}>
            <Text style={styles.navTitleText}>{this.state.navigator.name}</Text>
          </View>
          <ScrollView>
            <List style={styles.list}>
              {this.state.navigator.navItems.map((item, rowId) => {
                if (
                  item.type === null ||
                  item.type.toLowerCase() !== 'folder'
                ) {
                  return this._renderNavigatorRow(item, rowId);
                }
              })}
            </List>
          </ScrollView>
        </View>
      );
    }
  };

  _onPressSSF = () => {
    this.setState({ isSSF: true });
  };

  _onPressNavigator = () => {
    this.setState({ isSSF: false });
  };

  _selectBehavior(behavior) {}

  render() {
    if (!this.state.tpVisible) {
      return (
        <View style={styles.view}>
          <View style={styles.upperView}>
            <View style={styles.person}>
              <Text style={styles.name} numberOfLines={1}>
                {this.state.lead.FirstName} {this.state.lead.LastName}
              </Text>
              <Text style={styles.company} numberOfLines={1}>
                {this.state.lead.CompanyName}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  Linking.openURL(`mailto:${this.state.lead.Email}`).catch(
                    err => console.error('An error occurred', err)
                  )
                }
              >
                <Text style={styles.email}>{this.state.lead.Email}</Text>
              </TouchableOpacity>
              <Text style={styles.company} numberOfLines={1}>
                {this.state.lead.WorkPhone}
              </Text>
            </View>
            <View style={styles.activityWrap}>
              <View style={styles.addNoteWrap}>
                <TouchableOpacity onPress={this._onAddNotePressed}>
                  <Ionicons
                    name="ios-paper-outline"
                    style={{ alignSelf: 'center' }}
                    size={20}
                    color="#5a9f4d"
                  />
                  <Text style={styles.buttonText} numberOfLines={1}>
                    Note
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.addNoteWrap}>
                <TouchableOpacity onPress={this._onAppointmentPressed}>
                  <Ionicons
                    name="ios-calendar-outline"
                    style={{ alignSelf: 'center' }}
                    size={20}
                    color="#5a9f4d"
                  />
                  <Text style={styles.buttonText} numberOfLines={1}>
                    Meeting
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.addNoteWrap}>
                <TouchableOpacity onPress={this._onPhoneCallPressed}>
                  <Ionicons
                    name="ios-call-outline"
                    style={{ alignSelf: 'center' }}
                    size={20}
                    color="#5a9f4d"
                  />
                  <Text style={styles.buttonText} numberOfLines={1}>
                    Phone Call
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.addNoteWrap} numberOfLines={1}>
                <TouchableOpacity onPress={this._onToDoPressed}>
                  <Ionicons
                    name="ios-person-outline"
                    style={{ alignSelf: 'center' }}
                    size={20}
                    color="#5a9f4d"
                  />
                  <Text style={styles.buttonText}>To Do</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.lowerView}>
            <View style={styles.segmentWrap}>
              <View style={styles.segment}>
                <TouchableOpacity
                  onPress={this._onPressSSF}
                  style={[
                    styles.segButton,
                    this.state.isSSF && styles.activeSegButton
                  ]}
                >
                  <Text
                    style={[
                      styles.segmentButtonText,
                      this.state.isSSF && styles.activeSegment
                    ]}
                  >
                    SSF
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.segment}>
                <TouchableOpacity
                  onPress={this._onPressNavigator}
                  style={[
                    styles.segButton,
                    !this.state.isSSF && styles.activeSegButton
                  ]}
                >
                  <Text
                    style={[
                      styles.segmentButtonText,
                      !this.state.isSSF && styles.activeSegment
                    ]}
                  >
                    Navigator
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.segmentContent}>
              {this._renderBottomSection()}
            </View>
          </View>
        </View>
      );
    }

    return (
      <View style={{ flex: 1, flexDirection: 'column' }}>
        <TouchableHighlight
          onPress={() => {
            this.setState({ tpVisible: false });
          }}
        >
          <View
            style={{
              height: 44,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Text>Close Talking Point</Text>
          </View>
        </TouchableHighlight>
        <View style={{ flex: 1 }}>
          <WebView source={{ html: this.state.tpContent }} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  addNoteWrap: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderGreen,
    borderRadius: 3,
    margin: 4,
    padding: 4
  },
  buttonText: {
    color: colors.darkGray,
    fontSize: 12
  },
  view: {
    backgroundColor: 'white',
    flex: 1
  },
  upperView: {
    height: 200,
    padding: 5,
    alignItems: 'center'
  },
  person: {
    flex: 1,
    alignItems: 'center'
  },
  activityWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  name: {
    fontSize: 20,
    paddingTop: 5,
    paddingBottom: 5,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  company: {
    fontSize: 14,
    padding: 2,
    color: colors.gray
  },
  email: {
    fontSize: 13,
    color: colors.gray,
    padding: 2
  },
  lowerView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start'
  },
  listItem: {
    backgroundColor: '#CCCCCC'
  },
  segmentWrap: {
    flexDirection: 'row',
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.green,
    margin: 5,
    borderRadius: 3
  },
  activeSegButton: {
    backgroundColor: colors.green
  },
  segButton: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white
  },
  activeSegment: {
    color: colors.white
  },
  segment: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  segmentButtonText: {
    color: colors.green,
    fontWeight: 'bold'
  },
  segmentContent: {
    flex: 1,
    backgroundColor: 'white'
  },
  list: {
    backgroundColor: 'white',
    flex: 1
  },
  navigatorWrap: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start'
  },
  navigatorTitle: {
    backgroundColor: colors.green,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center'
  },
  navTitleText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 18
  }
});

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.auth.user
  };
};

module.exports = connect(mapStateToProps)(StorySoFarScreen);
