import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WordListScreen from '../src/screens/WordListScreen';
import AddWordScreen from '../src/screens/AddWordScreen';
import HomeScreen from '../src/screens/HomeScreen';
import QuizScreen from '../src/screens/QuizScreen';
import SettingsScreen from '../src/screens/SettingsScreen';
import ReportScreen from '../src/screens/ReportScreen';
import LogoutScreen from '../src/screens/LogoutScreen';
import EditProfileScreen from '../src/screens/EditProfileScreen';

const Stack=createNativeStackNavigator()



export default function UserStack() {
  return (
    <NavigationContainer >
      <Stack.Navigator screenOptions={{headerShown:false}}>
    

     
      <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Quiz" component={QuizScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Report" component={ReportScreen} />
        <Stack.Screen name ="AddWord" component ={AddWordScreen} />
        <Stack.Screen name ="ListWord" component ={WordListScreen} />
        <Stack.Screen name ="Logout" component ={LogoutScreen} />
        <Stack.Screen name ="EditProfile" component ={EditProfileScreen} />
       
      </Stack.Navigator>
    </NavigationContainer>
  );
}