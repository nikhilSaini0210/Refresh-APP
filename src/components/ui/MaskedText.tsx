import {StyleSheet, TextStyle, ViewStyle} from 'react-native';
import React, {FC} from 'react';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';
import CustomText from './CustomText';
import {Fonts} from '@utils/Constants';

interface Props {
  title: string;
  gradientStyle?: ViewStyle | ViewStyle[];
  gradientColors?: string[];
  gradientStart?: {x: number; y: number};
  gradientEnd?: {x: number; y: number};
  fontFamily?: Fonts;
  fontSize?: number;
  numberOfLine?: number;
  textStyle?: TextStyle | TextStyle[]
}

const MaskedText: FC<Props> = ({
  title,
  gradientStyle,
  gradientColors = ['#F7B174', '#F3A8CE'],
  gradientStart = {x: 1, y: 1},
  gradientEnd = {x: 1, y: 0},
  fontFamily = Fonts.Regular,
  fontSize = 32,
  numberOfLine = 2,
  textStyle,
}) => {
  return (
    <MaskedView
      maskElement={
        <CustomText
          numberOfLine={numberOfLine}
          fontFamily={fontFamily}
          fontSize={fontSize}
          style={StyleSheet.flatten([styles.text, textStyle])}>
          {title}
        </CustomText>
      }>
      <LinearGradient
        colors={gradientColors}
        start={{x: gradientStart.x, y: gradientStart.y}}
        end={{x: gradientEnd.x, y: gradientEnd.y}}
        style={[styles.gradient, gradientStyle]}
      />
    </MaskedView>
  );
};

export default MaskedText;

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
  },
  gradient: {
    height: 40,
  },
});
