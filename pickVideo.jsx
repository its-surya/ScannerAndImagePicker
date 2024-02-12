import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Modal,
  Dimensions,
  PanResponder,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import VideoPlayer from 'react-native-video-controls';
import Swiper from 'react-native-swiper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'; // Example for using FontAwesome icons

export default function pickVideo() {
  const [mediaList, setMediaList] = useState([]);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false); // Track video play state

  const toggleModal = index => {
    setSelectedMediaIndex(index);
    setIsModalVisible(!isModalVisible);
    setIsVideoPlaying(false); // Pause video when modal is opened
  };

  const onPickCameraMedia = async () => {
    try {
      const result = await launchCamera({mediaType: 'video'});
      if (result && !result.didCancel) {
        setMediaList([...mediaList, result.assets[0].uri]);
      }
    } catch (error) {
      console.error('Camera Error:', error);
    }
  };

  const onPickGalleryMedia = async () => {
    const result = await launchImageLibrary({mediaType: 'video'});
    if (!result.didCancel) {
      setMediaList([...mediaList, result.assets[0].uri]);
    }
  };

  const renderMediaItem = ({item, index}) => {
    return (
      <TouchableOpacity onPress={() => toggleModal(index)}>
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={{uri: item}} />
          <MaterialCommunityIcons
            name="play-circle-outline"
            size={30}
            color="white"
            style={styles.playIcon}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <Text style={styles.title}>Select a Video</Text>
        <View style={styles.buttonContainer}>
          <View style={{marginBottom: 10}}>
            <Button
              onPress={onPickCameraMedia}
              title="Pick Video from Camera"
              color="#4255e5"
            />
          </View>
          <Button
            onPress={onPickGalleryMedia}
            title="Pick Video from Gallery"
            color="#4dbd91"
          />
        </View>
      </View>
      <FlatList
        data={mediaList}
        renderItem={renderMediaItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal={true}
        contentContainerStyle={styles.flatListContainer}
      />
      <Modal
        animationType="slide"
        transparent={false}
        visible={isModalVisible}
        onRequestClose={() => toggleModal(null)}>
        <Swiper
          loop={false}
          index={selectedMediaIndex}
          showsPagination={false}
          style={styles.wrapper}>
          {mediaList.map((media, index) => (
            <View style={styles.slide} key={index}>
              <TouchableOpacity
                onPress={() => setIsVideoPlaying(!isVideoPlaying)}>
                <VideoPlayer
                  source={{uri: media}}
                  style={styles.fullScreenVideo}
                  controls={true}
                  paused={!isVideoPlaying} // Pause the video if isVideoPlaying is false
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          ))}
        </Swiper>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    color: '#f99142',
    marginBottom: 20,
  },
  body: {
    marginHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  buttonContainer: {
    marginBottom: 10,
    justifyContent: 'space-around',
    width: '100%',
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  playIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{translateX: -15}, {translateY: -15}],
  },
  flatListContainer: {
    alignItems: 'center',
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenVideo: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  wrapper: {},
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
