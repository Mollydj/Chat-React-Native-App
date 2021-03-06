import PropTypes from 'prop-types';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';

const firebase = require('firebase');

export default class CustomActions extends React.Component {

    /**
   * Requests permission to view the users photo gallery, if accepted the user can pick image from their photo gallery
   * @async
   * @function pickImage
   */
  pickImage = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    if (status === 'granted') {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'Images',
      }).catch((error) => console.log(error));
      if (!result.cancelled) {
        const imageUrl = await this.uploadImage(result.uri);
        this.props.onSend({ image: imageUrl });
      }
    }
  };

    /**
   * Requests permission to the users camera, if accepted the user can take a picture from their phone
   * @async
   * @function takePhoto
   */
  takePhoto = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);

    if (status === 'granted') {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: 'Images',
      }).catch((error) => console.log(error));

      if (!result.cancelled) {
        const imageUrl = await this.uploadImage(result.uri);
        this.props.onSend({ image: imageUrl });
      }
    }
  };

    /**
   * Requests permission to get the users location, if accepted the user can share their location
   * @async
   * @function getLocation
   */
  getLocation = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status === 'granted') {
      const result = await Location.getCurrentPositionAsync({});
      console.log(result);
      if (!result.cancelled) {
        const location = await Location.getCurrentPositionAsync({});
        console.log(location);
        this.props.onSend({
          location: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
        });
      }
    }
  };

    /**
   * Adds the image to the firebase database
   * @async
   * @function uploadImage
   * @returns {string} Image URL
   */
  uploadImage = async (uri) => {
    try {
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function (e) {
          console.log(e);
          reject(new TypeError('Network request failed'));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);
        xhr.send(null);
      });
      const uriParts = uri.split('/');
      const imageName = uriParts[uriParts.length - 1];

      const ref = firebase.storage().ref().child(`${imageName}`);
      const snapshot = await ref.put(blob);
      blob.close();
      const imageUrl = await snapshot.ref.getDownloadURL();
      return imageUrl;
    } catch (error) {
      console.log(error);
    }
  };

    /**
   * Adds the image to the firebase database
   * @function onActionPress
   * @returns {actionSheet}
   */ 
  onActionPress = () => {
    const options = [
      'Choose From Library',
      'Take Picture',
      'Send Location',
      'Cancel',
    ];
    const cancelButtonIndex = options.length - 1;
    this.context.actionSheet().showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            console.log('user wants to pick an image');
            return this.pickImage();
          case 1:
            console.log('user wants to take a picture');
            return this.takePhoto();
          case 2:
            console.log('user wants to get their location');
            return this.getLocation();
          default:
        }
      },
    );
  };

  render() {
    return (
      <TouchableOpacity
        style={[styles.container]}
        onPress={this.onActionPress}
        accessible={true}
        accessibilityLabel="More actions"
        accessibilityHint="Allows you to send an image or your geolocation"
      >
        <View style={[styles.wrapper, this.props.wrapperStyle]}>
          <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
});

CustomActions.contextTypes = {
  actionSheet: PropTypes.func,
};
