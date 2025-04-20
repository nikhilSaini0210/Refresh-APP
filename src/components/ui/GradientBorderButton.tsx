import React, {FC} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import CustomText from './CustomText';
import { Fonts} from '@utils/Constants';
import GradientActivityIndicator from '@components/global/GradientActivityIndicator';

interface ButtonProps {
  onPress: () => void;
  title: string;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle | ViewStyle[];
  gradientColors?: string[];
}

const GradientBorderButton: FC<ButtonProps> = ({
  onPress,
  title,
  gradientColors = ['#ff7f50', '#ff4500'],
  disabled = false,
  loading = false,
  style,
}) => {
  return (
    <TouchableOpacity disabled={disabled} onPress={onPress} activeOpacity={0.8}>
      <LinearGradient
        colors={gradientColors}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={[styles.gradientBorder]}>
        <View style={[styles.innerContainer, style]}>
          {loading ? (
            <GradientActivityIndicator size={20} />
          ) : (
            <MaskedView
              maskElement={
                <CustomText
                  variant="h4"
                  fontFamily={Fonts.SemiBold}
                  style={styles.text}>
                  {title}
                </CustomText>
              }>
              <LinearGradient
                colors={gradientColors}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}>
                <CustomText
                  variant="h4"
                  fontFamily={Fonts.SemiBold}
                  style={styles.opacity}>
                  {title}
                </CustomText>
              </LinearGradient>
            </MaskedView>
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  gradientBorder: {
    borderRadius: 8,
    padding: 1.5,
    width: '100%',
  },
  innerContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 13,
    alignItems: 'center',
  },
  text: {color: 'black'},
  opacity: {
    opacity: 0,
  },
});

export default GradientBorderButton;
