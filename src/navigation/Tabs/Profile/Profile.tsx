import {Button, StyleSheet, Text, View} from 'react-native';
import React, {FC} from 'react';
import {useAuth} from '@state/useAuth';

const Profile: FC = () => {
  const {signOut, user} = useAuth();
  console.log(user);
  return (
    <View style={styles.container}>
      <Text>Profile</Text>
      <Button
        title="logout"
        onPress={() =>
          user?.providerId &&
          signOut(user.providerId as 'facebook.com' | 'google.com')
        }
      />
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
