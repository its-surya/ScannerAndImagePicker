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

export default function ImageSlider() {
  const [imageList, setImageList] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        // Detect horizontal swipe gesture
        if (!isModalVisible) return;

        if (Math.abs(gestureState.dx) > Math.abs(gestureState.dy)) {
          if (gestureState.dx > 50) {
            // Swiped right
            if (selectedImageIndex > 0) {
              setSelectedImageIndex(selectedImageIndex - 1);
            }
          } else if (gestureState.dx < -50) {
            // Swiped left
            if (selectedImageIndex < imageList.length - 1) {
              setSelectedImageIndex(selectedImageIndex + 1);
            }
          }
        }
      },
      onPanResponderRelease: () => {},
    }),
  ).current;

  const onPickCameraImage = async () => {
    try {
      const result = await launchCamera({mediaType: 'photo'});
      if (result && !result.didCancel) {
        setImageList(prevImageList => [...prevImageList, result.assets[0].uri]);
      }
    } catch (error) {
      console.error('Camera Error:', error);
    }
  };

  const onPickGalleryImage = async () => {
    const result = await launchImageLibrary();
    if (!result.didCancel) {
      setImageList(prevImageList => [...prevImageList, result.assets[0].uri]);
    }
  };

  const toggleModal = index => {
    setSelectedImageIndex(index);
    setIsModalVisible(!isModalVisible);
  };

  const renderImageItem = ({item, index}) => {
    return (
      <TouchableOpacity onPress={() => toggleModal(index)}>
        <Image style={styles.image} source={{uri: item}} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <Text style={styles.title}>Select an Image</Text>
        <View style={styles.buttonContainer}>
          <View style={{marginBottom: 10}}>
            <Button
              onPress={onPickCameraImage}
              title="Pick Image from Camera"
              color="#4255e5"
            />
          </View>
          <Button
            onPress={onPickGalleryImage}
            title="Pick Image from Gallery"
            color="#4dbd91"
          />
        </View>
      </View>
      <FlatList
        data={imageList}
        renderItem={renderImageItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal={true}
        contentContainerStyle={styles.flatListContainer}
      />
      <Modal
        animationType="slide"
        transparent={false}
        visible={isModalVisible}
        onRequestClose={() => toggleModal(null)}>
        <View style={styles.modalContent} {...panResponder.panHandlers}>
          <Image
            style={styles.fullScreenImage}
            source={{uri: imageList[selectedImageIndex]}}
          />
        </View>
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
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  flatListContainer: {
    alignItems: 'center',
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    resizeMode: 'contain',
  },
});
