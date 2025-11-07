import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import CustomTabBar from '../components/ui/CustomTabBar';
import Home from '../screens/Home/HomeScreen';
import AttedanceToday from '../screens/Attendances/AttendanceToday';
import Profile from '../screens/Profile/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        lazy: false,
        animationEnabled: true,
      }}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="AttedanceToday" component={AttedanceToday} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}
