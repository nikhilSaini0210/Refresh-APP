import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import React, {FC} from 'react';
import CustomText from '@components/ui/CustomText';
import {Colors, Fonts} from '@utils/Constants';

interface Props {
  title: string;
  onPress: () => void;
  icon: any;
}

const CameraAndImageOpenButton: FC<Props> = ({title, onPress, icon}) => {
  return (
    <TouchableOpacity style={styles.btn} onPress={onPress}>
      <Image style={styles.img} source={icon} />
      <CustomText style={styles.text} fontFamily={Fonts.Medium} variant="h5">
        {title}
      </CustomText>
    </TouchableOpacity>
  );
};

export default CameraAndImageOpenButton;

const styles = StyleSheet.create({
  btn: {
    width: '100%',
    height: 50,
    borderBottomColor: '#8E8E8E',
    borderBottomWidth: 0.2,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
  },
  img: {
    width: 24,
    height: 24,
    marginLeft: 20,
  },
  text: {
    color: Colors.text,
    marginLeft: 20,
  },
});
