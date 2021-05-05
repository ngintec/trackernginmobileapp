import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  ToastAndroid,
  Alert,
  Pressable,
  Text,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {colors, globalHeight, globalWidth} from '../../constants/Dimension';
import {
  apiEndPoint,
  apiEndPoint1,
  apiEndPoint2,
  apiEndPoint3,
} from '../../server/endPoint';
import {WrappedTextInput, WrappedButton} from './components';

const Register = ({navigation}) => {
  const [mobileNumber, setMobileNumber] = useState(null);
  const [userName, setUserName] = useState(null); //as emeail
  const [alias, setAlias] = useState(null);
  const [password, setPassword] = useState(null);
  const [repassword, setRePassword] = useState(null);

  const [loading, setLoading] = useState(false);
  const [json, setJson] = useState([]);
  const [reason, setReason] = useState([]);

  const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : -40;

  const onRegister = () => {
    if (!userName && !password && !repassword) {
      alert('Please enter all the credential');
    } else if (!mobileNumber) {
      alert('Enter mobile number');
    } else if (!userName) {
      alert('Enter Username');
    } else if (!password) {
      alert('Enter Password');
    } else if (!repassword) {
      alert('Enter confirm Password');
    } else if (password != repassword) {
      alert("Password doesn't match");
    } else if (password.length != 8 || repassword.length != 8) {
      alert('Lenght of the Password should be minimum 8 characters long ');
    } else if (mobileNumber.length != 10) {
      alert('Enter valid mobile number ');
    } else {
      registerApiCall();
    }
  };

  const registerApiCall = async () => {
    setLoading(true);
    fetch(apiEndPoint3 + 'users', {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: mobileNumber,
        email: userName,
        alias: alias,
        password: password,
        confirmpassword: repassword,
      }),
    })
      .then(response => response.json())
      .then(data => {
        setJson(data);
        showToastWithGravityAndOffset(
          data.message && data.message + '  ' + data.Reason,
        );
        if (
          data.Reason === 'Already Registered' ||
          'Please verify email before proceeding'
        ) {
          navigation.replace('Login');
        }
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
          placeholder="Enter Mobile number"
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
          placeholder="Enter Alias name"
          value={alias}
          onChangeText={setAlias}
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
        <WrappedTextInput
          placeholder="Re-Enter Password"
          value={repassword}
          onChangeText={setRePassword}
          secureTextEntry={true}
          password={true}
          visible-password={true}
          style={[styles.textContainer, {}]}
        />

        <View style={styles.buttonContainer}>
          <WrappedButton
            title="Register"
            onPress={() => {
              onRegister();
            }}
            color = {colors.buttonColor}
          />
          <Pressable>
            <Text
              onPress={() => navigation.navigate('Login')}
              style={{
                alignSelf: 'center',
                justifyContent: 'center',
                marginTop: 10,
              }}>
              Already Registered {'?'} LOGIN
            </Text>
          </Pressable>
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
    marginTop: globalHeight * 0.05,
    marginLeft: globalWidth * 0.05,
    marginRight: globalWidth * 0.05,
    height: globalHeight * 0.8,
    borderRadius: 5,
  },
  buttonContainer: {
    marginLeft: globalWidth * 0.1,
    marginRight: globalWidth * 0.1,
    marginTop: globalHeight * 0.05,
  },
  textContainer: {
    borderWidth: 1,
    borderColor: colors.black,
    borderRadius: 5,
    marginLeft: globalWidth * 0.05,
    marginRight: globalWidth * 0.05,
    marginTop: globalHeight * 0.05,
  },
  containerLoader: {
    flex: 1,
    justifyContent: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});

export default Register;
