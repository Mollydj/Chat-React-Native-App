import React from "react";
import { View, AsyncStorage, Image } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import MapView from "react-native-maps";
import CustomActions from "./CustomActions";

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
      isConnected: "",
      // image: null,
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

    // Read all documents in the messages collection
    this.referenceMessages = firebase.firestore().collection("usermessages");
  }

  componentDidMount() {
    NetInfo.isConnected.fetch().then((isConnected) => {
      if (isConnected === true) {
        this.authUnsubscribe = firebase
          .auth()
          .onAuthStateChanged(async (user) => {
            if (!user) {
              await firebase.auth().signInAnonymously();
            } // update user state with currently active user data

            this.setState({
              user: {
                _id: user.uid,
                name: this.props.route.params.name,
                avatar: "https://placeimg.com/140/140/any",
              },
              loggedInText: "Hello there",
              isConnected: true,
            });
            this.unsubscribe = this.referenceMessages
              .orderBy("createdAt", "desc")
              .onSnapshot(this.onCollectionUpdate);
          });
      } else {
        this.setState({
          isConnected: false,
        });
        this.getMsgs();
      }
    });
  }

  componentWillUnmount() {
    this.authUnsubscribe();
    this.unsubscribe();
  }

  /**
   * Sends messages
   * @async
   * @function onSend
   * @param {string} messages
   * @return {state} Gifted Chat UI
   */
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


  /**
   * Updates stored messages in firebase database
   * @function onCollectionUpdate
   * @param {string} _id Unique Message ID
   * @param {string} text Message written by the user
   * @param {string} createdAt Timestamp of message
   * @param {string} user User data consisting of user ID, avatar, and Name entered on start screen
   * @param {string} image Image URL if applicable
   * @param {string} location Location coordinates if applicable
   * @return {object} All message data and pushes it to the messages state
   */
  onCollectionUpdate = (querySnapshot) => {
    const messages = []; // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentShapshot's data
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
        image: data.image || "",
        location: data.location || "",
      });
    });
    this.setState({
      messages,
    });
  };

  // Async Function

    /**
   * Get Messages from the current state When the user is offline
   * @async
   * @function getMsgs
   * @param {string} messages References messages from current state
   * @return {state} Messages
   */
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

    /**
   * Add Messages
   * @function addMsg
   * @param {string} message References the last sent message
   * @param {string} _id Message ID
   * @param {string} _text Message contents
   * @param {string} createdAt Message time stamp
   * @param {string} user User info 
   * @param {string} uid User Unique ID
   * @param {string} image  Image if applicable
   * @param {string} location Location coordinates if applicable
   * @return {object} All message data and adds it to the firestore database
   */
  addMsg = (message = this.state.messages[0]) => {
    this.referenceMessages.add({
      _id: message._id,
      text: message.text || "",
      createdAt: message.createdAt,
      user: message.user,
      uid: this.state.uid,
      image: message.image || "",
      location: message.location || "",
    });
  };

    /**
   * Saves Messages from the current state to the firestore database
   * @async
   * @function saveMsgs
   * @param {string} messages References messages from current state
   * @return {state} Saves the messages to the databse
   */
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

  /**
   * Deletes messages from AsyncStorage for development purposes
   * @async
   * @function deleteMessages
   * @param {string} messages
   * @return {AsyncStorage}
   */
  async deleteMsgs() {
    try {
      await AsyncStorage.removeItem("messages");
    } catch (error) {
      console.log(error.message);
    }
  }

  // UI related Functions

  /**
   * Renders text bubble UI from GiftedChat
   * @function renderBubble
   * @param {*} props
   * @returns {renderBubble}
   */
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

  /**
   * Renders input toolbar only if online
   * @function renderInputToolbar
   * @param {*} props
   * @returns {renderInputToolbar}
   */
  renderInputToolbar = (props) => {
    if (this.state.isConnected === false) {
    } else {
      return <InputToolbar {...props} />;
    }
  };

  /**
   * Renders custom actions giving the users options to Take an image, Choose and image, or send their location
   * @function renderCustomActions
   * @param {*} props
   * @returns {renderCustomActions}
   */
  renderCustomActions = (props) => {
    return <CustomActions {...props} />;
  };


  /**
   * Renders custom UI bubble for when the user sends their location
   * @function renderCustomView
   * @param {*} props
   * @returns {renderCustomView}
   */
  renderCustomView = (props) => {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{
            width: 150,
            height: 100,
            borderRadius: 13,
            margin: 3,
          }}
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
  };

  render() {
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

        <GiftedChat
          // Componenet comes with its own props. Providing GC with messages and info about the usesr
          renderBubble={this.renderBubble.bind(this)} // Chat bubble
          renderInputToolbar={this.renderInputToolbar.bind(this)} // Hide if offline
          renderActions={this.renderCustomActions}
          renderCustomView={this.renderCustomView}
          messages={this.state.messages} // State messages will be deisplayed
          onSend={(messages) => this.onSend(messages)} // Whe user sends messages append this ID
          user={this.state.user}
          showUserAvatar={true}
        />
      </View>
    );
  }
}
