import React from "react";
import { View, Text } from "react-native";

export default class Chat extends React.Component { // The application’s main Chat component that renders the chat UI 
  render() {
    let name = this.props.route.params.name; // OR ...
    // let { name } = this.props.route.params;
    let userBackgroundColor = this.props.route.params.userBackgroundColor;

    //    this.props.navigation.setOptions({ title: name });

    console.log(this.props.route.params.userBackgroundColor);
    return (
      <View style={{ flex: 1, backgroundColor: userBackgroundColor }}>
        <Text>Hi {name}, Welcome Back!</Text>
      </View>
    );
  }
}
