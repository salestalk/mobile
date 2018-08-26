import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation';
import { DashboardNavigator, ContactNavigator } from '../stacks';
import { Ionicons, Feather } from '@expo/vector-icons';
import { SettingsScreen } from '../../screens/settings';

const mainTabNavigator = createBottomTabNavigator(
  {
    Home: {
      screen: DashboardNavigator,
      path: 'dashboard',
      navigationOptions: {
        tabBarLabel: 'dashboard',
        tabBarIcon: ({ tintColor, focused }) => (
          <Feather name={'home'} size={26} style={{ color: tintColor }} />
        )
      }
    },
    Contacts: {
      screen: ContactNavigator,
      path: 'contacts',
      navigationOptions: {
        tabBarLabel: 'contacts',
        tabBarIcon: ({ tintColor, focused }) => (
          <Feather name={'users'} size={26} style={{ color: tintColor }} />
        )
      }
    },
    Settings: {
      screen: SettingsScreen,
      path: 'settings',
      navigationOptions: {
        tabBarLabel: 'settings',
        tabBarIcon: ({ tintColor, focused }) => (
          <Feather name={'settings'} size={26} style={{ color: tintColor }} />
        )
      }
    }
  },
  {
    tabBarOptions: {
      activeTintColor: '#5a9f4d',
      inactiveTintColor: '#ddd',
      tabStyle: {
        backgroundColor: 'white',
        borderTopWidth: 0,
        borderTopColor: 'white'
      },
      style: {
        borderTopWidth: 0
      }
    }
  }
);

export default mainTabNavigator;
