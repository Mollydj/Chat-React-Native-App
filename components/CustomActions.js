import PropTypes from "prop-types";
import React, {Component} from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import * as Location from 'expo-location';
import MapView from 'react-native-maps';
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";


export default class CustomActions extends Component {

    constructor() {
        super();
      }

    //   service firebase.storage {
    //     match /b/{bucket}/o {
    //       match /{allPaths=**} {
    //         allow read, write: if request.auth != null;
    //       }
    //     }
    //   }

  // upload image to Storage with XMLHttpRequest


  uploadImage = async(uri) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        resolve(xhr.response);
      };
      xhr.onerror = function(e) {
        console.log(e);
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });

    const ref = firebase
      .storage()
      .ref()
      .child(this.state.image);
    
    const snapshot = await ref.put(blob);

    blob.close();

    return await snapshot.ref.getDownloadURL();
  }

  // upload image to Storage with fetch() and blob()
  uploadImageFetch = async(uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const ref = firebase
      .storage()
      .ref()
      .child("IMG_2226-Enhanced");
    
      const snapshot = await ref.put(blob);
    
    return await snapshot.ref.getDownloadURL();
  }

  pickImage = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    if (status === "granted") {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "Images",
      }).catch((error) => console.log(error));

      if (!result.cancelled) {
        this.setState({
          image: result,
        });
      }
    }
  };

  takePhoto = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);

    if (status === "granted") {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: "Images",
      }).catch((error) => console.log(error));

      if (!result.cancelled) {
        this.setState({
          image: result,
        });
      }
    }
  };

  recording = async () => {
        
    const recording = new Audio.Recording();
    
    try {
      await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await recording.startAsync();
      // You are now recording!
    } catch (error) {
      // An error occurred!
    }
  }
  
  getLocation = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if(status === 'granted') {
      let result = await Location.getCurrentPositionAsync({});
 
      if (result) {
        this.setState({
          location: result
        });
    }
    }
  }

  onActionsPress = () => {
    const options = [
      "Choose From Library",
      "Take Picture",
      "Send Location",
      "Cancel",
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
            this.pickImage();
            return;
          case 1:
            this.takePhoto();
            return;
          case 2:
            this.getLocation();
          default:
        }
      }
    );
  };

  render() {
    const response = await fetch(uri);
    const blob = await response.blob();

    var ref = firebase.storage().ref().child("IMG_2226-Enhanced");

    const snapshot = await ref.put(blob);

    await snapshot.ref.getDownloadURL();
    return (
      <TouchableOpacity
        style={[styles.container]}
        onPress={this.onActionsPress}
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
    borderColor: "#b2b2b2",
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: "#b2b2b2",
    fontWeight: "bold",
    fontSize: 16,
    backgroundColor: "transparent",
    textAlign: "center",
  },
});

CustomActions.contextTypes = {
  actionSheet: PropTypes.func,
};
