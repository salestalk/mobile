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
        tabBarLabel: 'Dashboard',
        tabBarIcon: ({ tintColor, focused }) => (
          <Feather name={'home'} size={24} style={{ color: tintColor }} />
        )
      }
    },
    Contacts: {
      screen: ContactNavigator,
      path: 'contacts',
      navigationOptions: {
        tabBarLabel: 'Contacts',
        tabBarIcon: ({ tintColor, focused }) => (
          <Feather name={'users'} size={24} style={{ color: tintColor }} />
        )
      }
    },
    Settings: {
      screen: SettingsScreen,
      path: 'settings',
      navigationOptions: {
        tabBarLabel: 'Settings',
        tabBarIcon: ({ tintColor, focused }) => (
          <Feather name={'settings'} size={24} style={{ color: tintColor }} />
        )
      }
    }
  },
  {
    tabBarOptions: {
      activeTintColor: '#424242',
      inactiveTintColor: '#ddd',
      tabStyle: {
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#EEEEEE'
      },
      style: {
        borderTopWidth: 0
      }
    }
  }
);

export default mainTabNavigator;
