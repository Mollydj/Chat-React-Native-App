import React, {Component} from "react";
import { View, Text, Platform } from "react-native";
import { GiftedChat, Bubble } from "react-native-gifted-chat";

//Only for android chat
import KeyboardSpacer from 'react-native-keyboard-spacer';

export default class Chat extends React.Component {
  // The application’s main Chat component that renders the chat UI

  state = {
    messages: [],
  };

  componentDidMount() {
    let name = this.props.route.params.name;
    this.setState({
      messages: [
        {
          _id: 1,
          text: "Hello developer",
          createdAt: new Date(),
          user: {
            _id: 2,
            name: "React Native",
            avatar: "https://placeimg.com/140/140/any",
          },
        },
        {
          _id: 2,
          text: this.props.route.params.name + " has entered the chat",
          createdAt: new Date(),
          system: true,
        },
      ],
    });
  }

  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#000",
          },
        }}
      />
    );
  }
  render() {

    return (
      <View style={[{ flex: 1, justifyContent: 'center', backgroundColor: this.props.route.params.userBackgroundColor }]}>
        <GiftedChat //Componenet comes with its own props. Providing GC with messages and info about the usesr
          renderBubble={this.renderBubble.bind(this)} //Chat bubble
          messages={this.state.messages} //State messages will be deisplayed
          onSend={(messages) => this.onSend(messages)} //Whe user sends messages append this ID
          user={{
            _id: 1,
          }}
        />

        {/* Keyboard for android only */}
      
      </View>
    );
  }
}
