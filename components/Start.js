import React from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Button,
  ImageBackground,
  TouchableOpacity,
} from "react-native";

import "react-native-gesture-handler";

export default class Start extends React.Component { // The application’s Starting page component that welcomes the user and allows them to choose a color
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      userBackgroundColor: "",
    };
  }

  render() {

    const image = { uri: "https://i.ibb.co/KrrnVyY/startimage.png" };
    return (
      <View style={styles.container}>
        <ImageBackground source={image} style={styles.image}>
          <TextInput // User inputs username
            style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
            onChangeText={(name) => this.setState({ name })}
            value={this.state.text}
            placeholder="Pick a Username"
          />

          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <TouchableOpacity // First color selection
              onPress={(userBackgroundColor) =>
                this.setState({ userBackgroundColor: "#090C08" })
              }
              style={[styles.colorbox, styles.color1]}
            />

            <TouchableOpacity // Second color selection
              onPress={(userBackgroundColor) =>
                this.setState({ userBackgroundColor: "#474056" })
              }
              style={[styles.colorbox, styles.color2]}
            />

            <TouchableOpacity // Third color selection
              onPress={(userBackgroundColor) =>
                this.setState({ userBackgroundColor: "#8A95A5" })
              }
              style={[styles.colorbox, styles.color3]}
            />

            <TouchableOpacity // Fourth color selection
              onPress={(userBackgroundColor) =>
                this.setState({ userBackgroundColor: "#B9C6AE" })
              }
              style={[styles.colorbox, styles.color4]}
            />
          </View>

          <Button
            onPress={() =>
              this.props.navigation.navigate("Chat", { //Allows the state to flow to the chat component
                name: this.state.name,
                userBackgroundColor: this.state.userBackgroundColor,
              })
            }
            title="Start Chatting"
          />
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  text: {
    color: "grey",
    fontSize: 30,
    fontWeight: "bold",
  },
  colorbox: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  color1: {
    backgroundColor: "#090C08",
  },
  color2: {
    backgroundColor: "#474056",
  },
  color3: {
    backgroundColor: "#8A95A5",
  },
  color4: {
    backgroundColor: "#B9C6AE",
  },
});
