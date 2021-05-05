import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  Text,
  View,
  ToastAndroid,
  StyleSheet,
  ActivityIndicator,
  DevSettings,
  Button,
  Pressable,
  Alert,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {colors, globalHeight} from '../../../constants/Dimension';
import {apiEndPoint, apiEndPoint3} from '../../../server/endPoint';
import DrawerIcon from '../../component/sideBarDrawerLogo';

export default function RemoveTracker({navigation}) {
  const [token, setToken] = useState();
  const [id, setId] = useState();
  const [json, setJson] = useState([]);
  const [loading, setLoading] = useState(false);
  const [trackersArray, setTrackersArray] = useState([]);

  useEffect(() => {
    getKey();
  }, [2]);

  const viewTrackerAPI = async () => {
    setLoading(true);
    fetch(apiEndPoint3 + 'tracker', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        id: id,
        token: token,
      },
    })
      .then(response => response.json())
      .then(data => {
        setJson(data);
      })
      .catch(error => console.error(error))
      .finally(() => setLoading(false));
  };

  const removeTrackerAPI = async numToDel => {
    setLoading(true);
    fetch(apiEndPoint3 + 'tracker', {
      method: 'Delete',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        id: id,
        token: token,
      },
      body: JSON.stringify({
        Tracker: numToDel,
      }),
    })
      .then(response => response.json())
      .then(data => {
        setJson(data);
        showToastWithGravityAndOffset(data.message);
        data.Trackers && viewTrackerAPI();
        data.Trackers && getKey();
        data.Trackers && AsyncStorage.setItem('Trackers', JSON.stringify(data.Trackers));
        const valueTracker = AsyncStorage.getItem('Trackers');
        setTrackersArray(JSON.parse(valueTracker));
      })
      .catch(error => __DEV__ && console.error(error))
      .finally(() => setLoading(false));
  };

  const getKey = async () => {
    try {
      const value = await AsyncStorage.getItem('LoginToken');
      const valueID = await AsyncStorage.getItem('ID');
      const valueTracker = await AsyncStorage.getItem('Trackers');
      setTrackersArray(JSON.parse(valueTracker));
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
    <View>
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

      <View>
        {trackersArray === undefined ? (
          <View>
            {getKey()}
            <Text>SOmething went wrong </Text>
            <Button title="Reload" onPress={() => viewTrackerAPI()} />
          </View>
        ) : (
          <ScrollView>
            <Text style={{alignSelf: 'center'}}>
              {trackersArray?.map((item, key) => (
                <Pressable
                  key={item}
                  style={styles.trackerStyles}
                  onPress={() =>
                    Alert.alert(
                      'Are you Sure that you want to delete ???',
                      item,
                      [
                        // {text: 'Reload', onPress: () => DevSettings.reload()},
                        {
                          text: 'Delete',
                          onPress: () => {
                            // setNumDelete(item);
                            let numToDel = item;
                            removeTrackerAPI(numToDel);
                          },
                          style: 'cancel',
                        },
                        {
                          text: 'Cancel',
                          onPress: () => console.log('OK Pressed'),
                        },
                      ],
                      {cancelable: false},
                    )
                  }>
                  <Text key={key} style={styles.trackersContainer}>
                    {item + '\n\n'}
                  </Text>
                </Pressable>
              ))}
            </Text>
            <Button
              title="Reload"
              onPress={() => getKey()}
              color={colors.buttonColor}
            />
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  trackersContainer: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  trackerStyles: {
    borderRadius: 5,
    height: 40,
    marginTop: 15,
    borderColor: 'grey',
    borderWidth: 1,
  },
});
