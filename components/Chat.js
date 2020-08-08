//chat orig
import React from "react";
import { View, Text, AsyncStorage, Button, Image, Audio } from "react-native";
//import NetInfo from 'react-native-netinfo'
import NetInfo from "@react-native-community/netinfo";
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import CustomActions from "./CustomActions";
import MapView from "react-native-maps";



const firebase = require("firebase");
require("firebase/firestore");



export default class Chat extends React.Component {
  // The application’s main Chat component that renders the chat UI

  constructor() {
    super();

    this.state = {
      messages: [],
      uid: "",
      user: {
        _id: "",
        name: "",
        avatar: "",
      },
      // isConnected: false,
       //image: null,
      // location: null,
    };

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
  }

  componentDidMount() {
    NetInfo.isConnected.fetch().then((isConnected) => {
      if (isConnected === true) {
        // console.log('First, is ' + (isConnected ? 'online' : 'offline'));
        // });

        this.authUnsubscribe = firebase
          .auth()
          .onAuthStateChanged(async (user) => {
            if (!user) {
              await firebase.auth().signInAnonymously();
            } //else {
            //update user state with currently active user data
            this.setState({
              user: {
                _id: user.uid,
              },
              loggedInText: "Hello there",
              isConnected: true,
            });
            //}
            console.log("online " + this.state.isConnected);
            this.unsubscribe = this.referenceMessages
              .orderBy("createdAt", "desc")
              .onSnapshot(this.onCollectionUpdate);
          });
      } else {
        this.setState({
          isConnected: false,
        });
        this.getMsgs();
        console.log("offline " + this.state.isConnected);
        s;
      }
    });
    console.log("__________________");
  }

  componentWillUnmount() {
    this.authUnsubscribe();
    this.unsubscribe();
  }

  onSend(messages = []) {
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        this.addMsg();
        this.saveMsgs();
      }
    );
  }

  onCollectionUpdate = (querySnapshot) => {
    const messages = []; //go through each document
    querySnapshot.forEach((doc) => {
      //get the QueryDocumentShapshot's data
      const data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name,
          avatar: data.user.avatar,
        },
        image: data.image || '',
        location: data.location || '',
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
      text: message.text || "",
      createdAt: message.createdAt,
      user: message.user,
      uid: this.state.uid,
      image: message.image || '',
      location: message.location || '',
    });
  };

  //Async Function

  async getMsgs() {
    let messages = "";
    try {
      messages = (await AsyncStorage.getItem("messages")) || [];
      this.setState({
        messages: JSON.parse(messages),
      });
    } catch (error) {}
  }

  async saveMsgs() {
    try {
      await AsyncStorage.setItem(
        "messages",
        JSON.stringify(this.state.messages)
      );
    } catch (error) {
      console.log(error.message);
    }
  }

  async deleteMsgs() {
    try {
      await AsyncStorage.removeItem("messages");
    } catch (error) {
      console.log(error.message);
    }
  }

  //UI related Functions
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#4C6475",
          },
        }}
      />
    );
  }

  renderInputToolbar(props) {
    if (this.state.isConnected == false) {
    } else {
      return <InputToolbar {...props} />;
    }
  }

  renderCustomActions = (props) => {
    return <CustomActions {...props} />;
  };

  renderCustomView(props) {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  }

  render() {
    console.log(this.state.messages[0])
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
        {this.state.image && (
          <Image
            source={{ uri: this.state.image.uri }}
            style={{ width: 200, height: 200 }}
          />
        )}

        {this.state.location && (
          <MapView
            style={{ width: 300, height: 200 }}
            region={{
              latitude: this.state.location.coords.latitude,
              longitude: this.state.location.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          />
        )}

        <GiftedChat //Componenet comes with its own props. Providing GC with messages and info about the usesr
          renderBubble={this.renderBubble.bind(this)} //Chat bubble
          renderInputToolbar={this.renderInputToolbar.bind(this)} //Hide if offline
          messages={this.state.messages} //State messages will be deisplayed
          //deleteMsgs={(messages) => this.deleteMsgs()}
          onSend={(messages) => this.onSend(messages)} //Whe user sends messages append this ID
          renderActions={this.renderCustomActions}
          renderCustomView={this.renderCustomView}
          image={this.state.image}
          user={{
            _id: this.state.uid,
          }}
        />
      </View>
    );
  }
}
