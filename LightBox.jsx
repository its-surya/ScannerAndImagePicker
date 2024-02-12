import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
  PanResponder,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Lightbox from 'react-native-lightbox';

export default function ImageSlider() {
  const [imageList, setImageList] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

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

  const renderImageItem = ({item}) => {
    return (
      <TouchableOpacity onPress={() => setSelectedImageIndex(item.index)}>
        <Image style={styles.image} source={{uri: item.uri}} />
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
        data={imageList.map((uri, index) => ({uri, index}))}
        renderItem={renderImageItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal={true}
        contentContainerStyle={styles.flatListContainer}
      />
      <Lightbox
        activeProps={{
          style: styles.fullScreenImage,
        }}
        springConfig={{tension: 15, friction: 7}}
        swipeToDismiss={false}
        renderContent={() => (
          <Image
            style={styles.fullScreenImage}
            source={{uri: imageList[selectedImageIndex]}}
          />
        )}
        renderHeader={close => (
          <TouchableOpacity onPress={close}>
            <Text style={{color: 'white', fontSize: 16}}>Close</Text>
          </TouchableOpacity>
        )}
      />
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
  fullScreenImage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    resizeMode: 'contain',
  },
});
