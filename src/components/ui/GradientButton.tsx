import {
  ActivityIndicator,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {FC} from 'react';
import CustomText from './CustomText';
import {Colors, Fonts, gradientColor} from '@utils/Constants';
import LinearGradient from 'react-native-linear-gradient';

interface ButtonProps {
  onPress: () => void;
  title: string;
  disabled: boolean;
  loading: boolean;
  icon?: any;
  textColor?: string;
  style?: any;
  iconB?: any;
}

const GradientButton: FC<ButtonProps> = ({
  onPress,
  title,
  disabled,
  loading,
  icon,
  textColor = Colors.text,
  style = {},
  iconB,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={styles.btnTouch}
      activeOpacity={0.8}>
      <LinearGradient
        style={[styles.btn]}
        colors={gradientColor}
        start={{x: 1, y: 1}}
        end={{x: 0, y: 1}}>
        {loading ? (
          <ActivityIndicator color={'#fff'} size="small" />
        ) : (
          <View style={[styles.buttonContent, style]}>
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

export default GradientButton;

const styles = StyleSheet.create({
  btn: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    padding: 18,
    width: '100%',
  },
  text: {},
  icon: {
    width: 24,
    height: 24,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15,
  },
  btnTouch: {
    width: '100%',
    height: '100%',
  },
});
