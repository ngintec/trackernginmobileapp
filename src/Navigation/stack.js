import React, { Component } from "react";
import { View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";

import { Login,Register } from "../screens/auth";
import Home from '../screens/app/Home'

const Stack = createStackNavigator();

class Auth extends Component {
    render() {
      return (
        <Stack.Navigator>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
        </Stack.Navigator>
      );
    }
}

class HOmes extends Component {
    render() {
      return (
        <Stack.Navigator>
          <Stack.Screen name="Home" component={Home} />
        </Stack.Navigator>
      );
    }
}

export default class Navigator extends Component{
    render(){
        return(
            <View>
                <Stack.Navigator initialRouteName={Auth}>
                    <Stack.Screen name="Auth" component={Auth} />
                    <Stack.Screen name="HOmes" component={HOmes} />
                </Stack.Navigator>
            </View>
        )
    }
}