import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SignIn from '../screens/Login/SignInScreen';
import Splash from '../screens/Preload/SplashScreen';
import MainTabs from '../stacks/MainTabs';
import Atendimento from '../screens/Attendances/AttendanceScreen';
import ForgetPassword from '../screens/ForgetPassword/ForgetPassword';
import Relatorio from '../screens/Relatorios/RelatorioScreen';
import ServiceDetailsScreen from '../screens/Relatorios/ServiceDetailsScreen';
import SelectMutirao from '../screens/SelectMutiraoScreen/SelectMutiraoScreen';
import ShowService from '../screens/FormsParticipant/ShowService';
import CreateService from '../screens/FormsParticipant/CreateService';

import NewFormulario from '../screens/FormsParticipant/RegisterService';

const Stack = createNativeStackNavigator();

export default function MainStack() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        lazy: false,
        animationEnabled: true,
      }}
    >
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
      <Stack.Screen name="Atendimentos" component={Atendimento} />
      <Stack.Screen name="NewFormulario" component={NewFormulario} />
      <Stack.Screen name="Relatorio" component={Relatorio} />
      <Stack.Screen name="ServiceDetails" component={ServiceDetailsScreen} />
      <Stack.Screen name="SelectMutirao" component={SelectMutirao} />
      <Stack.Screen name="ShowService" component={ShowService} />
      <Stack.Screen name="CreateService" component={CreateService} />

      <Stack.Screen name="MainTabs" component={MainTabs} />
    </Stack.Navigator>
  );
}
