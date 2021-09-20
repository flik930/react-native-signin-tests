/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import appleAuth, {
  AppleButton
} from '@invertase/react-native-apple-authentication'

import config from './config.js'

import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  iosClientId: config.googleClientId
});

const axios = require('axios');
axios.defaults.baseURL = config.baseURL;

const AppleAuth = (props) => {
  const onAppleButtonPress = async () => {
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      const {
        identityToken,
      } = appleAuthRequestResponse;

      // identityToken generated
      if (identityToken) {
        axios.post('/users/sign-in-with-apple', 
          appleAuthRequestResponse
        ).then((res) => {
          console.log('res', res)
        }).catch((error) => {
          console.log('error', error)
        })
      } else {
        // no token, failed sign in
      }
    } catch (error) {
      console.log('error', error)
      if (error.code === appleAuth.Error.CANCELED) {
        // user cancelled Apple Sign-in
        alert('CANCELED')
      } else {
        // other unknown error
        alert('unknown error')
      }
    }
  }
 
  return (
    <AppleButton
      buttonStyle={AppleButton.Style.WHITE}
      buttonType={AppleButton.Type.SIGN_IN}
      style={styles.appleButton}
      onPress={() => onAppleButtonPress()}
    />
  );
}

const googleSignIn = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    axios.post('/users/sign-in-with-google', 
      userInfo
    ).then((res) => {
      console.log('res', res)
    }).catch((error) => {
      console.log('error', error)
    })
  } catch (error) {
    console.log('error', error)
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      // user cancelled the login flow
    } else if (error.code === statusCodes.IN_PROGRESS) {
      // operation (e.g. sign in) is in progress already
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      // play services not available or outdated
    } else {
      // some other error happened
    }
  }
};

const App: () => Node = () => {
  return (
    <SafeAreaView>
      <AppleAuth></AppleAuth>
      <GoogleSigninButton
        style={{ width: 192, height: 48 }}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={googleSignIn}/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  appleButton: {
    width: '100%',
    height: 45,
    shadowColor: '#555',
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 0,
      height: 3
    },
    marginVertical: 15,
  }
});

export default App;
