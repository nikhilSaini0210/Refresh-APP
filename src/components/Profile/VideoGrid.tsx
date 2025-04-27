import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {FC} from 'react';
import {Post} from '@service/post.service';
import Video from 'react-native-video';
import {screenWidth} from '@utils/Scaling';

const ITEMWIDTH = screenWidth / 2 - 4;

interface Props {
  posts: Post[];
  onPressVideo?: (post: Post) => void;
}

const VideoGrid: FC<Props> = ({posts, onPressVideo}) => {
  return (
    <View style={styles.photoGrid}>
      {posts.map(post =>
        post?.isVideo ? (
          <TouchableOpacity
            key={post.id}
            style={styles.photoItem}
            onPress={() => onPressVideo?.(post)}>
            <Video
              source={{uri: post.imageUrl}}
              style={styles.photoImage}
              resizeMode="cover"
              paused={true}
              muted={true}
            />
          </TouchableOpacity>
        ) : null,
      )}
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
  },
});
