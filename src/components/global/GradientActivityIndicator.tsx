import { Colors } from '@utils/Constants';
import React, {useEffect, useRef} from 'react';
import {Animated, Easing, StyleSheet, View, ViewStyle} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface GradientActivityIndicatorProps {
  gradientColors?: string[];
  size?: number;
  style?: ViewStyle;
}

const GradientActivityIndicator: React.FC<GradientActivityIndicatorProps> = ({
  gradientColors = [Colors.gradientPink, Colors.gradientOrange],
  size = 50,
  style,
}) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, [rotateAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const outerSize = size;
  const innerSize = size * 0.8;

  return (
    <View style={[styles.container, style]}>
      <Animated.View
        style={[
          styles.spinner,
          {
            transform: [{rotate}],
            width: outerSize,
            height: outerSize,
            borderRadius: outerSize / 2,
          },
        ]}>
        <LinearGradient
          colors={gradientColors}
          start={{x: 0.3, y: 0}}
          end={{x: 1, y: 1}}
          style={[
            styles.gradient,
            {width: outerSize, height: outerSize, borderRadius: outerSize / 2},
          ]}>
          <View
            style={[
              styles.innerCircle,
              {
                width: innerSize,
                height: innerSize,
                borderRadius: innerSize / 2,
              },
            ]}
          />
        </LinearGradient>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinner: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    backgroundColor: '#fff',
  },
});

export default GradientActivityIndicator;
