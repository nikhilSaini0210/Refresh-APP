import {StyleSheet, View} from 'react-native';
import React, {FC} from 'react';
import CustomText from '../../components/ui/CustomText';
import {Fonts} from '../../utils/Constants';
import {RFValue} from 'react-native-responsive-fontsize';

interface Props {
  fansCount: number;
  followingCount: number;
  postCount: number;
}

const StatsContainer: FC<Props> = ({fansCount, followingCount, postCount}) => {
  return (
    <View style={styles.statsContainer}>
      <View style={styles.statItem}>
        <CustomText fontFamily={Fonts.SemiBold} fontSize={RFValue(14)}>
          {fansCount}
        </CustomText>
        <CustomText style={styles.statLabel} fontSize={RFValue(10)}>
          Fans
        </CustomText>
      </View>
      <View style={styles.statItem}>
        <CustomText fontFamily={Fonts.SemiBold} fontSize={RFValue(14)}>
          {followingCount}
        </CustomText>
        <CustomText style={styles.statLabel} fontSize={RFValue(10)}>
          Following
        </CustomText>
      </View>
      <View style={styles.statItem}>
        <CustomText fontFamily={Fonts.SemiBold} fontSize={RFValue(14)}>
          {postCount}
        </CustomText>
        <CustomText style={styles.statLabel} fontSize={RFValue(10)}>
          Posts
        </CustomText>
      </View>
    </View>
  );
};

export default StatsContainer;

const styles = StyleSheet.create({
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    color: '#666',
  },
});
