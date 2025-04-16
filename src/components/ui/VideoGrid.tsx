import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {FC} from 'react';
import {Post} from '@service/post.service';

const width = Dimensions.get('window').width;
const ITEMWIDTH = width / 2 - 4;

interface Props {
  posts: Post[];
}

const VideoGrid: FC<Props> = ({posts}) => {
  return (
    <View style={styles.photoGrid}>
      {posts.map(post => (
        <TouchableOpacity
          key={post.id}
          style={styles.photoItem}
          onPress={() => {
            // Handle photo tap
            console.log('Photo tapped:', post.id);
          }}>
          <Image
            source={{uri: post.imageUrl}}
            style={styles.photoImage}
            resizeMode="cover"
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default VideoGrid;

const styles = StyleSheet.create({
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 2,
    paddingBottom: 60,
  },
  photoItem: {
    width: ITEMWIDTH,
    aspectRatio: 1,
    padding: 2,
  },
  photoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
});
