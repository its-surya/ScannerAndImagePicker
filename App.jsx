import React, {useState, useCallback} from 'react';
import {
  StyleSheet,
  Image,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Button,
  Linking,
  Video,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';

let FileViewer, openFile;
FileViewer = require('react-native-file-viewer').default;

const App = () => {
  const [fileResponse, setFileResponse] = useState([]);

  const handleDocumentSelection = useCallback(async () => {
    try {
      const response = await DocumentPicker.pick({
        presentationStyle: 'fullScreen',
      });
      setFileResponse(response);
    } catch (err) {
      console.warn(err);
    }
  }, []);

  const handleOpenFile = async file => {
    try {
      if (Platform.OS === 'android' && FileViewer) {
        await FileViewer.open(file.uri, {
          showOpenWithDialog: true,
        });
      } else if (Platform.OS === 'ios' && openFile) {
        await openFile({url: file.uri});
      }
    } catch (error) {
      console.warn(error);
    }
  };

  const renderDocumentItem = (file, index) => {
    if (file.type && file.type.startsWith('image/')) {
      return (
        <TouchableOpacity
          key={index.toString()}
          style={styles.imageContainer}
          onPress={() => handleOpenFile(file)}>
          <Image
            source={{uri: file?.uri}}
            style={styles.image}
            resizeMode="cover"
          />
          <Text style={styles.documentText}>{file.name}</Text>
        </TouchableOpacity>
      );
    } else if (file.type && file.type.startsWith('VID/')) {
      return (
        <TouchableOpacity
          key={index.toString()}
          style={styles.videoContainer}
          onPress={() => handleOpenFile(file)}>
          <Video
            source={{uri: file.uri}}
            style={styles.video}
            resizeMode="cover"
            controls={true}
          />
          <Text style={styles.documentText}>{file.name}</Text>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          key={index.toString()}
          style={styles.documentContainer}
          onPress={() => handleOpenFile(file)}>
          <Text style={styles.documentText}>{file.name}</Text>
        </TouchableOpacity>
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'dark-content'} />
      {fileResponse.map((file, index) => renderDocumentItem(file, index))}
      <Button title="Upload file" onPress={handleDocumentSelection} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: 100,
    height: 150,
    margin: 5,
    borderRadius: 5,
    overflow: 'hidden',
  },
  image: {
    flex: 1,
    width: '100%',
  },
  documentContainer: {
    margin: 10,
  },
  documentText: {
    fontSize: 16,
    textAlign: 'center',
  },
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default App;
