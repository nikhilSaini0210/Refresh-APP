import {Button, StyleSheet, Text, View} from 'react-native';
import React, {FC} from 'react';
import {useAuth} from '@state/useAuth';
import {displayNotification} from '@notification/notificationInitial';
import {noti_Action} from '@notification/notificationContants';

const Profile: FC = () => {
  const {signOut, user} = useAuth();
  console.log(user);

  const logOut = async () => {
    user?.providerId &&
    signOut(user.providerId as 'facebook.com' | 'google.com')
    // await displayNotification(
    //   'Sign out',
    //   'You have been signed out',
    //   user?.photoURL || require('@assets/images/user.png'),
    //   noti_Action.LIKE_POST,
    // );
  };

  return (
    <View style={styles.container}>
      <Text>Profile</Text>
      <Button title="logout" onPress={logOut} />
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
