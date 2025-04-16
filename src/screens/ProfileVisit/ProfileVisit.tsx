import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {FC, useCallback, useEffect, useState} from 'react';
import CustomSafeAreaView from '@components/global/CustomSafeAreaView';
import {useRoute, RouteProp} from '@react-navigation/native';
import authService, {UserData} from '@service/auth.service';
import BackButton from '@components/ui/BackButton';
import ProfileContainer from './ProfileContainer';
import StatsContainer from './StatsContainer';
import ButtonContainer from './ButtonContainer';
import {navigate} from '@utils/NavigationUtils';
import {ROUTES} from '@navigation/Routes';
import {useAuth} from '@state/useAuth';
import postService, {Post} from '@service/post.service';
// import PhotoGrid from './PhotoGrid';
import CustomText from '@components/ui/CustomText';
import PhotoGrid from '@components/ui/PhotoGrid';

type ProfileVisitRouteParams = {
  params: {
    item: string;
  };
};

const ProfileVisit: FC = () => {
  const route = useRoute<RouteProp<ProfileVisitRouteParams, 'params'>>();
  const {item} = route?.params;
  const [userInfo, setUserInfo] = useState<UserData | null>(null);
  const [isFollow, setIsFollow] = useState(false);
  const {user, setIsUpdateUser} = useAuth();
  const [loadingUser, setLoadingUser] = useState<boolean>(false);
  const [visitUserPosts, setVisitUserPosts] = useState<Post[]>([]);

  const getVisitUser = useCallback(async (id: string) => {
    const visitUser = await authService.getUserById(id);
    if (visitUser) {
      setUserInfo(visitUser);
    }
  }, []);

  const onPressMessage = () => {
    if (userInfo) {
      const userData = {
        id: userInfo.id,
        displayName: userInfo.displayName,
        photoURL: userInfo.photoURL,
      };
      navigate(ROUTES.NEWMESAAGES, {item: userData});
    }
  };

  const handleFollow = async () => {
    setLoadingUser(true);
    try {
      if (user && userInfo) {
        const updatedUser = await authService.followUser(user.id, userInfo?.id);
        if (updatedUser) {
          setIsUpdateUser(true);
          await getVisitUser(userInfo.id);
        }
      }
    } catch (error) {
      console.error('Error following user:', error);
    } finally {
      setLoadingUser(false);
    }
  };

  const handleUnfollow = async () => {
    setLoadingUser(true);
    try {
      if (user && userInfo) {
        const updatedUser = await authService.unfollowUser(
          user.id,
          userInfo?.id,
        );
        if (updatedUser) {
          setIsUpdateUser(true);
          await getVisitUser(userInfo.id);
        }
      }
    } catch (error) {
      console.error('Error unfollowing user:', error);
    } finally {
      setLoadingUser(false);
    }
  };

  const handlePhotoPress = (post: Post) => {
    navigate(ROUTES.POST_DETAIL, {postData: {post, userInfo}});
  };

  const getVisitUserPost = useCallback(async (id: string) => {
    const posts = await postService.getPostsByUserId(id);
    if (posts) {
      setVisitUserPosts(posts);
    }
  }, []);

  useEffect(() => {
    if (item) {
      getVisitUser(item);
    }
  }, [getVisitUser, item]);

  useEffect(() => {
    if (userInfo && user) {
      setIsFollow(userInfo?.followers?.includes(user.id) ?? false);
    }
  }, [user, userInfo]);

  useEffect(() => {
    if (userInfo) {
      getVisitUserPost(userInfo?.id);
    }
  }, [getVisitUserPost, userInfo]);

  return (
    <CustomSafeAreaView>
      <View style={styles.container}>
        <BackButton />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.profileInfo}>
            <ProfileContainer
              name={userInfo?.displayName ?? 'User'}
              email={userInfo?.email ?? 'user@email.com'}
              image={userInfo?.photoURL}
            />
            <StatsContainer
              fansCount={userInfo?.followers?.length ?? 0}
              followingCount={userInfo?.following?.length ?? 0}
              postCount={visitUserPosts?.length ?? 0}
            />
            <ButtonContainer
              onMessage={onPressMessage}
              isFollow={isFollow}
              onPress={isFollow ? handleUnfollow : handleFollow}
              loading={loadingUser}
            />
            <View style={styles.tabContainer}>
              <TouchableOpacity style={[styles.tab, styles.activeTab]}>
                <CustomText>Photo</CustomText>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.marginTop}>
            <PhotoGrid posts={visitUserPosts} onPressPhoto={handlePhotoPress} />
          </View>
        </ScrollView>
      </View>
    </CustomSafeAreaView>
  );
};

export default ProfileVisit;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileInfo: {
    paddingHorizontal: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    paddingVertical: 12,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#F3A8CE',
  },
  marginTop: {
    marginTop: 10,
  }
});
