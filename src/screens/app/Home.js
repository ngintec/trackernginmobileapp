import React from 'react';
import {
  Text,
  StyleSheet,
  View,
  Button,
  PermissionsAndroid,
  Platform,
  ActivityIndicator,
  ToastAndroid,
  Alert,
  BackHandler,
  DevSettings,
  Pressable,
} from 'react-native';
import {useState, useEffect} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {colors, globalHeight, globalWidth} from '../../constants/Dimension';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import BackgroundTimer from 'react-native-background-timer';

import DrawerIcon from '../component/sideBarDrawerLogo';
import {apiEndPoint3} from '../../server/endPoint';

const Home = ({navigation, route}) => {
  const [currentLongitude, setCurrentLongitude] = useState();
  const [currentLatitude, setCurrentLatitude] = useState();
  const [locationStatus, setLocationStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState();
  const [id, setId] = useState();
  const [trackBtn, setTrackBtn] = useState(false);
  const [frequency, setFrequency] = useState();
  var watchID;
  const [freqVal, setFreqVal] = useState(10000);

  const handleBackButtonClick = () => {
    Alert.alert(
      'Are you sure you want to exit !!!',
      '',
      [
        {
          text: 'Exit',
          onPress: () => BackHandler.exitApp(),
          style: 'cancel',
        },
        {text: 'CANCEL', onPress: () => navigation.replace('Home')},
      ],
      {cancelable: false},
    );
  };

  function backHandler() {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      );
    };
  }

  useEffect(() => {
    setLoading(true);
    requestLocationPermission();
    getKey();
    backHandler();
    return () => {
      Geolocation.clearWatch(watchID);
    };
  }, []);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      getOneTimeLocation();
      subscribeLocationLocation();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Access Required',
            message: 'This App needs to Access your location',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getOneTimeLocation();
          subscribeLocationLocation();
          currentLatitude && setLoading(false);
        } else {
          setLocationStatus('Permission Denied');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const intervalFun = () => {
    sendData();
  };

  const sendData = async () => {
    BackgroundTimer.runBackgroundTimer(() => {
      watchID = Geolocation.watchPosition(
        position => {
          setLocationStatus('You are Here');
          const currentLongitud = JSON.stringify(position.coords.longitude);
          const currentLatitud = JSON.stringify(position.coords.latitude);
          fetch(apiEndPoint3 + 'location', {
            method: 'POST',
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': 0,
              Accept: 'application/json',
              'Content-Type': 'application/json',
              id: id,
              token: token,
            },
            body: JSON.stringify({
              location: [currentLongitud, currentLatitud],
            }),
          })
            .then(response => response.json())
            .then(data => {
              __DEV__ &&
                console.warn(data.message + ' Message from send location ');
            })
            .catch(error => __DEV__ && console.error(error))
            .finally(() => setLoading(false));
        },
        error => {
          setLocationStatus(error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 10000,
          distanceFilter: 50,
        },
      );
    }, 5000);
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

  const getOneTimeLocation = () => {
    setLocationStatus('Getting Location ...');
    Geolocation.getCurrentPosition(
      position => {
        setLocationStatus('You are Here');
        const currentLongitude = JSON.stringify(position.coords.longitude);
        const currentLatitude = JSON.stringify(position.coords.latitude);

        setCurrentLongitude(currentLongitude);
        setCurrentLatitude(currentLatitude);
        !trackBtn &&
          showToastWithGravityAndOffset(
            'Once Tracking Enabled, Single click on the marker to center.',
          );
        !trackBtn &&
          showToastWithGravityAndOffset(
            'Once Tracking Enabled, Double click on the marker to zoom.',
          );
        setLoading(false);
      },
      error => {
        setLocationStatus(error.message);
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 1000
      },
    );
  };

  const subscribeLocationLocation = () => {
    watchID = Geolocation.watchPosition(
      position => {
        setLocationStatus('You are Here');
        const currentLongitude = JSON.stringify(position.coords.longitude);
        const currentLatitude = JSON.stringify(position.coords.latitude);
        setCurrentLongitude(currentLongitude);
        setCurrentLatitude(currentLatitude);
      },
      error => {
        setLocationStatus(error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 10000,
        distanceFilter: 1,
      },
    );
  };

  const getKey = async () => {
    try {
      const value = await AsyncStorage.getItem('LoginToken');
      const valueID = await AsyncStorage.getItem('ID');
      const valuefreq = await AsyncStorage.getItem('Frequency');
      setToken(value);
      setId(valueID);
      setFrequency(valuefreq.substring(0, 2));

      setFreqVal(parseInt(valuefreq) * 1000);
    } catch (error) {
      console.log('Error retrieving data' + error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{position: 'absolute', top: 0}}>
        <DrawerIcon
          onPress={() => {
            alert('presed drawer');
            navigation.openDrawer();
          }}
        />
      </View>
      {loading === true ? (
        <View
          style={{
            height: globalHeight * 1,
            width: globalWidth * 2,
            backgroundColor: '#00000020',
            alignItems: 'center',
            alignSelf: 'center',
            justifyContent: 'center',
          }}>
          <ActivityIndicator size="large" color={colors.loginBackgroung} />
          <Text>{locationStatus}</Text>
          <Text>
            {locationStatus === 'Location request timed out' &&
              Alert.alert(
                'Location request timed out',
                'Reload the app, check for good network coverage or enable location in settings',
                [
                  {text: 'Reload', onPress: () => DevSettings.reload()},
                  {
                    text: 'Exit',
                    onPress: () => BackHandler.exitApp(),
                    style: 'cancel',
                  },
                ],
                {cancelable: false},
              )}
          </Text>
        </View>
      ) : (
        <View>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={{
              latitude: Number(currentLatitude),
              longitude: Number(currentLongitude),
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            minZoomLevel={trackBtn ? 1 : 0}
            zoomEnabled={true}>
            {currentLatitude && trackBtn && (
              <Marker
                coordinate={{
                  latitude: Number(currentLatitude),
                  longitude: Number(currentLongitude),
                }}
                title={locationStatus}
                //   description={'Kudla the beach city'}
              />
            )}
          </MapView>
          <View style={{position: 'absolute', top: 0}}>
            <DrawerIcon
              onPress={() => {
                navigation.openDrawer();
              }}
            />
          </View>
          <View
            style={{
              position: 'absolute',
              left: globalWidth * 0.6,
              marginTop: globalHeight * 0.85,
            }}>
            <Pressable
              onPress={() => {
                if (trackBtn) {
                  setTrackBtn(false);
                } else {
                  setTrackBtn(true);
                  intervalFun();
                }
              }}>
              <View
                style={{
                  height: 50,
                  width: 130,
                  backgroundColor: 'grey',
                  borderRadius: 15,
                }}>
                <Text
                  style={{
                    color: trackBtn ? colors.red : colors.grey,
                    alignSelf: 'center',
                    justifyContent: 'center',
                    marginTop: 6,
                  }}>
                  Tracking{' '}
                  {trackBtn ? (
                    <Text>
                      {' '}
                      ON{' '}
                      <Text style={{fontSize: 9, color: colors.white}}>
                        {' '}
                        with Frequency {frequency}{' '}
                      </Text>
                    </Text>
                  ) : (
                    <Text>OFF</Text>
                  )}
                </Text>
                <Text style={{alignSelf: 'center', fontSize: 10, marginTop: 0}}>
                  Click to{' '}
                  {trackBtn ? (
                    <Text> Disable Tracking </Text>
                  ) : (
                    <Text>Enable Tracking</Text>
                  )}
                </Text>
              </View>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  map: {
    width: globalWidth,
    height: globalHeight,
  },
  container1: {
    backgroundColor: 'black',
    width: globalWidth * 0.12,
    height: globalHeight * 0.065,
    marginTop: globalHeight * 0.05,
    marginLeft: globalWidth * 0.05,
    borderRadius: globalHeight / 2,
  },
  lines: {
    backgroundColor: colors.white,
    borderRadius: globalHeight / 0.1,
    width: globalWidth * 0.09,
    height: globalHeight * 0.006,
    top: 11,
    left: 4,
    margin: 1.1,
  },
});

export default Home;
