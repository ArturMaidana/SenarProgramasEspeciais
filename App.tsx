import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import StackNavigator from './src/Navigations/StackNavigator';
import UserContextProvider from './src/contexts/UserContext';
import { AlertNotificationRoot } from 'react-native-alert-notification';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <UserContextProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <AlertNotificationRoot>
              <StackNavigator />
            </AlertNotificationRoot>
          </GestureHandlerRootView>
        </UserContextProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};
