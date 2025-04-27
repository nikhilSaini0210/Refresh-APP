import React, {FC, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Video from 'react-native-video';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {Post} from '@service/post.service';
import {screenHeight, screenWidth} from '@utils/Scaling';
import Icon from 'react-native-vector-icons/Ionicons';

interface Props {
  item: Post;
  index: number;
  currentIndex: number;
}

const RefreshMediaFeed: FC<Props> = ({item, index, currentIndex}) => {
  const [pausedVideos, setPausedVideos] = useState<{[key: number]: boolean}>(
    {},
  );
  const videoRefs = useRef<{[key: string]: any}>({});
  const isBuffering = useSharedValue(false);
  const [muted, setMuted] = useState(true);

  const handleTogglePause = (idx: number) => {
    setPausedVideos(prev => ({...prev, [idx]: !prev[idx]}));
  };

  const handleBuffer = (buffering: boolean) => {
    isBuffering.value = buffering;
  };

  const toggleMute = () => {
    setMuted(prev => !prev);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isBuffering.value ? 1 : 0, {duration: 200}),
  }));

  const isActive = index === currentIndex;
  const isPaused = pausedVideos[index] || false;

  return (
    <View style={styles.mediaContainer}>
      <TouchableOpacity
        style={styles.mediaTouchable}
        onPress={() => handleTogglePause(index)}>
        <Video
          ref={ref => {
            if (ref) {
              videoRefs.current[index] = ref;
            }
          }}
          source={{uri: item.imageUrl}}
          style={styles.media}
          resizeMode="cover"
          paused={!isActive || isPaused}
          repeat
          muted={muted}
          onLoad={() => (isBuffering.value = false)}
          onBuffer={({isBuffering: buffering}) => handleBuffer(buffering)}
        />
        {isPaused && (
          <View style={styles.overlay}>
            <Icon name="play" color={'#FFF'} size={24} />
          </View>
        )}
        <Animated.View style={[styles.loaderContainer, animatedStyle]}>
          <ActivityIndicator size="large" color="#FFF" />
        </Animated.View>
        <TouchableOpacity style={styles.muteButton} onPress={toggleMute}>
          <Icon
            name={muted ? 'volume-mute' : 'volume-high'}
            size={18}
            color="#FFF"
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  mediaContainer: {
    width: screenWidth,
    height: screenHeight * 0.6,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  mediaTouchable: {
    width: '100%',
    height: '100%',
  },
  media: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    width: 50,
    height: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    top: '50%',
    left: '50%',
    transform: [{translateX: -25}, {translateY: -25}],
  },
  loaderContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
    top: '50%',
    left: '50%',
    transform: [{translateX: -25}, {translateY: -25}],
  },
  muteButton: {
    position: 'absolute',
    bottom: '2%',
    right: '2%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RefreshMediaFeed;
