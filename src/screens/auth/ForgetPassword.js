import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Pressable,
  Text,
  KeyboardAvoidingView,
  ToastAndroid,
} from 'react-native';

import {colors, globalHeight, globalWidth} from '../../constants/Dimension';
import {WrappedTextInput, WrappedButton} from './components';
import {apiEndPoint, apiEndPoint1, apiEndPoint3} from '../../server/endPoint';

import AsyncStorage from '@react-native-async-storage/async-storage';

const ForgetPassword = ({navigation}) => {
  const [mobileNumber, setMobileNumber] = useState(null);
  const [userName, setUserName] = useState(null);
  const [password, setPassword] = useState(null);
  const [confPassword, setConfPassword] = useState(null);

  const [json, setJson] = useState([]);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState();

  const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 40;

  const onFgtPswd = () => {
    if (!mobileNumber && !userName) {
      alert('Enter Login credential');
    } else if (!mobileNumber) {
      alert('Enter Username');
    } else if (!userName) {
      alert('Enter Password');
    } else {
      login();
    }
  };

  const login = async () => {
    console.log('new resetpassword');
    setLoading(true);
    fetch(apiEndPoint3 + 'forgotpassword', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: mobileNumber,
        email: userName,
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        data.message && showToastWithGravityAndOffset(data.message);
        data.message != 'Could not Perform operation' && navigation.navigate('Login')
        // data.token && navigation.navigate('Home');
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
    <KeyboardAvoidingView
      behavior="position"
      keyboardVerticalOffset={keyboardVerticalOffset}>
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

        <View style={styles.buttonContainer}>
          <WrappedButton
            title="Reset Password"
            onPress={() => {
              onFgtPswd();
            }}
            color ={ colors.buttonColor}
          />
        </View>
        {loading === true && (
          <View style={[styles.containerLoader, styles.horizontal]}>
            <ActivityIndicator size="large" color={colors.loginBackgroung} />
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    marginTop: globalHeight * 0.09,
    marginLeft: globalWidth * 0.05,
    marginRight: globalWidth * 0.05,
    height: globalHeight * 0.37,
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

export default ForgetPassword;
