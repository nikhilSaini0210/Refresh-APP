import React, {FC, useEffect, useRef} from 'react';
import {Animated, StyleSheet, View, ViewStyle} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface Props {
  progress: number;
  pre: number;
}

const ProgressBar: FC<Props> = ({progress, pre}) => {
  const animatedWidth = useRef(new Animated.Value(pre)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: progress,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [animatedWidth, progress]);

  const widthInterpolate = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.progressBar, {width: widthInterpolate}]}>
        <LinearGradient
          style={StyleSheet.absoluteFill as ViewStyle}
          colors={['#F3A8CE', '#F7B174']}
          start={{x: 1, y: 1}}
          end={{x: 0, y: 0}}
        />
      </Animated.View>
    </View>
  );
};

export default ProgressBar;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 5,
    borderRadius: 50,
    backgroundColor: '#78788029',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 50,
    overflow: 'hidden',
  },
});
