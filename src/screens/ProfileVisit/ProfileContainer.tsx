import {Image, StyleSheet, View} from 'react-native';
import React, {FC} from 'react';
import CustomText from '../../components/ui/CustomText';
import {RFValue} from 'react-native-responsive-fontsize';
import {Fonts} from '../../utils/Constants';

interface Props {
  name: string;
  image?: string;
  email: string;
}

const ProfileContainer: FC<Props> = ({name, email, image}) => {
  return (
    <View style={styles.prfileContainer}>
      {image ? (
        <Image source={{uri: image}} style={styles.avatar} />
      ) : (
        <Image
          source={require('../../assets/images/user.png')}
          style={styles.avatar}
        />
      )}
      <View style={styles.userInfo}>
        <CustomText
          style={styles.name}
          fontSize={RFValue(16)}
          fontFamily={Fonts.Medium}>
          {name}
        </CustomText>
        <CustomText
          style={styles.location}
          fontSize={RFValue(12)}
          fontFamily={Fonts.Regular}>
          {email}
        </CustomText>
      </View>
    </View>
  );
};

export default ProfileContainer;

const styles = StyleSheet.create({
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 50,
    marginBottom: 12,
  },
  prfileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  userInfo: {
    marginLeft: 15,
  },
  name: {
    marginBottom: 4,
  },
  location: {
    color: '#666',
    marginBottom: 24,
  },
});
