import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation';
import { DashboardNavigator, ContactNavigator } from '../stacks';
import { Ionicons } from '@expo/vector-icons';
import { SettingsScreen } from '../../screens/settings';

const mainTabNavigator = createBottomTabNavigator(
  {
    Home: {
      screen: SettingsScreen,
      path: '',
      navigationOptions: {
        tabBarLabel: 'Dashboard',
        tabBarIcon: ({ tintColor, focused }) => (
          <Ionicons
            name={focused ? 'ios-home' : 'ios-home-outline'}
            size={26}
            style={{ color: tintColor }}
          />
        )
      }
    },
    Contacts: {
      screen: SettingsScreen,
      path: 'contacts',
      navigationOptions: {
        tabBarLabel: 'Contacts',
        tabBarIcon: ({ tintColor, focused }) => (
          <Ionicons
            name={focused ? 'ios-people' : 'ios-people-outline'}
            size={26}
            style={{ color: tintColor }}
          />
        )
      }
    },
    Settings: {
      screen: SettingsScreen,
      path: 'settings'
    }
  },
  {
    tabBarOptions: {
      activeTintColor: Platform.OS === 'ios' ? '#5a9f4d' : '#fff'
    }
  }
);

export default mainTabNavigator;
