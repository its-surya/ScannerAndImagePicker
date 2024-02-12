import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import VideoAndImage from './VideoAndImage';

const HomeScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="black" />
      <ImageBackground
        source={require('./Images/Camera.jpg')}
        style={styles.backgroundImage}>
        <View style={styles.overlay} />
        <View>
          <Text style={styles.logoText}>CAM</Text>
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.contentText}>Explore your Capture</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate(VideoAndImage)}>
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust the opacity as needed
  },
  logoText: {
    marginStart: 30,
    marginTop: 30,
    fontSize: 48,
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'helvetica',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'black',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: 'yellow',
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default HomeScreen;
