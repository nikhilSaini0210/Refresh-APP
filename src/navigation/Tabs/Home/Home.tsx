import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {FC, useEffect, useState} from 'react';
import postService, {Like, Post} from '@service/post.service';
import ActivityLoaderModal from '@components/global/ActivityLoaderModal';
import CustomText from '@components/ui/CustomText';
import {Fonts} from '@utils/Constants';
import CustomHeader from '@components/ui/CustomHeader';
import {RFValue} from 'react-native-responsive-fontsize';
import {useAuth} from '@state/useAuth';
import {navigate} from '@utils/NavigationUtils';
import {ROUTES} from '@navigation/Routes';

const Home: FC = () => {
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<Post[] | []>([]);
  const {user} = useAuth();

  const getAllPosts = async () => {
    setLoading(true);
    try {
      const res = await postService.getAllPosts();
      setPosts(res);
    } catch (error) {
      console.log('Error fetching posts:', error);
    } finally {
      setLoading(false);
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
      // resetAndNavigate(ROUTES.ONBOARD_A);
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

  useEffect(() => {
    getAllPosts();
  }, []);

  return (
    <View style={styles.container}>
      <CustomHeader title="Refresh" />
      <FlatList
        showsVerticalScrollIndicator={false}
        data={posts}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={
          posts.length === 0 ? styles.flatListContainer : styles.flistContent
        }
        renderItem={({item}) => (
          <View style={styles.imageContainer}>
            <View style={styles.userContent}>
              <Image
                style={styles.userImage}
                source={require('@assets/images/user.png')}
              />
              <CustomText
                style={styles.userName}
                fontFamily={Fonts.Medium}
                fontSize={RFValue(14)}>
                {item.userName}
              </CustomText>
            </View>
            <CustomText
              style={styles.caption}
              fontFamily={Fonts.Medium}
              fontSize={RFValue(14)}>
              {item?.caption}
            </CustomText>
            <Image source={{uri: item.imageUrl}} style={styles.image} />
            <View style={styles.lcContainer}>
              <TouchableOpacity style={styles.btn} onPress={() => onLike(item)}>
                <CustomText
                  fontFamily={Fonts.Regular}
                  variant="h4"
                  style={styles.lcText}>
                  {item?.likes?.length ?? 0}
                </CustomText>
                {checkLikeStatus(item) ? (
                  <Image
                    source={require('@assets/images/heartred.png')}
                    style={[styles.lcIcon]}
                  />
                ) : (
                  <Image
                    source={require('@assets/images/heart.png')}
                    style={styles.lcIcon}
                  />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => onComment(item)}>
                <CustomText
                  fontFamily={Fonts.Regular}
                  variant="h4"
                  style={styles.lcText}>
                  {item.comments?.length ?? 0}
                </CustomText>
                <Image
                  source={require('@assets/images/comment.png')}
                  style={styles.lcIcon}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
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
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#FFF',
    marginVertical: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '90%',
    height: 120,
    alignSelf: 'center',
    borderRadius: 10,
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
    marginLeft: 15,
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
  lcIcon: {
    width: 24,
    height: 24,
  },
  lcText: {
    marginRight: 5,
    textAlign: 'center',
  },
});
