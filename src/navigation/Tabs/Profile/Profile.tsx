import {Alert, Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {FC, useState} from 'react';
import {useAuth} from '@state/useAuth';
import {displayNotification} from '@notification/notificationInitial';
import {noti_Action} from '@notification/notificationContants';
import CustomSafeAreaView from '@components/global/CustomSafeAreaView';
import CustomHeader from '@components/ui/CustomHeader';
import CustomButton from '@components/ui/CustomButton';
import {Asset} from 'react-native-image-picker';
import {selectFromGallery, takePhoto} from '@service/imagePicker';
import authService from '@service/auth.service';
import {CollectionsType} from '@service/config';
import {uploadToS3} from '@service/uploadToS3';
import ActivityLoaderModal from '@components/global/ActivityLoaderModal';

const Profile: FC = () => {
  const {signOut, user} = useAuth();
  const [image, setImage] = useState<string | null>(null);
  const [imageData, setImageData] = useState<Asset | null>(null);
  const [imagePicked, setImagePicked] = useState(false);
  const [loading, setLoading] = useState(false);

  const logOut = async () => {
    user?.providerId &&
      signOut(user.providerId as 'facebook.com' | 'google.com');
    // await displayNotification(
    //   'Sign out',
    //   'You have been signed out',
    //   user?.photoURL || require('@assets/images/user.png'),
    //   noti_Action.LIKE_POST,
    // );
  };

  const editProfile = async () => {
    setLoading(true);
    try {
      if (imageData && imageData.uri && user) {
        const imageUrl = await uploadToS3(
          imageData.uri,
          imageData.fileName,
          imageData.type,
        );
        const userData = {
          ...user,
          photoURL: imageUrl,
        };
        await authService.updateUserDataInFirestore(
          user?.id,
          userData,
          CollectionsType.Users,
        );
      } else {
        Alert.alert('Error', 'Please select profil image.');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setImagePicked(false);
    }
  };

  const handleImageSelection = async (type: 'camera' | 'gallery') => {
    setLoading(true);
    try {
      let selectedImage: Asset | null;

      if (type === 'camera') {
        selectedImage = await takePhoto();
      } else {
        selectedImage = await selectFromGallery();
      }

      if (selectedImage && selectedImage.uri) {
        setImage(selectedImage.uri);
        setImageData(selectedImage);
        setImagePicked(true);
      }
    } catch (error) {
      console.error('Error selecting image:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomSafeAreaView>
      <View style={styles.container}>
        <CustomHeader title="Profile" />
        <TouchableOpacity style={styles.profileButton}>
          {user ? (
            <Image
              source={{uri: image ? image : user.photoURL}}
              style={styles.profileImage}
            />
          ) : (
            <Image
              source={require('@assets/images/user.png')}
              style={styles.profileImage}
            />
          )}
        </TouchableOpacity>
        <CustomButton
          onPress={() =>
            imagePicked ? editProfile() : handleImageSelection('gallery')
          }
          title={imagePicked ? 'Save Profile' : 'Edit Profile'}
          loading={false}
          disabled={false}
          bgColor="transparent"
          style={styles.editButton}
          textColor="orange"
        />
        <ActivityLoaderModal visible={loading} />
      </View>
    </CustomSafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  editButton: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'orange',
    width: 200,
    alignSelf: 'center',
  },
});
