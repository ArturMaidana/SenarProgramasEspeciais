import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import MainStack from './src/stacks/MainStack';
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
              <MainStack />
            </AlertNotificationRoot>
          </GestureHandlerRootView>
        </UserContextProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};
