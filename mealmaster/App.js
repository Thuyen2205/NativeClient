import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import RootComponent from './src/views/index';
import { RecoilRoot } from 'recoil';
import { AppRegistry } from 'react-native';

const App = () => {
  return (
      <RootComponent />
  );
};

export default App;
