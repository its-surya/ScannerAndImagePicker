import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Modal,
  StatusBar,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Swiper from 'react-native-swiper';
import VideoPlayer from 'react-native-video-controls';
import ImageViewer from 'react-native-image-zoom-viewer';

export default function VideoAndImage() {
  const [mediaList, setMediaList] = useState([]);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isVideoPlayingList, setIsVideoPlayingList] = useState([]);

  useEffect(() => {
    setIsVideoPlayingList(mediaList.map(() => false));
  }, [mediaList]);

  const toggleModal = index => {
    setSelectedMediaIndex(index);
    setIsModalVisible(!isModalVisible);
  };

  const toggleVideoPlay = index => {
    const newIsVideoPlayingList = [...isVideoPlayingList];
    newIsVideoPlayingList[index] = !newIsVideoPlayingList[index];
    setIsVideoPlayingList(newIsVideoPlayingList);
  };

  const onPickCameraMedia = async () => {
    try {
      const result = await launchCamera({mediaType: 'mixed'});
      if (result && !result.didCancel) {
        setMediaList([...mediaList, result.assets[0].uri]);
      }
    } catch (error) {
      console.error('Camera Error:', error);
    }
  };

  const onPickGalleryMedia = async () => {
    const result = await launchImageLibrary({mediaType: 'mixed'});
    if (!result.didCancel) {
      setMediaList([...mediaList, result.assets[0].uri]);
    }
  };

  const renderMediaItem = ({item, index}) => {
    return (
      <TouchableOpacity onPress={() => toggleModal(index)}>
        {item.endsWith('.mp4') ? (
          <View style={styles.mediaContainer}>
            <Image style={styles.media} source={{uri: item}} />
          </View>
        ) : (
          <Image style={styles.media} source={{uri: item}} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, {backgroundColor: 'black'}]}>
      <StatusBar backgroundColor="black" />
      <Text style={styles.title}>Let's Capture your Moments</Text>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={onPickCameraMedia}>
          <Icon
            name={'camera-plus'}
            color="#ffffff"
            size={45}
            marginRight={30}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={onPickGalleryMedia}>
          <Icon
            name={'image-search'}
            color="#ffffff"
            size={45}
            marginLeft={30}
          />
        </TouchableOpacity>
      </View>
      <FlatList
        data={mediaList}
        renderItem={renderMediaItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.flatListContainer}
      />
      <Modal
        animationType="slide"
        transparent={false}
        visible={isModalVisible}
        onRequestClose={() => toggleModal(null)}>
        <View style={styles.modalContent}>
          <Swiper
            showsPagination={true}
            index={selectedMediaIndex}
            loop={false}>
            {mediaList.map((media, index) => (
              <View key={index} style={styles.slide}>
                {media.endsWith('.mp4') ? (
                  <VideoPlayer
                    source={{uri: media}}
                    style={styles.fullScreenVideo}
                    paused={!isVideoPlayingList[index]}
                    onPlay={() => toggleVideoPlay(index)}
                    onEnd={() => toggleVideoPlay(index)}
                    controls={true}
                    resizeMode="contain"
                    onBack={() => {
                      setIsModalVisible(false);
                    }}
                  />
                ) : (
                  <ImageViewer
                    style={styles.fullScreenImage}
                    imageUrls={mediaList.map(uri => ({url: uri}))}
                    index={selectedMediaIndex}
                    enableSwipeDown={false}
                    saveToLocalByLongPress={false}
                    renderIndicator={() => null}
                    onChange={index => setSelectedMediaIndex(index)}
                    onSwipeDown={() => setIsModalVisible(false)}
                  />
                )}
              </View>
            ))}
          </Swiper>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    color: '#ffffff',
    marginBottom: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  media: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginHorizontal: 5,
    marginVertical: 10,
  },
  flatListContainer: {
    alignItems: 'center',
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaContainer: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginHorizontal: 5,
    marginVertical: 10,
    overflow: 'hidden',
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    resizeMode: 'contain',
  },
  fullScreenVideo: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
