import React from "react";
import { View, Text, Button } from "react-native";

export default class Screen1 extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Hello Chat</Text>
        <Button
          title="Go to Chat"
          onPress={() => this.props.navigation.navigate("Chat")}
        />
      </View>
      
    );
  }
}
