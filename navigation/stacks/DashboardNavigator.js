import { createStackNavigator } from 'react-navigation';
import { HomeScreen } from '../../screens/dashboard';
import {
  StorySoFarScreen,
  NoteScreen,
  MeetingScreen,
  PhoneCallScreen,
  ToDoScreen
} from '../../screens/story';
import { colors } from '../../styles';

const DashboardNavigator = createStackNavigator(
  {
    homeScreen: HomeScreen,
    storySoFarScreen: StorySoFarScreen,
    noteScreen: NoteScreen,
    meetingScreen: MeetingScreen,
    phoneCallScreen: PhoneCallScreen,
    toDoScreen: ToDoScreen
  },
  {
    navigationOptions: {
      headerStyle: {
        backgroundColor: colors.green,
        borderBottomWidth: 0,
        elevation: 0,
        shadowOpacity: 0
      },
      headerTitleStyle: {
        textAlign: 'center'
      },
      headerTintColor: colors.white
    }
  }
);

export default DashboardNavigator;
