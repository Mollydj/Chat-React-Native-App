//chat orig
import React, { Component } from "react";
import { View, Text, Platform } from "react-native";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
const firebase = require("firebase");
require("firebase/firestore");

export default class Chat extends React.Component {
  // The application’s main Chat component that renders the chat UI

  constructor() {
    super();
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: "AIzaSyCwiEp27P3CiEB_p4KT9-KxvUb5axjW_WE",
        authDomain: "test-chatapp-midj.firebaseapp.com",
        databaseURL: "https://test-chatapp-midj.firebaseio.com",
        projectId: "test-chatapp-midj",
        storageBucket: "test-chatapp-midj.appspot.com",
        messagingSenderId: "987831814509",
      });
    }

    //Read all documents in the messages collection
    this.referenceMessages = firebase.firestore().collection("usermessages");

    //default state
    this.state = {
      messages: [],
      user: {
        _id: "",
        name: "",
        avatar: "",
      }
    };
  }

  componentDidMount() {
    this.unsubscribe = this.referenceMessages.onSnapshot(
      this.onCollectionUpdate
    );
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onCollectionUpdate = (querySnapshot) => {
    const messages = []; //go through each document
    querySnapshot.forEach((doc) => {
      //get the QueryDocumentShapshot's data
      const data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: new Date(),
        //  user: {
        //   _id: data.user._id,
        //   name: data.user.name,
        //   avatar: data.user.avatar,
        // }
      });
    });
    this.setState({
      messages,
    });
  };

  addMsg = () => {
    const message = this.state.messages[0];
    this.referenceMessages.add({
      _id: message._id,
      text: message.text,
     // uid: this.state.uid,
    });
  }

  onSend(messages = []) {
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        this.addMsg();
      }
    );
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
    console.log(this.state.messages)
    return (
      <View
        style={[
          {
            flex: 1,
            justifyContent: "center",
            backgroundColor: this.props.route.params.userBackgroundColor,
          },
        ]}
      >
        <GiftedChat //Componenet comes with its own props. Providing GC with messages and info about the usesr
          renderBubble={this.renderBubble.bind(this)} //Chat bubble
          messages={this.state.messages} //State messages will be deisplayed
          onSend={(messages) => this.onSend(messages)} //Whe user sends messages append this ID
          user={{
            _id: 0,
          }}
        />

        {/* Keyboard for android only */}
      </View>
    );
  }
}
