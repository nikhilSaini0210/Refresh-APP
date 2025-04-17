import {StyleSheet, View} from 'react-native';
import React, {FC} from 'react';
import IIcon from 'react-native-vector-icons/Ionicons';
import CustomText from '@components/ui/CustomText';
import {RFValue} from 'react-native-responsive-fontsize';
import {Fonts} from '@utils/Constants';

interface Props {}

const About: FC<Props> = () => {
  return (
    <View style={styles.aboutContainer}>
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
          Professional photographer and digital artist. Capturing moments and
          creating memories. Based in New York City 📍
        </CustomText>
      </View>

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
          02-10-1998
        </CustomText>
      </View>

      <View style={styles.aboutSection}>
        <View style={styles.aboutHeader}>
          <IIcon name="female" size={20} color="#F7B174" />
          <CustomText
            style={styles.aboutTitle}
            fontSize={RFValue(12)}
            fontFamily={Fonts.SemiBold}>
            Gender
          </CustomText>
        </View>
        <CustomText style={styles.aboutText} fontSize={RFValue(11)}>
          Female
        </CustomText>
      </View>

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
          Freelance Photographer at Studio71
        </CustomText>
        <CustomText fontSize={RFValue(10)} style={styles.aboutSubtext}>
          2020 - Present
        </CustomText>
      </View>

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
          Bachelor of Fine Arts in Photography
        </CustomText>
        <CustomText fontSize={RFValue(10)} style={styles.aboutSubtext}>
          New York University • 2016-2020
        </CustomText>
      </View>

      <View style={styles.aboutSection}>
        <View style={styles.aboutHeader}>
          <IIcon name="location-outline" size={20} color="#F7B174" />
          <CustomText
            style={styles.aboutTitle}
            fontSize={RFValue(12)}
            fontFamily={Fonts.SemiBold}>
            Location
          </CustomText>
        </View>
        <CustomText fontSize={RFValue(11)} style={styles.aboutText}>
          New York City, NY
        </CustomText>
      </View>
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
