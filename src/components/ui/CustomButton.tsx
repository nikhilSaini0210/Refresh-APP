import {
  ActivityIndicator,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {FC} from 'react';
import CustomText from './CustomText';
import {Colors, Fonts} from '@utils/Constants';

interface ButtonProps {
  onPress: () => void;
  title: string;
  disabled: boolean;
  loading: boolean;
  icon?: any;
  bgColor?: string;
  textColor?: string;
  style?: any;
}

const CustomButton: FC<ButtonProps> = ({
  onPress,
  title,
  disabled,
  loading,
  icon,
  bgColor = Colors.secondary,
  textColor = Colors.text,
  style = {},
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      style={[
        styles.btn,
        style,
        {
          backgroundColor: disabled ? Colors.disabled : bgColor,
        },
      ]}>
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <View style={styles.buttonContent}>
          {icon && <Image source={icon} style={styles.icon} />}
          <CustomText
            style={[styles.text, {color: textColor}]}
            variant="h4"
            fontFamily={Fonts.SemiBold}>
            {title}
          </CustomText>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  btn: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    padding: 15,
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
});
