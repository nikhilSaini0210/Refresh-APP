import {Alert, Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {FC, useCallback, useState} from 'react';
import {useAuth} from '../../../state/useAuth';
// import {displayNotification} from '@notification/notificationInitial';
// import {noti_Action} from '@notification/notificationContants';
import CustomSafeAreaView from '../../../components/global/CustomSafeAreaView';
import CustomHeader from '../../../components/ui/CustomHeader';
import CustomButton from '../../../components/ui/CustomButton';
import {Asset} from 'react-native-image-picker';
import {selectFromGallery, takePhoto} from '../../../service/imagePicker';
import authService from '../../../service/auth.service';
import {CollectionsType} from '../../../service/config';
import {uploadToS3} from '../../../service/uploadToS3';
import ActivityLoaderModal from '../../../components/global/ActivityLoaderModal';
import CustomText from '../../../components/ui/CustomText';
import {Colors} from '../../../utils/Constants';
import {navigate} from '../../../utils/NavigationUtils';
import {ROUTES} from '../../../navigation/Routes';
import {useFocusEffect} from '@react-navigation/native';

const Profile: FC = () => {
  const {signOut, user, setIsUpdateUser} = useAuth();
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

  const onClickFollow = () => {
    navigate(ROUTES.FOLLOWERLIST);
  };

  useFocusEffect(
    useCallback(() => {
      setIsUpdateUser(true);
    }, [setIsUpdateUser]),
  );

  return (
    <CustomSafeAreaView>
      <View style={styles.container}>
        <CustomHeader
          title="Profile"
          secondTitle="Logout"
          secondTitleColor="blue"
          onPress={logOut}
        />
        <TouchableOpacity style={styles.profileButton}>
          {user ? (
            <Image
              source={{uri: image ? image : user.photoURL}}
              style={styles.profileImage}
            />
          ) : (
            <Image
              source={require('../../../assets/images/user.png')}
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
        <View style={styles.followContainer}>
          <TouchableOpacity onPress={onClickFollow}>
            <CustomText style={styles.followInfo}>
              Followers: {user?.followers?.length || 0}
            </CustomText>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity onPress={onClickFollow}>
            <CustomText style={styles.followInfo}>
              Following: {user?.following?.length || 0}
            </CustomText>
          </TouchableOpacity>
        </View>
        <View style={styles.userDetailsContainer}>
          <View style={styles.inner}>
            <View style={styles.detailRow}>
              <CustomText style={styles.detailLabel}>Name:</CustomText>
              <CustomText style={styles.detailValue}>
                {user?.displayName || 'Not set'}
              </CustomText>
            </View>
            <View style={styles.detailRow}>
              <CustomText style={styles.detailLabel}>Email:</CustomText>
              <CustomText style={styles.detailValue}>
                {user?.email || 'Not set'}
              </CustomText>
            </View>
            <View style={styles.detailRow}>
              <CustomText style={styles.detailLabel}>Gender:</CustomText>
              <CustomText style={styles.detailValue}>
                {user?.gender || 'Not set'}
              </CustomText>
            </View>
          </View>
        </View>
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
  followContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  followInfo: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    height: '60%',
    backgroundColor: Colors.disabled,
    width: 1.5,
    marginHorizontal: 10,
    alignSelf: 'center',
    marginTop: 10,
  },
  userDetailsContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  inner: {
    width: '70%',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '600',
    width: 100,
  },
  detailValue: {
    fontSize: 16,
    color: Colors.text,
    flex: 1,
  },
});
