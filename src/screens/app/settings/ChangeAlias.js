import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  ToastAndroid,
  Alert,
  Text,
  KeyboardAvoidingView,
  StatusBar,
} from 'react-native';
import {
  colors,
  globalHeight,
  globalWidth,
  settingTabName,
} from '../../../constants/Dimension';
import {WrappedTextInput, WrappedButton} from '../../auth/components';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {apiEndPoint3} from '../../../server/endPoint';
import DrawerIcon from '../../component/sideBarDrawerLogo';

const changeAlias = ({navigation}) => {
  const [alias, setAlias] = useState(null);
  const [loading, setLoading] = useState(false);
  const [json, setJson] = useState([]);
  const [token, setToken] = useState();
  const [id, setId] = useState();
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 50;

  useEffect(() => {
    getKey();
  }, [1]);

  const onChangeAlias = () => {
    if (!alias) {
      alert('Enter new alias');
    } else {
      changeAliasAPI();
    }
  };

  const changeAliasAPI = async () => {
    setLoading(true);
    fetch(apiEndPoint3 + 'alias', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        id: id,
        token: token,
      },
      body: JSON.stringify({
        alias: alias,
      }),
    })
      .then(response => response.json())
      .then(data => {
        setJson(data);
        showToastWithGravityAndOffset(data.message);
        setAlias('')
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
    <KeyboardAvoidingView
      behavior="position"
      keyboardVerticalOffset={keyboardVerticalOffset}>
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
          placeholder="Enter new alias "
          value={alias}
          onChangeText={setAlias}
          keyboardType="email-address"
          secureTextEntry={false}
          style={[styles.textContainer, {}]}
        />

        <View style={styles.buttonContainer}>
          <WrappedButton
            title="Change Alias"
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleTextContainer: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 25,
    alignSelf: 'center',
  },
});

export default changeAlias;
