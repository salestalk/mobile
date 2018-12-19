import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  StyleSheet
} from 'react-native';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import Animated, { Easing } from 'react-native-reanimated';
const { Value, timing } = Animated;
import { Haptic, LinearGradient, Constants } from 'expo';
import { Feather } from '@expo/vector-icons';
import { getTimeSheet } from '../util';
import { colors } from '../../../styles';

class TimeSheetDashboardScreen extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      timesheets: [],
      loading: false,
      newFrameTop: new Value(Dimensions.get('window').height)
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
    getTimeSheet(this.props.screenProps.user, '01/01/1900', '01/01/2100')
      .then(res => res.json())
      .then(data => {
        console.log(data);
        this.setState({ loading: false });
      })
      .catch(e => {
        console.log('error', e);
        this.setState({ loading: false });
      });
  }

  addPressed = () => {
    Haptic.notification(Haptic.NotificationFeedbackType.Success);
    this.props.navigation.navigate('addTimeSheetScreen');
  };

  render() {
    return (
      <View style={styles.pageWrap}>
        <View style={styles.actionButton}>
          <TouchableOpacity onPress={this.addPressed}>
            <Feather color={colors.white} size={34} name="plus" />
          </TouchableOpacity>
        </View>
        <View style={{ paddingHorizontal: 15 }}>
          <Text style={{ fontSize: 34, fontWeight: 'bold' }}>Timesheets</Text>
        </View>
        <Agenda
          // the list of items that have to be displayed in agenda. If you want to render item as empty date
          // the value of date key kas to be an empty array []. If there exists no value for date key it is
          // considered that the date in question is not yet loaded
          items={{
            '2012-05-22': [{ text: 'item 1 - any js object' }],
            '2012-05-23': [{ text: 'item 2 - any js object' }],
            '2012-05-24': [],
            '2012-05-25': [
              { text: 'item 3 - any js object' },
              { text: 'any js object' }
            ]
          }}
          // callback that gets called when items for a certain month should be loaded (month became visible)
          loadItemsForMonth={month => {
            console.log('trigger items loading');
          }}
          // callback that fires when the calendar is opened or closed
          onCalendarToggled={calendarOpened => {
            console.log(calendarOpened);
          }}
          // callback that gets called on day press
          onDayPress={day => {
            console.log('day pressed');
          }}
          // callback that gets called when day changes while scrolling agenda list
          onDayChange={day => {
            console.log('day changed');
          }}
          // initially selected day
          selected={'2018-12-17'}
          // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
          minDate={'2017-12-17'}
          // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
          maxDate={'2019-12-17'}
          // Max amount of months allowed to scroll to the past. Default = 50
          pastScrollRange={3}
          // Max amount of months allowed to scroll to the future. Default = 50
          futureScrollRange={0}
          // specify how each item should be rendered in agenda
          renderItem={(item, firstItemInDay) => {
            console.log(item, firstItemInDay);
            return <View />;
          }}
          // specify how each date should be rendered. day can be undefined if the item is not first in that day.
          renderDay={(day, item) => {
            return <View />;
          }}
          // specify how empty date content with no items should be rendered
          renderEmptyDate={() => {
            return <View />;
          }}
          // specify how agenda knob should look like
          // renderKnob={() => {
          //   return (
          //     <View
          //       style={{
          //         height: 6,
          //         width: 60,
          //         borderRadius: 3,
          //         backgroundColor: 'rgba(96,173,94,0.6)',
          //         marginTop: 8
          //       }}
          //     />
          //   );
          // }}
          // specify what should be rendered instead of ActivityIndicator
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
          // specify your item comparison function for increased performance
          rowHasChanged={(r1, r2) => {
            return r1.text !== r2.text;
          }}
          // Hide knob button. Default = false
          hideKnob={false}
          // By default, agenda dates are marked if they have at least one item, but you can override this if needed
          markedDates={{
            '2012-05-16': { selected: true, marked: true },
            '2012-05-17': { marked: true },
            '2012-05-18': { disabled: true }
          }}
          // If provided, a standard RefreshControl will be added for "Pull to Refresh" functionality. Make sure to also set the refreshing prop correctly.
          onRefresh={() => console.log('refreshing...')}
          // Set this true while waiting for new data from a refresh
          refreshing={false}
          // Add a custom RefreshControl component, used to provide pull-to-refresh functionality for the ScrollView.
          refreshControl={null}
          // agenda theme
          theme={{
            agendaDayTextColor: 'yellow',
            agendaDayNumColor: 'green',
            agendaTodayColor: 'red',
            agendaKnobColor: 'rgba(96,173,94,0.6)',
            todayTextColor: colors.BRIGHT_GREEN,
            selectedDayBackgroundColor: colors.BRIGHT_GREEN,
            selectedDayTextColor: colors.white
          }}
          // agenda container style
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
    shadowRadius: 1 / 2,
    shadowOffset: {
      height: 1,
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

export default TimeSheetDashboardScreen;
