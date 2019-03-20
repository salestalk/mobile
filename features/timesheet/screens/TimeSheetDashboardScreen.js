import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  StyleSheet
} from 'react-native';
import moment from 'moment';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import Animated, { Easing } from 'react-native-reanimated';
const { Value, timing } = Animated;
import { Haptic, LinearGradient, Constants } from 'expo';
import { AntDesign, Feather } from '@expo/vector-icons';
import { getTimeSheet } from '../util';
import { colors } from '../../../styles';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as AuthenticationActionCreators from '../../../actions/authentication';
import { LoadingModal } from '../../../components';
class TimeSheetDashboardScreen extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      timesheets: [],
      items: null,
      loading: false,
      newFrameTop: new Value(Dimensions.get('window').height)
    };
  }

  componentDidMount() {
    this.refresh();
  }

  refresh = () => {
    this.loadTimeSheet(
      moment()
        .subtract(3, 'months')
        .format('L'),
      moment()
        .add(1, 'days')
        .format('L')
    );
  };

  loadTimeSheet = (startDate, endDate) => {
    this.setState({ loading: true });
    getTimeSheet(this.props.screenProps.user, startDate, endDate)
      .then(res => res.json())
      .then(result => {
        let items = [];
        if (result.data) {
          items = result.data
            .map(itemArray => {
              return itemArray.reduce((obj, item) => {
                obj[item.Key] = item.Value;
                return obj;
              }, {});
            })
            .reduce((acc, cur) => {
              const timeKey = this.convertToMoment(cur.TaskStart).format(
                'YYYY-MM-DD'
              );
              if (timeKey in acc) {
                acc[timeKey].push(cur);
              } else {
                acc[timeKey] = [cur];
              }
              return acc;
            }, {});
        }
        this.setState({ loading: false, items });
      })
      .catch(e => {
        this.setState({ loading: false });
      });
  };

  calculateHours = () => {
    const time = this.state.timesheets.reduce((acc, cur) => {
      return (acc += cur.hours);
    }, 0);
    return Number.parseFloat(time).toPrecision(3);
  };

  addPressed = () => {
    Haptic.selection();
    this.props.navigation.navigate('addTimeSheetScreen', {
      refresh: this.refresh
    });
  };

  convertToMoment = value => moment(new Date(parseInt(value.substr(6))));

  renderDay = (item, firstItemInDay) => {
    return (
      <View key={item.AgentHoursId.toString()}>
        {firstItemInDay ? (
          <View style={{ margin: 15 }}>
            <Text
              style={{ fontSize: 24, color: colors.BRIGHT_GREEN }}
            >{`${this.convertToMoment(item.TaskStart).format(
              'dddd MMMM Do'
            )}`}</Text>
          </View>
        ) : null}
        <TouchableOpacity
          onPress={() => {
            Haptic.selection();
            this.props.navigation.navigate('addTimeSheetScreen', {
              existing: item,
              refresh: this.refresh
            });
          }}
        >
          <View style={styles.calendarItem}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: 20
              }}
            >
              <View>
                <Text style={{ fontWeight: 'bold', fontSize: 12 }}>
                  {item.CompanyName}
                </Text>
              </View>
              <View>
                <Text style={{ fontSize: 12 }}>
                  {`${this.convertToMoment(item.TaskStart).format(
                    'MM/DD/YYYY h:mma'
                  )} - ${this.convertToMoment(item.TaskEnd).format(' h:mma')}`}
                </Text>
              </View>
            </View>
            <View style={{ marginTop: 10 }}>
              <Text style={{ fontWeight: '300', color: '#333' }}>
                {item.OtherText}
              </Text>
            </View>
            <View />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.pageWrap}>
        <LoadingModal visible={this.state.loading} />
        <View style={styles.actionButton}>
          <TouchableOpacity onPress={this.addPressed}>
            <Feather color={colors.white} size={34} name="plus" />
          </TouchableOpacity>
        </View>
        <View
          style={{
            paddingHorizontal: 15,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Text style={{ fontSize: 34, fontWeight: 'bold' }}>Timesheets</Text>

          <View
            style={{
              flexDirection: 'row'
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.props.deauthorize();
              }}
            >
              <Feather name="log-out" size={24} />
            </TouchableOpacity>
          </View>
        </View>
        <Agenda
          items={this.state.items}
          onCalendarToggled={calendarOpened => {}}
          selected={moment().format('YYYY-MM-DD')}
          minDate={moment()
            .subtract(3, 'months')
            .format('YYYY-MM-DD')}
          maxDate={moment()
            .add(1, 'days')
            .format('YYYY-MM-DD')}
          pastScrollRange={3}
          futureScrollRange={0}
          renderItem={this.renderDay}
          renderDay={(day, item) => {
            return <View />;
          }}
          renderEmptyDate={() => {
            return <View />;
          }}
          renderEmptyData={() => {
            return (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Text style={styles.noneLabel}>No Timesheets</Text>
              </View>
            );
          }}
          rowHasChanged={(r1, r2) => {
            return r1.LastModifiedDate !== r2.LastModifiedDate;
          }}
          hideKnob={false}
          theme={{
            agendaDayTextColor: 'yellow',
            agendaDayNumColor: 'green',
            agendaTodayColor: 'red',
            agendaKnobColor: 'rgba(96,173,94,0.6)',
            todayTextColor: colors.BRIGHT_GREEN,
            selectedDayBackgroundColor: colors.BRIGHT_GREEN,
            selectedDayTextColor: colors.white
          }}
          style={{
            zIndex: 100
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  pageWrap: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: Constants.statusBarHeight
  },
  calendarItem: {
    margin: 10,
    padding: 10,
    backgroundColor: colors.white,
    borderRadius: 6,
    borderColor: '#FEFEFE',
    shadowColor: 'black',
    shadowOpacity: 0.3,
    shadowRadius: 1,
    shadowOffset: {
      height: 1,
      width: 0
    },
    elevation: 1
  },
  calendarWrap: {
    flexDirection: 'row'
  },
  actionButton: {
    backgroundColor: colors.LIGHT_GREEN,
    width: 60,
    height: 60,
    borderRadius: 30,
    position: 'absolute',
    bottom: 40,
    right: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    shadowColor: 'black',
    shadowOpacity: 0.3,
    shadowRadius: 2,
    shadowOffset: {
      height: 2,
      width: 0
    }
  },
  noneLabel: {
    fontSize: 18
  },
  newTimeSheetWrap: {
    position: 'absolute',
    height: Dimensions.get('window').height - 0,
    left: 0,
    right: 0,
    zIndex: 1001,
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

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(AuthenticationActionCreators, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimeSheetDashboardScreen);
