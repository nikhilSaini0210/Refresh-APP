/**
 * @format
 */

import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import {ReadableStream} from 'web-streams-polyfill/dist/ponyfill.js';

if (typeof global.ReadableStream === 'undefined') {
  global.ReadableStream = ReadableStream;
}
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import {displayNotification} from '@notification/notificationInitial';

async function onMessageReceived(message) {
  const {title, imageUrl, description} = message.data;
  await displayNotification(title, description, imageUrl, 'fcm-message');
}

messaging().onMessage(onMessageReceived);
messaging().setBackgroundMessageHandler(onMessageReceived);

AppRegistry.registerComponent(appName, () => App);
