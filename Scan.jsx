import {
  Button,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Linking,
  TouchableOpacity,
  Animated,
} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import call from 'react-native-phone-call';
import Share from 'react-native-share';

const Scan = () => {
  const [torchOn, setTorchOn] = useState(false);

  const handleToggleTorch = () => {
    setTorchOn(prev => !prev);
  };

  const [data, setData] = useState('Scan Something');
  const [isScannerVisible, setScannerVisible] = useState(false);
  const scannerRef = useRef(null);
  const animatedValue = useRef(new Animated.Value(0)).current;

  const handleScanButtonPress = () => {
    setScannerVisible(true);
  };

  const handleScannerClose = () => {
    setScannerVisible(false);
  };

  const callBack = () => {
    // Define the phone number you want to call
    Linking.openURL(`tel:9876543212`);
  };

  const handleShareButtonPress = () => {
    const shareOptions = {
      title: 'Share file via',
      message: 'Check out this file!',
      url: 'file://path/to/your/file', // Replace with the actual file path or content URI
    };

    Share.open(shareOptions)
      .then(res => console.log(res))
      .catch(err => console.error(err));
  };

  const resetScanner = () => {
    setData('Scan Something');
    if (scannerRef.current) {
      scannerRef.current.reactivate();
    }
  };

  useEffect(() => {
    const moveLine = () => {
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        }),
      ]).start(moveLine);
    };

    moveLine();
  }, [animatedValue]);

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 240], // Adjust the range as needed
  });

  return (
    <View style={{flex: 1}}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <TouchableOpacity onPress={callBack} style={{marginTop: 30}}>
        <Text>hello</Text>
      </TouchableOpacity>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          marginTop: 10,
        }}>
        <Button title="Share File" onPress={handleShareButtonPress} />
      </View>

      {isScannerVisible ? (
        <View style={{position: 'absolute', height: '100%'}}>
          <QRCodeScanner
            ref={scannerRef}
            onRead={({data}) => {
              setData(data);
              handleScannerClose(); // Close the scanner after a successful scan
            }}
            flashMode={
              torchOn
                ? RNCamera.Constants.FlashMode.torch
                : RNCamera.Constants.FlashMode.off
            }
            reactivate={true}
            showMarker={true}
            reactivateTimeout={4000} // Adjust the timeout as needed
            cameraStyle={styles.cameraContainer}
          />
          <Animated.View
            style={{
              position: 'absolute',
              top: 270,
              width: '68%',
              height: 2,
              marginLeft: 57,
              backgroundColor: 'lightgreen',
              transform: [{translateY}],
            }}
          />
          <View
            style={{
              position: 'absolute',
              marginTop: 40,
              marginStart: 20,
            }}>
            <TouchableOpacity onPress={handleScannerClose}>
              <MaterialCommunityIcons
                name={'close-thick'}
                color="#ffffff"
                size={25}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              position: 'absolute',
              marginTop: 40,
              marginStart: 270,
            }}>
            <TouchableOpacity onPress={handleToggleTorch}>
              <Entypo
                name={torchOn ? 'flash-off' : 'flash'}
                color="#ffffff"
                size={25}
              />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>{data}</Text>
          <Button title="Scan QR Code" onPress={handleScanButtonPress} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  bottomContent: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 36, // Adjust this value as needed
  },
  cameraContainer: {
    height: '100%',
  },
  bottomContainer: {
    position: 'absolute',
  },
});

export default Scan;
