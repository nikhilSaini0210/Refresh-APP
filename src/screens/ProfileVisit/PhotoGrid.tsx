import React, {FC} from 'react';
import {
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {Post} from '../../service/post.service';

interface Props {
  posts: Post[];
  onPressPhoto?: (post: Post) => void;
}

const {width} = Dimensions.get('window');
const PHOTO_SIZE = width / 3 - 2;

const PhotoGrid: FC<Props> = ({posts, onPressPhoto}) => {
  const renderItem = ({item}: {item: Post}) => (
    <TouchableOpacity
      style={styles.photoContainer}
      onPress={() => onPressPhoto?.(item)}>
      <Image source={{uri: item.imageUrl}} style={styles.photo} />
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={posts}
      renderItem={renderItem}
      numColumns={3}
      keyExtractor={item => item.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 1,
  },
  photoContainer: {
    margin: 1,
  },
  photo: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    backgroundColor: '#eee',
  },
});

export default PhotoGrid;
