import { createStackNavigator } from 'react-navigation';
import {
  TimeSheetDashboardScreen,
  AddTimeSheetScreen
} from '../../features/timesheet/screens';
import { colors } from '../../styles';

const TimeSheetNavigator = createStackNavigator(
  {
    timeSheetDashboardScreen: TimeSheetDashboardScreen,
    addTimeSheetScreen: AddTimeSheetScreen
  },
  {
    navigationOptions: {
      headerStyle: {
        backgroundColor: colors.white,
        borderBottomWidth: 0,
        elevation: 0,
        shadowOpacity: 0
      },
      headerTitleStyle: {
        textAlign: 'center',
        fontFamily: 'quicksand-medium',
        fontSize: 18
      },
      headerTintColor: colors.DARK_GREEN
    },
    mode: 'modal'
  }
);

export default TimeSheetNavigator;
