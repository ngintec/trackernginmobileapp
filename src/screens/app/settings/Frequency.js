import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  ToastAndroid,
  Alert,
  Text,
  KeyboardAvoidingView,
} from 'react-native';
import {colors, globalHeight, globalWidth, settingTabName} from '../../../constants/Dimension';
import {WrappedTextInput, WrappedButton} from '../../auth/components';

import AsyncStorage from '@react-native-async-storage/async-storage';
import DrawerIcon from '../../component/sideBarDrawerLogo';

const Frequency = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [frequency, setFrequency] = useState([]);
  const [frequencyN, setFrequencyN] = useState();
  const [id, setId] = useState();
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 50;

  useEffect(() => {
    getKey();
  }, [1]);

  const onChangeAlias = () => {
    if (!frequencyN) {
      alert('Enter new frequency');
    } else {
      changeFrequencyAPI();
    }
  };

  const changeFrequencyAPI = async () => {
    AsyncStorage.setItem('Frequency', frequencyN);
    const valueID = await AsyncStorage.getItem('Frequency');
    showToastWithGravityAndOffset('Frequency Changed to ' + frequencyN);
    navigation.replace('Home');
  };

  const getKey = async () => {
    try {
      const valueID = await AsyncStorage.getItem('Frequency');
      setFrequency(valueID.substring(0, 2));
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
        <Text style={{alignSelf: 'center', color: '#cfcfcf'}}>
          You can set the frequency interval(IN SECONDS) at which the your
          location gets updated.
        </Text>

        <WrappedTextInput
          placeholder={'Current Frequency  : ' + frequency}
          value={frequencyN}
          onChangeText={setFrequencyN}
          keyboardType="email-address"
          secureTextEntry={false}
          style={[styles.textContainer, {}]}
        />

        <View style={styles.buttonContainer}>
          <WrappedButton
            title="Change Frequency"
            onPress={() => {
              onChangeAlias();
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
    marginTop: globalHeight / 4.5,
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

export default Frequency;
