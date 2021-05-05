import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Pressable,
  Text,
  ToastAndroid,
  Keyboard,
} from 'react-native';

import {colors, globalHeight, globalWidth} from '../../constants/Dimension';
import {WrappedTextInput, WrappedButton} from './components';
import {apiEndPoint, apiEndPoint1, apiEndPoint3} from '../../server/endPoint';

import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({navigation}) => {
  const [mobileNumber, setMobileNumber] = useState(null);
  const [userName, setUserName] = useState(null);
  const [password, setPassword] = useState(null);
  const [loading, setLoading] = useState(false);
  const frequency = useState('10');

  const onLogin = () => {
    if (!userName && !password && !mobileNumber) {
      alert('Enter Login credential');
    } else if (!userName) {
      alert('Enter Username');
    } else if (!password) {
      alert('Enter Password');
    } else if (!mobileNumber) {
      alert('Enter Mobile number');
    } else {
      login();
    }
  };

  const login = async () => {
    Keyboard.dismiss();

    setLoading(true);
    fetch(apiEndPoint3 + 'users', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: mobileNumber,
        email: userName,
        password: password,
      }),
    })
      .then(response => response.json())
      .then(data => {
        data.trackers &&
          AsyncStorage.setItem('Trackers', JSON.stringify(data.trackers));
        data.message && showToastWithGravityAndOffset(data.message);
        data.token && AsyncStorage.setItem('LoginToken', data.token);
        data.token && AsyncStorage.setItem('ID', data.id);
        data.token && AsyncStorage.setItem('Frequency', frequency.toString());
        data.token && showToastWithGravityAndOffset('Login Successful');
        data.token && navigation.navigate('Home');
      })
      .catch(error => console.error(error))
      .finally(() => setLoading(false));
  };

  const showToastWithGravityAndOffset = content => {
    ToastAndroid.showWithGravityAndOffset(
      content,
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
  };

  return (
    <View style={styles.container}>
      <WrappedTextInput
        placeholder="Enter Mobile Number"
        value={mobileNumber}
        onChangeText={setMobileNumber}
        keyboardType="numeric"
        secureTextEntry={false}
        style={[styles.textContainer, {}]}
      />

      <WrappedTextInput
        placeholder="Enter Email ID"
        value={userName}
        onChangeText={setUserName}
        keyboardType="email-address"
        secureTextEntry={false}
        style={[styles.textContainer, {}]}
      />

      <WrappedTextInput
        placeholder="Enter Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
        password={true}
        visible-password={true}
        style={[styles.textContainer, {}]}
      />
      <View style={styles.buttonContainer}>
        <WrappedButton
          title="Login"
          onPress={() => {
            onLogin();
          }}
          color={colors.buttonColor}
        />

        <View style={{flexDirection: 'row', alignSelf: 'center'}}>
          <Pressable>
            <Text
              onPress={() => navigation.navigate('Forget Password')}
              style={{
                alignSelf: 'center',
                justifyContent: 'center',
                marginTop: 10,
              }}>
              Forgot password
            </Text>
          </Pressable>
          <Pressable>
            <Text
              onPress={() => navigation.navigate('Register')}
              style={{
                alignSelf: 'center',
                justifyContent: 'center',
                marginTop: 10,
              }}>
              {'       '}NEW ? REGISTER
            </Text>
          </Pressable>
        </View>
      </View>
      {loading === true && (
        <View style={[styles.containerLoader, styles.horizontal]}>
          <ActivityIndicator size="large" color={colors.loginBackgroung} />
        </View>
      )}
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    marginTop: globalHeight * 0.09,
    marginLeft: globalWidth * 0.05,
    marginRight: globalWidth * 0.05,
    height: globalHeight * 0.52,
    borderRadius: 5,
  },
  buttonContainer: {
    marginLeft: globalWidth * 0.1,
    marginRight: globalWidth * 0.1,
    marginTop: globalHeight * 0.035,
  },
  textContainer: {
    borderWidth: 1,
    borderColor: colors.black,
    borderRadius: 5,
    marginLeft: globalWidth * 0.05,
    marginRight: globalWidth * 0.05,
    marginTop: globalHeight * 0.05,
  },
});

export default Login;
