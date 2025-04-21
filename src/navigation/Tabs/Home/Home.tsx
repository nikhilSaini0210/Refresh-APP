import {
  Alert,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {FC, useCallback, useState} from 'react';
import postService, {Like, Post} from '@service/post.service';
import ActivityLoaderModal from '@components/global/ActivityLoaderModal';
import CustomText from '@components/ui/CustomText';
import {Fonts} from '@utils/Constants';
import CustomHeader from '@components/ui/CustomHeader';
import {RFValue} from 'react-native-responsive-fontsize';
import {useAuth} from '@state/useAuth';
import {navigate, resetAndNavigate} from '@utils/NavigationUtils';
import {ROUTES} from '@navigation/Routes';
import {useFocusEffect} from '@react-navigation/native';
import authService, {UserData} from '@service/auth.service';
import Icon from 'react-native-vector-icons/Ionicons';
import {formatFirestoreTimestamp} from '@utils/DateUtils';
import RefreshMediaFeed from '@components/Posts/RefreshMediaFeed';
import {screenHeight, screenWidth} from '@utils/Scaling';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Props {
  onPressTab: (tab: any) => void;
}

const Home: FC<Props> = ({onPressTab}) => {
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<Post[] | []>([]);
  const {user} = useAuth();
  const [postUserData, setPostUserData] = useState<UserData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const onPressProfileImage = (postUser: UserData | undefined) => {
    if (postUser && user) {
      if (postUser.id === user.id) {
        onPressTab(4);
        return;
      }
    }
    if (postUser) {
      navigate(ROUTES.PROFILEVISIT, {item: postUser.id});
    } else {
      resetAndNavigate(ROUTES.ONBOARD_A);
    }
  };

  const getAllPosts = async () => {
    try {
      const res = await postService.getAllPosts();
      setPosts(res);
    } catch (error) {
      console.log('Error fetching posts:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onLike = async (item: Post) => {
    let likes = [] as Like[];

    if (user) {
      const existingLike = item?.likes?.find(like => like?.userId === user.id);
      if (existingLike) {
        likes = (item?.likes || []).filter(like => like.userId !== user.id);
      } else {
        likes = [...(item?.likes || []), {userId: user.id}];
      }
      const updatedPost = {
        ...item,
        likes,
      };
      await postService.updatePost(item.id, updatedPost);
      await getAllPosts();
    } else {
      Alert.alert('Login', 'Please login again.');
    }
  };

  const checkLikeStatus = (item: Post) => {
    if (user) {
      return item.likes?.some(like => like.userId === user.id);
    }
  };

  const onComment = (item: Post) => {
    navigate(ROUTES.COMMENTS, {postData: item});
  };

  const getPostUseerData = async () => {
    try {
      const users = await authService.getAllUsers();
      setPostUserData(users);
    } catch (error) {
      console.log('Error fetching users:', error);
    }
  };

  const handleViewableChange = ({viewableItems}: {viewableItems: any}) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  };

  const onRefresh = async () => {
    setRefreshing(false);
    await getAllPosts();
    await getPostUseerData();
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      getAllPosts();
      getPostUseerData();
    }, []),
  );

  return (
    <View style={styles.container}>
      <CustomHeader title="Refresh" />
      <FlatList
        showsVerticalScrollIndicator={false}
        data={posts}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        keyExtractor={item => item.id.toString()}
        onViewableItemsChanged={handleViewableChange}
        viewabilityConfig={{viewAreaCoveragePercentThreshold: 80}}
        contentContainerStyle={
          posts.length === 0 ? styles.flatListContainer : styles.flistContent
        }
        renderItem={({item, index}) => {
          const postUser = postUserData?.find(u => u.id === item.userId);
          return (
            <View style={styles.imageContainer}>
              <View style={styles.imageHeader}>
                <TouchableOpacity
                  onPress={() => onPressProfileImage(postUser)}
                  style={styles.userContent}>
                  {postUser && postUser?.photoURL ? (
                    <Image
                      style={styles.userImage}
                      source={{uri: postUser?.photoURL}}
                    />
                  ) : (
                    <Image
                      style={styles.userImage}
                      source={require('@assets/images/user.png')}
                    />
                  )}
                  {postUser && postUser?.displayName && (
                    <View style={styles.userInfo}>
                      <CustomText
                        fontSize={RFValue(16)}
                        fontFamily={Fonts.Medium}>
                        {postUser?.displayName}
                      </CustomText>
                      <CustomText
                        fontSize={RFValue(12)}
                        fontFamily={Fonts.Regular}
                        style={styles.timeText}>
                        {item?.createdAt
                          ? formatFirestoreTimestamp(item.createdAt)
                          : 'recently'}
                      </CustomText>
                    </View>
                  )}
                </TouchableOpacity>
                <TouchableOpacity>
                  <MIcon name="dots-vertical" color={'#000'} size={20} />
                </TouchableOpacity>
              </View>
              <CustomText
                style={styles.caption}
                fontFamily={Fonts.Medium}
                fontSize={RFValue(14)}>
                {item?.caption}
              </CustomText>
              {item?.isVideo ? (
                <RefreshMediaFeed
                  index={index}
                  item={item}
                  currentIndex={currentIndex}
                />
              ) : (
                <Image source={{uri: item?.imageUrl}} style={styles.image} />
              )}
              <View style={styles.lcContainer}>
                <TouchableOpacity
                  onPress={() => onLike(item)}
                  style={styles.actionButton}>
                  {checkLikeStatus(item) ? (
                    <Icon name={'heart'} size={24} color={'#FF3B30'} />
                  ) : (
                    <Icon name={'heart-outline'} size={24} color={'#333'} />
                  )}
                  <CustomText style={styles.actionText}>
                    {item.likes?.length || 0}
                  </CustomText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => onComment(item)}
                  style={styles.actionButton}>
                  <Icon name="chatbubble-outline" size={24} color="#333" />
                  <CustomText style={styles.actionText}>
                    {item.comments?.length || 0}
                  </CustomText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <MIcon name="share-outline" size={24} color="#333" />
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <CustomText fontFamily={Fonts.SemiBold} variant="h7">
              No Posts Available.
            </CustomText>
          </View>
        }
      />

      <ActivityLoaderModal visible={loading} />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatListContainer: {
    flex: 1,
  },
  flistContent: {
    paddingBottom: 80,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 15,
  },
  imageContainer: {
    width: screenWidth,
    alignSelf: 'center',
    backgroundColor: '#FFF',
    marginTop: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: screenHeight * 0.6,
    alignSelf: 'center',
    marginBottom: 20,
  },
  userContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 50,
  },
  userName: {
    marginLeft: 10,
  },
  caption: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  lcContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    height: 50,
    marginBottom: 10,
    alignItems: 'center',
  },
  btn: {
    flexDirection: 'row',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  actionText: {
    marginLeft: 6,
    fontSize: RFValue(14),
    color: '#333',
  },
  userInfo: {
    marginLeft: 12,
  },
  timeText: {
    color: '#666',
    marginTop: 2,
  },
});
