import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import React, {FC} from 'react';
import CustomText from './CustomText';
import {Colors, Fonts, gradientColor} from '@utils/Constants';
import LinearGradient from 'react-native-linear-gradient';
import GradientActivityIndicator from '@components/global/GradientActivityIndicator';

interface ButtonProps {
  onPress: () => void;
  title: string;
  disabled?: boolean;
  loading?: boolean;
  icon?: any;
  textColor?: string;
  style?: ViewStyle | ViewStyle[];
  iconB?: any;
  gradientColors?: string[];
  activityGradientColors?: string[];
}

const MixedButton: FC<ButtonProps> = ({
  onPress,
  title,
  disabled,
  loading,
  icon,
  textColor = Colors.text,
  style = {},
  iconB,
  gradientColors = gradientColor,
  activityGradientColors = gradientColor,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={styles.btnTouch}
      activeOpacity={0.8}>
      <LinearGradient
        style={[styles.btn, style]}
        colors={gradientColors}
        start={{x: 1, y: 1}}
        end={{x: 0, y: 1}}>
        {loading ? (
          <GradientActivityIndicator size={20} gradientColors={activityGradientColors} />
        ) : (
          <View style={[styles.buttonContent]}>
            {icon && <Image source={icon} style={styles.icon} />}
            <CustomText
              style={[styles.text, {color: textColor}]}
              variant="h4"
              fontFamily={Fonts.SemiBold}>
              {title}
            </CustomText>
            {iconB && <Image source={iconB} style={styles.icon} />}
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default MixedButton;

const styles = StyleSheet.create({
  text: {},
  icon: {
    width: 20,
    height: 18,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  btnTouch: {
    width: '100%',
  },
  btn: {
    justifyContent: 'center',
    borderRadius: 50,
    padding: 18,
    width: '100%',
  },
});
