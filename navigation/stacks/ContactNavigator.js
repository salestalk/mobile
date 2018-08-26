import { createStackNavigator } from 'react-navigation';
import {
  ContactListScreen,
  ContactListDetailScreen
} from '../../screens/contact';
import {
  StorySoFarScreen,
  NoteScreen,
  MeetingScreen,
  PhoneCallScreen,
  ToDoScreen
} from '../../screens/story';
import { colors } from '../../styles';

const ContactNavigator = createStackNavigator(
  {
    contactListScreen: ContactListScreen,
    contactListDetailScreen: ContactListDetailScreen,
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

export default ContactNavigator;
