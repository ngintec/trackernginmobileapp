import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  ToastAndroid,
  Alert,
  Text,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import {colors, globalHeight, globalWidth, settingTabName} from '../../../constants/Dimension';
import {WrappedTextInput, WrappedButton} from '../../auth/components';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {apiEndPoint3 } from '../../../server/endPoint';
import DrawerIcon from '../../component/sideBarDrawerLogo';

const ResetPassword = ({navigation}) => {
  const [mobilenumber, setMobilenumber] = useState(null);
  const [email, setEmail] = useState(null);
  const [newPassword, setNewPassword] = useState(null);
  const [newPasswordConfm, setNewPasswordConfm] = useState(null);

  const [loading, setLoading] = useState(false);
  const [json, setJson] = useState([]);
  const [token, setToken] = useState();
  const [id, setId] = useState();

  const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : -40;

  useEffect(() => {
    getKey();
  }, [1]);

  const resetPassword = () => {
    if (!mobilenumber || !email || !newPassword || !newPasswordConfm) {
      alert('Enter credentials');
    } else {
      resetPasswordAPI();
    }
  };

  const resetPasswordAPI = async () => {
    setLoading(true);
    fetch(apiEndPoint3 + 'resetpassword', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        id: id,
        token: token,
      },
      body: JSON.stringify({
        confirmpassword: newPasswordConfm,
        email: email,
        id: mobilenumber,
        password: newPassword,
      }),
    })
      .then(response => response.json())
      .then(data => {
        setJson(data);
        data.message && showToastWithGravityAndOffset(data.message+'  '+data.Reason );
        data.detail && showToastWithGravityAndOffset(data.detail );
        setEmail('')
        setMobilenumber('')
        setNewPassword('')
        setNewPasswordConfm('')
      })
      .catch(error => console.error(error))
      .finally(() => setLoading(false));
  };

  const getKey = async () => {
    try {
      const value = await AsyncStorage.getItem('LoginToken');
      const valueID = await AsyncStorage.getItem('ID');
      setId(valueID);
      setToken(value);
    } catch (error) {
      __DEV__ && console.log('Error retrieving data' + error);
    }
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
    <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={keyboardVerticalOffset}>
      <View style={styles.titleContainer}>
          <Text style={styles.titleTextContainer}>{settingTabName}</Text>
      </View>
      <View style={{position: 'absolute', marginTop: globalHeight * -0.035}}>
        <DrawerIcon
          onPress={() => {
            navigation.openDrawer();
          }}
        />
      </View>
      
      <View style={styles.container}>
        <WrappedTextInput
          placeholder="Enter Mobile number "
          value={mobilenumber}
          onChangeText={setMobilenumber}
          keyboardType="numeric"
          secureTextEntry={false}
          style={[styles.textContainer, {}]}
        />
        <WrappedTextInput
          placeholder="Enter E-mail ID "
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          secureTextEntry={false}
          style={[styles.textContainer, {}]}
        />

        <WrappedTextInput
          placeholder="Enter new password "
          value={newPassword}
          onChangeText={setNewPassword}
          keyboardType="email-address"
          secureTextEntry={true}
          password={true}
          visible-password={true}
          style={[styles.textContainer, {}]}
        />

        <WrappedTextInput
          placeholder="Confirm password "
          value={newPasswordConfm}
          onChangeText={setNewPasswordConfm}
          keyboardType="email-address"
          secureTextEntry={true}
          password={true}
          visible-password={true}
          style={[styles.textContainer, {}]}
        />

        <View style={styles.buttonContainer}>
          <WrappedButton
            title="Reset Password"
            onPress={() => {
              resetPassword();
            }}
            color = {colors.buttonColor}
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
    marginTop: globalHeight / 100,
    marginLeft: globalWidth * .05,
    marginRight: globalWidth * 0.05,
    height: globalHeight * 0.8,
    borderRadius: 5,
    justifyContent: 'center',
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
  titleContainer: {
    backgroundColor: colors.headerColor,
    height: globalHeight * 0.083,
    alignItems:'center',
    justifyContent:'center'
  },
  titleTextContainer: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 25,
    alignSelf: 'center',
  },
});

export default ResetPassword;
