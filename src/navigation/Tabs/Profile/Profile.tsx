import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {FC, useCallback, useEffect, useState} from 'react';
import {useAuth} from '@state/useAuth';
// import {displayNotification} from '@notification/notificationInitial';
// import {noti_Action} from '@notification/notificationContants';
import CustomHeader from '@components/ui/CustomHeader';
import {Asset} from 'react-native-image-picker';
import {selectFromGallery, takePhoto} from '@service/imagePicker';
import authService from '@service/auth.service';
import {CollectionsType} from '@service/config';
import {uploadToS3} from '@service/uploadToS3';
import ActivityLoaderModal from '@components/global/ActivityLoaderModal';
import CustomText from '@components/ui/CustomText';
import {Fonts} from '@utils/Constants';
import {navigate} from '@utils/NavigationUtils';
import {ROUTES} from '@navigation/Routes';
import {useFocusEffect} from '@react-navigation/native';
import {RFValue} from 'react-native-responsive-fontsize';
import postService, {Post} from '@service/post.service';
import Icon from 'react-native-vector-icons/MaterialIcons';
import VideoGrid from '@components/ui/VideoGrid';
import PhotoGrid from '@components/ui/PhotoGrid';

const Profile: FC = () => {
  const {signOut, user, setIsUpdateUser} = useAuth();
  const [image, setImage] = useState<string | null>(null);
  const [selectTab, setSelectTab] = useState(0);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [imageData, setImageData] = useState<Asset | null>(null);
  const [imagePicked, setImagePicked] = useState(false);

  const tabs = ['Photo', 'Video', 'About', 'Favorite'];

  const logOut = async () => {
    setLoading(true);
    try {
      if (user) {
        await signOut(user.providerId as 'facebook.com' | 'google.com');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }

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

  const getUserPost = useCallback(async (id: string) => {
    const posts = await postService.getPostsByUserId(id);
    if (posts) {
      setUserPosts(posts);
    }
  }, []);

  const onClickFollow = () => {
    navigate(ROUTES.FOLLOWERLIST);
  };

  const handlePhotoPress = (post: Post) => {
    navigate(ROUTES.POST_DETAIL, {postData: {post, userInfo: user}});
  };

  useEffect(() => {
    if (user) {
      getUserPost(user?.id);
    }
  }, [getUserPost, user]);

  useFocusEffect(
    useCallback(() => {
      setIsUpdateUser(true);
    }, [setIsUpdateUser]),
  );

  return (
    <View style={styles.container}>
      <CustomHeader
        title="Profile"
        secondTitle="Logout"
        secondTitleColor="blue"
        onPress={logOut}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}>
        <View style={styles.profileSection}>
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

          <View style={styles.profileHeaderContainer}>
            <CustomText
              fontFamily={Fonts.SemiBold}
              fontSize={RFValue(20)}
              style={styles.name}>
              {user?.displayName ?? 'User'}
            </CustomText>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() =>
                imagePicked ? editProfile() : handleImageSelection('gallery')
              }>
              {imagePicked ? (
                <Icon name="save" size={20} color={'#F3A8CE'} />
              ) : (
                <Icon name="edit-square" size={20} color="#F7B174" />
              )}
            </TouchableOpacity>
          </View>

          <CustomText fontSize={RFValue(14)} style={styles.username}>
            {user?.email ?? 'user@email.com'}
          </CustomText>

          <View style={styles.statsContainer}>
            <TouchableOpacity onPress={onClickFollow}>
              <View style={styles.statItem}>
                <CustomText
                  fontSize={RFValue(16)}
                  fontFamily={Fonts.SemiBold}
                  style={styles.statValue}>
                  {user?.followers?.length ?? 0}
                </CustomText>
                <CustomText fontSize={RFValue(12)} style={styles.statLabel}>
                  Fans
                </CustomText>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClickFollow}>
              <View style={styles.statItem}>
                <CustomText
                  fontSize={RFValue(16)}
                  fontFamily={Fonts.SemiBold}
                  style={styles.statValue}>
                  {user?.following?.length ?? 0}
                </CustomText>
                <CustomText fontSize={RFValue(12)} style={styles.statLabel}>
                  Following
                </CustomText>
              </View>
            </TouchableOpacity>
            <View style={styles.statItem}>
              <CustomText
                fontSize={RFValue(16)}
                fontFamily={Fonts.SemiBold}
                style={styles.statValue}>
                {userPosts?.length ?? 0}
              </CustomText>
              <CustomText fontSize={RFValue(12)} style={styles.statLabel}>
                Posts
              </CustomText>
            </View>
          </View>
        </View>

        <View style={styles.tabsContainer}>
          {tabs.map((tab, index) => (
            <TouchableOpacity
              onPress={() => setSelectTab(index)}
              key={index}
              style={[styles.tab, index === selectTab && styles.activeTab]}>
              <CustomText
                fontSize={RFValue(11)}
                fontFamily={
                  index === selectTab ? Fonts.SemiBold : Fonts.Regular
                }
                style={[
                  index === selectTab ? styles.activeTabText : styles.tabText,
                ]}>
                {tab}
              </CustomText>
            </TouchableOpacity>
          ))}
        </View>

        {selectTab === 0 && (
          <PhotoGrid
            posts={userPosts}
            onPressPhoto={handlePhotoPress}
            // scrollEnabled={false}
          />
        )}

        {selectTab === 1 && <VideoGrid posts={userPosts} />}
      </ScrollView>
      <ActivityLoaderModal visible={loading} />
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    paddingVertical: 20,
  },
  profileSection: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    marginBottom: 4,
  },
  username: {
    color: '#666',
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    marginBottom: 4,
  },
  statLabel: {
    color: '#666',
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#6C5CE7',
  },
  tabText: {
    color: '#666',
  },
  activeTabText: {
    color: '#6C5CE7',
  },
  profileHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  editButton: {
    marginLeft: 12,
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
