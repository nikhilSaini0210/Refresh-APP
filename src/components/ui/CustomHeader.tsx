import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import React, {FC} from 'react';
import {Colors, Fonts} from '@utils/Constants';
import CustomText from './CustomText';
import Icon from 'react-native-vector-icons/Ionicons';
import {goBack} from '@utils/NavigationUtils';

interface Props {
  title: string;
  secondTitle?: string;
  onPress?: () => void;
  titleColor?: string;
  secondTitleColor?: string;
  profileImage?: string;
  left?: boolean;
}

const CustomHeader: FC<Props> = ({
  title,
  secondTitle,
  onPress,
  titleColor,
  secondTitleColor,
  profileImage,
  left = false,
}) => {
  return (
    <SafeAreaView>
      <View style={[styles.flexRow, !left && styles.justify]}>
        {left && (
          <TouchableOpacity onPress={() => goBack()}>
            <Icon name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
        )}
        <View style={styles.titleContainer}>
          {profileImage ? (
            profileImage === 'User' ? (
              <Image
                source={require('@assets/images/user.png')}
                style={styles.profileImage}
                defaultSource={require('@assets/images/user.png')}
              />
            ) : (
              <Image
                source={{uri: profileImage}}
                style={styles.profileImage}
                defaultSource={require('@assets/images/user.png')}
              />
            )
          ) : null}
          <CustomText
            style={[styles.text, {color: titleColor}]}
            variant="h5"
            fontFamily={Fonts.SemiBold}>
            {title}
          </CustomText>
        </View>
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
    padding: 10,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderBottomWidth: 0.6,
    borderColor: Colors.border,
    paddingHorizontal: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    justifyContent: 'space-between',
    marginHorizontal: 10,
  },
  profileImage: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    marginRight: 8,
  },
  text: {
    textAlign: 'center',
  },
  justify: {
    justifyContent: 'space-between',
  },
});
