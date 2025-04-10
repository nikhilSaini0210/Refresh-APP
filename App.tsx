import Navigation from '@navigation/Navigation';
import {
  batteryOptimizationCheck,
  powerMangerCheck,
  requestPermission,
} from '@notification/notificationPermission';
import React, {useEffect} from 'react';
import {Platform, StatusBar} from 'react-native';
import '@notification/notificationListners';
import {setCategories} from '@notification/notificationInitial';

const App = () => {
  const permissionChecks = async () => {
    await requestPermission();
    await setCategories();
    if (Platform.OS === 'android') {
      await batteryOptimizationCheck();
      await powerMangerCheck();
    }
  };

  useEffect(() => {
    permissionChecks();
  }, []);

  return (
    <>
      <Navigation />
      {/* <StatusBar hidden={true} /> */}
    </>
  );
};

export default App;
