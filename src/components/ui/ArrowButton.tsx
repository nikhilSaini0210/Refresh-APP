import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {FC} from 'react';
import {Colors, Fonts, Symbols} from '@utils/Constants';
import CustomText from './CustomText';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {RFValue} from 'react-native-responsive-fontsize';

interface Props {
  title: string;
  loading: boolean;
  price: number;
  onPress: () => void;
}

const ArrowButton: FC<Props> = ({title, loading, onPress, price}) => {
  const justifyContent = price !== 0 ? 'space-between' : 'center';
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={loading}
      onPress={onPress}
      style={[styles.btn, {justifyContent: justifyContent}]}>
      {price !== 0 && price && (
        <View>
          <CustomText
            variant="h7"
            fontFamily={Fonts.Medium}
            style={styles.text}>
            {Symbols.RS}
            {price + 34}.0
          </CustomText>
          <CustomText
            variant="h9"
            fontFamily={Fonts.Medium}
            style={styles.text}>
            TOTAL
          </CustomText>
        </View>
      )}
      <View style={styles.flexRow}>
        <CustomText variant="h8" fontFamily={Fonts.Medium} style={styles.text}>
          {title}
        </CustomText>
        {loading ? (
          <ActivityIndicator
            color={'white'}
            size={'small'}
            style={styles.marginHor}
          />
        ) : (
          <Icon name="arrow-right" color={'#fff'} size={RFValue(25)} />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ArrowButton;

const styles = StyleSheet.create({
  btn: {
    backgroundColor: Colors.secondary,
    padding: 10,
    borderRadius: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: 10,
    marginHorizontal: 15,
  },
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
  },
  marginHor: {
    marginHorizontal: 5,
  },
});
