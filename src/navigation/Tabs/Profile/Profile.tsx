import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {FC, useCallback, useEffect, useState} from 'react';
import {useAuth} from '@state/useAuth';
import CustomHeader from '@components/ui/CustomHeader';
import ActivityLoaderModal from '@components/global/ActivityLoaderModal';
import CustomText from '@components/ui/CustomText';
import {Fonts} from '@utils/Constants';
import {navigate} from '@utils/NavigationUtils';
import {ROUTES} from '@navigation/Routes';
import {useFocusEffect} from '@react-navigation/native';
import {RFValue} from 'react-native-responsive-fontsize';
import postService, {Post} from '@service/post.service';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IIcon from 'react-native-vector-icons/Ionicons';
import PhotoGrid from '@components/Profile/PhotoGrid';
import {Gender, TabType} from './types';
import {customUser, tabs} from '@utils/DummyData';
import About from '@components/Profile/About';
import GenderAge from '@components/Profile/GenderAge';

const Profile: FC = () => {
  const {signOut, user, setIsUpdateUser} = useAuth();
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('Photo');

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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Photo':
        return <PhotoGrid posts={userPosts} onPressPhoto={handlePhotoPress} />;
      case 'About':
        return <About about={user || customUser} />;
      case 'Video':
        return (
          <View style={styles.emptyStateContainer}>
            <IIcon name="videocam-outline" size={48} color="#ccc" />
            <Text style={styles.emptyStateText}>No videos yet</Text>
          </View>
          // <VideoGrid posts={userPosts} />
        );
      case 'Favorite':
        return (
          <View style={styles.emptyStateContainer}>
            <IIcon name="heart-outline" size={48} color="#ccc" />
            <Text style={styles.emptyStateText}>No favorites yet</Text>
          </View>
        );
      default:
        return null;
    }
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
        contentContainerStyle={[
          activeTab === 'About' ? styles.aboutContent : styles.content,
        ]}>
        <View style={styles.profileSection}>
          {user ? (
            <Image source={{uri: user.photoURL}} style={styles.profileImage} />
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
              onPress={() => navigate(ROUTES.EDIT_PROFILE)}>
              <Icon name="edit-square" size={20} color="#F7B174" />
            </TouchableOpacity>
          </View>

          <GenderAge gender={user?.gender as Gender} age={user?.age || '18'} />

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
              onPress={() => setActiveTab(tab as TabType)}
              key={index}
              style={[styles.tab, tab === activeTab && styles.activeTab]}>
              <CustomText
                fontSize={RFValue(11)}
                fontFamily={tab === activeTab ? Fonts.SemiBold : Fonts.Regular}
                style={[
                  tab === activeTab ? styles.activeTabText : styles.tabText,
                ]}>
                {tab}
              </CustomText>
            </TouchableOpacity>
          ))}
        </View>

        {renderTabContent()}
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
  aboutContent: {
    paddingTop: 20,
    paddingBottom: 50,
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
  emptyStateContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
});
