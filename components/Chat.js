import React, {Component} from "react";
import { View, Text, Platform } from "react-native";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
const firebase = require("firebase");
require("firebase/firestore");

export default class Chat extends React.Component {
  // The application’s main Chat component that renders the chat UI
  constructor(props) {
    super(props);
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: "AIzaSyDNjTKM77rlnWU97EgpMSVFhWJLsNWsAag",
        authDomain: "chat-app-midj.firebaseapp.com",
        databaseURL: "https://chat-app-midj.firebaseio.com",
        projectId: "chat-app-midj",
        storageBucket: "chat-app-midj.appspot.com",
        messagingSenderId: "845000414486",
      }); 
    }

    //Read all documents in the shopping lists collection
    this.referenceShoppingLists = firebase
      .firestore()
      .collection("messagesdb");

      

    //default state
    this.state = {
      messages: [],
      uid: '',
      loggedInText: ''
      
    };
  }
  componentDidMount() {
    let name = this.props.route.params.name;

    this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        async => firebase.auth().signInAnonymously();
      }

      //update user state with currently active user data
      this.setState({
        uid: user.uid,
        loggedInText: 'Hello there',
      });
    });
    
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