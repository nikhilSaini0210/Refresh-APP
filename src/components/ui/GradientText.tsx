import React, {FC} from 'react';
import {StyleSheet, TextStyle, View, ViewStyle} from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';
import CustomText from './CustomText';
import {Fonts} from '@utils/Constants';
import {RFValue} from 'react-native-responsive-fontsize';

interface Props {
  titleA?: string;
  titleB: string;
  titleC?: string;
  containerStyle?: ViewStyle | ViewStyle[];
  titleStyleA?: TextStyle | TextStyle[];
  titleStyleB?: TextStyle | TextStyle[];
  titleStyleC?: TextStyle | TextStyle[];
  fontFamilyA?: Fonts;
  fontFamilyB?: Fonts;
  fontFamilyC?: Fonts;
  fontSizeA?: number;
  fontSizeB?: number;
  fontSizeC?: number;
}

const GradientText: FC<Props> = ({
  titleA,
  titleB,
  titleC,
  containerStyle,
  titleStyleA,
  titleStyleB,
  titleStyleC,
  fontFamilyA,
  fontFamilyB,
  fontFamilyC,
  fontSizeA,
  fontSizeB,
  fontSizeC,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {titleA && (
        <CustomText
          style={StyleSheet.flatten([styles.normalText, titleStyleA || {}])}
          fontFamily={fontFamilyA || Fonts.Regular}
          fontSize={fontSizeA || RFValue(23)}>
          {titleA}{' '}
        </CustomText>
      )}

      <MaskedView
        maskElement={
          <CustomText
            style={StyleSheet.flatten([
              styles.normalText,
              styles.textTrans,
              titleStyleB || {},
            ])}
            fontFamily={fontFamilyB || Fonts.SemiBold}
            fontSize={fontSizeB || RFValue(23)}>
            {titleB}
          </CustomText>
        }>
        <LinearGradient
          colors={['#F7B174', '#F3A8CE']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}>
          <CustomText
            style={StyleSheet.flatten([
              styles.normalText,
              styles.textTrans,
              styles.opacity,
              titleStyleB || {},
            ])}
            fontFamily={Fonts.SemiBold}
            fontSize={RFValue(23)}>
            {titleB}
          </CustomText>
        </LinearGradient>
      </MaskedView>
      {titleC && (
        <CustomText
          style={StyleSheet.flatten([styles.normalText, titleStyleC || {}])}
          fontFamily={fontFamilyC || Fonts.Regular}
          fontSize={fontSizeC || RFValue(23)}>
          {titleC}
        </CustomText>
      )}
    </View>
  );
};

export default GradientText;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  normalText: {
    color: '##000000B2',
    textAlign: 'center',
  },
  opacity: {
    opacity: 0,
  },
  textTrans: {
    textTransform: 'capitalize',
  },
});
