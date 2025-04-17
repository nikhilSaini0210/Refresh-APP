import {StyleSheet, View} from 'react-native';
import React, {FC} from 'react';
import IIcon from 'react-native-vector-icons/Ionicons';
import CustomText from '@components/ui/CustomText';
import {RFValue} from 'react-native-responsive-fontsize';
import {Colors, Fonts} from '@utils/Constants';
import {Gender} from '@navigation/Tabs/Profile/types';

interface Props {
  gender: Gender;
  age: string;
}

const GenderAge: FC<Props> = ({gender, age}) => {
  let bgColor;
  let icon;
  let textColor;
  let iconColor;

  switch (gender) {
    case 'Male':
      bgColor = Colors.lighBlue;
      icon = 'male';
      textColor = Colors.blue;
      iconColor = Colors.blue;
      break;
    case 'Female':
      bgColor = Colors.lightPink;
      icon = 'female';
      textColor = Colors.pink;
      iconColor = Colors.pink;
      break;
    default:
      bgColor = Colors.lighBlue;
      icon = 'male';
      textColor = Colors.blue;
      iconColor = Colors.blue;
      break;
  }

  return (
    <View style={[styles.container, {backgroundColor: bgColor}]}>
      <IIcon name={icon} size={15} color={iconColor} />
      <CustomText
        style={{color: textColor}}
        fontSize={RFValue(12)}
        fontFamily={Fonts.Medium}>
        {age}
      </CustomText>
    </View>
  );
};

export default GenderAge;

const styles = StyleSheet.create({
  container: {
    borderRadius: 3,
    gap: 5,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 4,
    paddingVertical: 4,
    marginBottom: 5,
    marginTop: -3,
  },
});
