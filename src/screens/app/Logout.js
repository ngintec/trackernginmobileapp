import React, {useEffect} from 'react';
import {Text, Alert, BackHandler, View, Button} from 'react-native';
import {globalHeight, globalWidth} from '../../constants/Dimension';

export default function Logout({navigation}) {
  useEffect(() => {
    logot();
  }, []);

  const logot = () => {
    Alert.alert(
      'LOGOUT',
      'Are you sure that you want to exit the app',
      [
        {
          text: 'Exit',
          onPress: () => BackHandler.exitApp(),
          style: 'cancel',
        },
        {text: 'Cancel', onPress: () => navigation.navigate('Home')},
      ],
      {cancelable: false},
    );
  };

  return (
    <View
      style={{
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'grey',
        height: globalHeight,
        width: globalWidth,
      }}>
      <Button title="Logout" onPress={() => logot()} />
    </View>
  );
}
