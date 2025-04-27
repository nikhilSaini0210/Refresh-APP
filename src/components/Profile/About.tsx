import {ScrollView, StyleSheet, View} from 'react-native';
import React, {FC} from 'react';
import IIcon from 'react-native-vector-icons/Ionicons';
import CustomText from '@components/ui/CustomText';
import {RFValue} from 'react-native-responsive-fontsize';
import {Colors, Fonts} from '@utils/Constants';
import {UserData} from '@service/auth.service';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {labels} from '@utils/DummyData';

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

      {about.labels && about.labels.length > 0 && (
        <View style={styles.aboutSection}>
          <View style={styles.aboutHeader}>
            <Icon name="label" size={20} color="#F7B174" />
            <CustomText
              style={styles.aboutTitle}
              fontSize={RFValue(12)}
              fontFamily={Fonts.SemiBold}>
              Labels
            </CustomText>
          </View>
          <ScrollView
            contentContainerStyle={styles.labelsContainer}
            scrollEnabled={false}>
            {about.labels.map((item, index) => (
              <View
                key={index}
                style={[
                  styles.label,
                  labels.AboutMe.includes(item)
                    ? styles.selectedLabel1
                    : labels.MyThing.includes(item)
                    ? styles.selectedLabel2
                    : labels.InviteMe.includes(item)
                    ? styles.selectedLabel3
                    : null,
                ]}>
                <CustomText
                  fontFamily={Fonts.Medium}
                  fontSize={RFValue(10)}
                  style={[styles.labelText]}>
                  {item}
                </CustomText>
              </View>
            ))}
          </ScrollView>
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
  labelsContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  label: {
    backgroundColor: '#EEEEEE',
    borderRadius: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    margin: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 7,
  },
  selectedLabel1: {
    backgroundColor: Colors.lightYellow,
  },
  selectedLabel2: {
    backgroundColor: Colors.lightBlue2,
  },
  selectedLabel3: {
    backgroundColor: Colors.lightPink2,
  },
  labelText: {
    color: '#000',
  },
});
