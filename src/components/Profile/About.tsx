import {StyleSheet, View} from 'react-native';
import React, {FC} from 'react';
import IIcon from 'react-native-vector-icons/Ionicons';
import CustomText from '@components/ui/CustomText';
import {RFValue} from 'react-native-responsive-fontsize';
import {Fonts} from '@utils/Constants';
import {UserData} from '@service/auth.service';

interface Props {
  about: UserData;
}

const About: FC<Props> = ({about}) => {
  return (
    <View style={styles.aboutContainer}>
      {about?.bio && (
        <View style={styles.aboutSection}>
          <View style={styles.aboutHeader}>
            <IIcon name="person-outline" size={20} color="#F7B174" />
            <CustomText
              style={styles.aboutTitle}
              fontSize={RFValue(12)}
              fontFamily={Fonts.SemiBold}>
              Bio
            </CustomText>
          </View>
          <CustomText style={styles.aboutText} fontSize={RFValue(11)}>
            {about?.bio}
          </CustomText>
        </View>
      )}

      {about?.dob && (
        <View style={styles.aboutSection}>
          <View style={styles.aboutHeader}>
            <IIcon name="calendar" size={20} color="#F7B174" />
            <CustomText
              style={styles.aboutTitle}
              fontSize={RFValue(12)}
              fontFamily={Fonts.SemiBold}>
              DOB
            </CustomText>
          </View>
          <CustomText style={styles.aboutText} fontSize={RFValue(11)}>
            {about?.dob}
          </CustomText>
        </View>
      )}

      {about?.gender && (
        <View style={styles.aboutSection}>
          <View style={styles.aboutHeader}>
            {about?.gender === 'Female' ? (
              <IIcon name="female" size={20} color="#F7B174" />
            ) : (
              <IIcon name="male" size={20} color="#F7B174" />
            )}
            <CustomText
              style={styles.aboutTitle}
              fontSize={RFValue(12)}
              fontFamily={Fonts.SemiBold}>
              Gender
            </CustomText>
          </View>
          <CustomText style={styles.aboutText} fontSize={RFValue(11)}>
            {about?.gender}
          </CustomText>
        </View>
      )}

      {about?.work && (
        <View style={styles.aboutSection}>
          <View style={styles.aboutHeader}>
            <IIcon name="briefcase-outline" size={20} color="#F7B174" />
            <CustomText
              style={styles.aboutTitle}
              fontSize={RFValue(12)}
              fontFamily={Fonts.SemiBold}>
              Work
            </CustomText>
          </View>
          <CustomText fontSize={RFValue(11)} style={styles.aboutText}>
            {about?.work}
          </CustomText>
          {/* <CustomText fontSize={RFValue(10)} style={styles.aboutSubtext}>
          2020 - Present
        </CustomText> */}
        </View>
      )}

      {about?.education && (
        <View style={styles.aboutSection}>
          <View style={styles.aboutHeader}>
            <IIcon name="school-outline" size={20} color="#F7B174" />
            <CustomText
              style={styles.aboutTitle}
              fontSize={RFValue(12)}
              fontFamily={Fonts.SemiBold}>
              Education
            </CustomText>
          </View>
          <CustomText fontSize={RFValue(11)} style={styles.aboutText}>
            {about?.education}
          </CustomText>
        </View>
      )}

      {about.hometown && (
        <View style={styles.aboutSection}>
          <View style={styles.aboutHeader}>
            <IIcon name="home" size={20} color="#F7B174" />
            <CustomText
              style={styles.aboutTitle}
              fontSize={RFValue(12)}
              fontFamily={Fonts.SemiBold}>
              Hometown
            </CustomText>
          </View>
          <CustomText fontSize={RFValue(11)} style={styles.aboutText}>
            {about?.hometown}
          </CustomText>
        </View>
      )}
    </View>
  );
};

export default About;

const styles = StyleSheet.create({
  aboutContainer: {
    padding: 16,
  },
  aboutSection: {
    marginBottom: 24,
  },
  aboutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  aboutTitle: {
    marginLeft: 8,
    color: '#333',
  },
  aboutText: {
    color: '#444',
    lineHeight: 24,
  },
  aboutSubtext: {
    color: '#666',
    marginTop: 4,
  },
});
