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
import {colors, globalHeight, globalWidth} from '../../../constants/Dimension';
import {WrappedTextInput, WrappedButton} from '../../auth/components';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {apiEndPoint3} from '../../../server/endPoint';
import DrawerIcon from '../../component/sideBarDrawerLogo';

const AddTracker = ({navigation}) => {
  const [mobileNumber, setMobileNumber] = useState(null);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState();
  const [id, setId] = useState();
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 50;

  useEffect(() => {
    getKey();
  }, [1]);

  const onAddTracker = () => {
    if (!mobileNumber) {
      alert('Enter mobile number');
    } else {
      addTrackerAPI();
    }
  };

  const addTrackerAPI = async () => {
    setLoading(true);
    fetch(apiEndPoint3 + 'tracker', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        id: id,
        token: token,
      },
      body: JSON.stringify({
        Tracker: mobileNumber,
      }),
    })
      .then(response => response.json())
      .then(data => {
        showToastWithGravityAndOffset(data.message);
        data.Trackers &&
          AsyncStorage.setItem('Trackers', JSON.stringify(data.Trackers));
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
      console.log('Error retrieving data' + error);
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
    <KeyboardAvoidingView
      behavior="position"
      keyboardVerticalOffset={keyboardVerticalOffset}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleTextContainer}>Tracker</Text>
      </View>
      <View style={{position: 'absolute', marginTop: globalHeight * -0.035}}>
        <DrawerIcon
          onPress={() => {
            navigation.openDrawer();
          }}
        />
      </View>
      <Text>
        {mobileNumber && mobileNumber.length >= 10 && Keyboard.dismiss()}
      </Text>
      <View style={styles.container}>
        <WrappedTextInput
          placeholder="Enter Mobile number"
          value={mobileNumber}
          onChangeText={setMobileNumber}
          keyboardType="numeric"
          secureTextEntry={false}
          style={[styles.textContainer, {}]}
        />

        <View style={styles.buttonContainer}>
          <WrappedButton
            title="Add"
            onPress={() => {
              onAddTracker();
            }}
            color={colors.buttonColor}
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
    marginTop: globalHeight / 5,
    marginLeft: globalWidth * 0.05,
    marginRight: globalWidth * 0.05,
    height: globalHeight * 0.4,
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleTextContainer: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 25,
  },
});

export default AddTracker;
