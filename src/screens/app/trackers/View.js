import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  DevSettings,
  Button,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {colors, globalHeight} from '../../../constants/Dimension';
import DrawerIcon from '../../component/sideBarDrawerLogo';

export default function ViewTracker({navigation}) {
  const [trackersArray, setTrackersArray] = useState([]);

  useEffect(() => {
    getKey();
  }, [1]);

  const getKey = async () => {
    try {
      const valueTracker = await AsyncStorage.getItem('Trackers');
      setTrackersArray(JSON.parse(valueTracker));
    } catch (error) {
      if (__DEV__) {
        console.log('Error retrieving data' + error);
      }
    }
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
            <Text>SOmething went wrong </Text>
          </View>
        ) : (
          <ScrollView>
            <Text style={{alignSelf: 'center'}}>
              {trackersArray?.map((item, key) => (
                <Text key={key} style={styles.trackersContainer}>
                  {item + '\n'}
                </Text>
              ))}
            </Text>
          </ScrollView>
        )}
      </View>
      {/* )} */}
      <Button
        title="Reload"
        onPress={() => getKey()}
        color={colors.buttonColor}
      />
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
});
