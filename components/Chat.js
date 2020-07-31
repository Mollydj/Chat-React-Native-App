//chat orig
import React from "react";
import { View, Text, AsyncStorage } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
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
      isConnected: true,
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
    NetInfo.isConnected.fetch().then(isConnected => {
      this.setState({ isConnected: true });
      if (isConnected === true) {
        this.authUnsubscribe = firebase
          .auth()
          .onAuthStateChanged(async (user) => {
            if (!user) {
              await firebase.auth().signInAnonymously();
            } else {
              //update user state with currently active user data
              this.setState({
                uid: user.uid,
                loggedInText: "Hello there",
              });
              console.log("online");
            }
            this.unsubscribe = this.referenceMessages
              .orderBy("createdAt", "desc")
              .onSnapshot(this.onCollectionUpdate);
          });
      } else {
        console.log("offline");
        this.setState({ isConnected: false });
        this.getMsgs();
      }

    });


    NetInfo.isConnected.fetch().then(isConnected => {
      console.log('First, is ' + (isConnected ? 'online' : 'offline'));
    });


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
        user: data.user,
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
    });
  };



  async getMsgs() {
    let messages = "";
    try {
      messages = (await AsyncStorage.getItem("messages")) || [];
      this.setState({
        messages: JSON.parse(messages),
      });
    } catch (error) {
      console.log(error.message);
    }
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



  // async deleteMsgs() {
  //   try {
  //     await AsyncStorage.removeItem("messages");
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // }



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

  render() {
    //console.log(this.state.isConnected)
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
          renderInputToolbar={this.renderInputToolbar.bind(this)} //Hide if offline
          messages={this.state.messages} //State messages will be deisplayed
          onSend={(messages) => this.onSend(messages)} //Whe user sends messages append this ID
          user={{
            _id: this.state.uid,
          }}
        />
      </View>
    );
  }

 

}
