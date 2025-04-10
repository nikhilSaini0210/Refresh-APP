import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import React, {FC} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {gradientColor, inActiveGradientColor} from '@utils/Constants';

interface TabItem {
  _id: number;
  title: string;
  icon: any;
}

interface Props {
  item: TabItem;
  onPress: () => void;
  selectedTab: number;
}

const TabButton: FC<Props> = ({item, onPress, selectedTab}) => {
  const tintColor = selectedTab === item._id ? '#FFF' : '#000';
  const colors =
    selectedTab === item._id ? gradientColor : inActiveGradientColor;

  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <LinearGradient
        colors={colors}
        start={{x: 1, y: 1}}
        end={{x: 0, y: 1}}
        style={styles.content}>
        <Image style={[styles.img, {tintColor}]} source={item.icon} />
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default TabButton;

const styles = StyleSheet.create({
  button: {
    width: '20%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#F2F2F2F2',
  },
  img: {
    width: 24,
    height: 24,
  },
});
