import {FlatList, Image, StyleSheet, View} from 'react-native';
import React, {FC, useEffect, useState} from 'react';
import postService, {Post} from '@service/post.service';
import ActivityLoaderModal from '@components/global/ActivityLoaderModal';
import CustomText from '@components/ui/CustomText';
import {Fonts} from '@utils/Constants';
import CustomHeader from '@components/ui/CustomHeader';
import {RFValue} from 'react-native-responsive-fontsize';

const Home: FC = () => {
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<Post[] | []>([]);

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
});
