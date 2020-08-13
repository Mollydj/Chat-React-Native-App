import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Chat from './components/Chat';
import Start from './components/Start';

// Allows for multiple page views
import 'react-native-gesture-handler';

export default class HelloWorld extends Component {
  constructor() {
    super();
    this.state = { text: '' };
  }

  render() {
    const Stack = createStackNavigator();

    return (

      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Start"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Start" component={Start} />
          <Stack.Screen name="Chat" component={Chat} />
        </Stack.Navigator>
      </NavigationContainer>

    );
  }
}
