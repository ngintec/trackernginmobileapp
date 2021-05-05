import 'react-native-gesture-handler';
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import Navigator from './src/Navigation/stack';

import Login from './src/screens/auth/Login';
import Register from './src/screens/auth/Register';
import ForgetPassword from './src/screens/auth/ForgetPassword';
import Home from './src/screens/app/Home';

import {
  AddTracker,
  ViewTracker,
  RemoveTracker,
} from './src/screens/app/trackers';
import {
  ChangeAlias,
  ResetPassword,
  Frequency,
} from './src/screens/app/settings';
import Logout from './src/screens/app/Logout';
import {colors, globalHeight, tabFontSize} from './src/constants/Dimension';
import { StatusBar } from 'react-native';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  const Auth = () => {
    return (
      <Stack.Navigator initialRouteName={'Login'}>
        <Stack.Screen
          name="Register"
          component={Register}
          options={{
            headerStyle: {
              backgroundColor: colors.headerColor,
            },
            headerTitleAlign: 'center',
            headerTintColor: colors.white,
            title: 'TrackerNgin',
          }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerStyle: {
              backgroundColor: colors.headerColor,
            },
            headerTitleAlign: 'center',
            headerTintColor: colors.white,
            title: 'TrackerNgin',
          }}
        />
        <Stack.Screen
          name="Forget Password"
          component={ForgetPassword}
          options={{
            headerStyle: {
              backgroundColor: colors.headerColor,
            },
            headerTitleAlign: 'center',
            headerTintColor: colors.white,
            title: 'TrackerNgin',
          }}
        />
      </Stack.Navigator>
    );
  };


  const Homes = () => {
    return (
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={Home} />
        <Drawer.Screen name="Trackers" component={BottomTabTracker} />
        <Drawer.Screen name="Settings" component={BottomTabSetting} />
        <Drawer.Screen name="Logout" component={Logout} />
      </Drawer.Navigator>
    );
  };

  const BottomTabTracker = () => {
    return (
      <Tab.Navigator
        tabBarOptions={{
          activeTintColor: 'tomato',
          inactiveTintColor: colors.white,
          labelStyle: {
            fontSize: tabFontSize,
            top: globalHeight * -0.02,
          },
          style:{
            backgroundColor:colors.black,
          }
        }}>
        <Stack.Screen name="Add" component={AddTracker} />
        <Stack.Screen name="View" component={ViewTracker} />
        <Stack.Screen name="Remove" component={RemoveTracker} />
      </Tab.Navigator>
    );
  };

  const BottomTabSetting = () => {
    return (
      <Tab.Navigator
        headerMode={'screen'}
        tabBarOptions={{
          activeTintColor: 'tomato',
          inactiveTintColor: colors.white,
          labelStyle: {
            fontSize: tabFontSize,
            top: globalHeight * -0.02,
          },
          style:{
            backgroundColor:colors.black,
          }
        }}>
        <Stack.Screen name="Change Alias" component={ChangeAlias} />
        <Stack.Screen name="Reset Password" component={ResetPassword} />
        <Stack.Screen name="Set Frequency " component={Frequency} />
      </Tab.Navigator>
    );
  };

  return (
    <NavigationContainer>
      <StatusBar backgroundColor={colors.black}/>
      <Stack.Navigator headerMode={'none'}>
        <Stack.Screen name="authScreen" component={Auth} />
        <Stack.Screen name="Home" component={Homes} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
