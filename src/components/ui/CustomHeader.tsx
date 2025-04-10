import {Pressable, SafeAreaView, StyleSheet, View} from 'react-native';
import React, {FC} from 'react';
import {Colors, Fonts} from '@utils/Constants';
import CustomText from './CustomText';

interface Props {
  title: string;
  secondTitle?: string;
  onPress?: () => void;
  titleColor?: string;
  secondTitleColor?: string;
}

const CustomHeader: FC<Props> = ({
  title,
  secondTitle,
  onPress,
  titleColor,
  secondTitleColor,
}) => {
  return (
    <SafeAreaView>
      <View style={styles.flexRow}>
        <CustomText
          style={[styles.text, {color: titleColor}]}
          variant="h5"
          fontFamily={Fonts.SemiBold}>
          {title}
        </CustomText>
        <View>
          {secondTitle && (
            <Pressable onPress={onPress}>
              <CustomText
                style={[styles.text, {color: secondTitleColor}]}
                variant="h5"
                fontFamily={Fonts.SemiBold}>
                {secondTitle}
              </CustomText>
            </Pressable>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  flexRow: {
    justifyContent: 'space-between',
    padding: 10,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomWidth: 0.6,
    borderColor: Colors.border,
    paddingHorizontal: 20,
  },
  text: {
    textAlign: 'center',
  },
});
