import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomSafeAreaView from '@components/global/CustomSafeAreaView';
import BackButton from '@components/ui/BackButton';
import CustomText from '@components/ui/CustomText';
import {Fonts} from '@utils/Constants';
import {RFValue} from 'react-native-responsive-fontsize';
import {navigate} from '@utils/NavigationUtils';
import {ROUTES} from '@navigation/Routes';
import GenderSelector from '@components/Profile/GenderSelector';
import {useFocusEffect} from '@react-navigation/native';
import DatePickerModal from '@components/Profile/DatePickerModal';

interface ProfileData {
  bio: string;
  avatar: string;
  name: string;
  birthday: string;
  gender: string;
  hometown: string;
  labels: string[];
}

const EditProfile = () => {
  const [profileData, setProfileData] = useState<ProfileData>({
    bio: 'हर हर महादेव ☀️',
    avatar: 'https://picsum.photos/200/200',
    name: 'निखिल♡✓',
    birthday: '01/01/1910',
    gender: 'Male',
    hometown: 'Noida',
    labels: [],
  });
  const [isGenderSelector, setIsGenderSelector] = useState(false);
  const [isBirthdaySelector, setIsBirthdaySelector] = useState(false);

  const loadProfileData = useCallback(async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('user_bio');
      const savedBio =
        jsonValue != null ? JSON.parse(jsonValue) : profileData.bio;
      if (savedBio) {
        setProfileData(prev => ({...prev, bio: savedBio}));
      }

      const sn = await AsyncStorage.getItem('user_name');
      const savedName = sn != null ? JSON.parse(sn) : profileData.name;
      if (savedName) {
        setProfileData(prev => ({...prev, name: savedName}));
      }

      const st = await AsyncStorage.getItem('user_hometown');
      const savedHometown = st != null ? JSON.parse(st) : profileData.hometown;
      if (savedHometown) {
        setProfileData(prev => ({...prev, hometown: savedHometown}));
      }

      //   const savedGender = await AsyncStorage.getItem('user_gender');
      //   if (savedGender) {
      //     setProfileData(prev => ({...prev, gender: savedGender}));
      //   }

      //   const savedBirthday = await AsyncStorage.getItem('user_birthday');
      //   if (savedBirthday) {
      //     setProfileData(prev => ({...prev, birthday: savedBirthday}));
      //   }
    } catch (error) {
      console.error('Failed to load profile data:', error);
    }
  }, [profileData.bio, profileData.hometown, profileData.name]);

  const handleBirthday = (savedDate: string) => {
    setProfileData(prev => ({...prev, birthday: savedDate}));
  };

  const handleGender = (savedGender: string) => {
    setProfileData(prev => ({...prev, gender: savedGender}));
  };

  const handleEditBio = () => {
    navigate(ROUTES.ABOUT_EDIT, {
      initialData: {editData: profileData.bio, editOption: 'Bio'},
    });
  };

  const handleEditNickname = async () => {
    navigate(ROUTES.ABOUT_EDIT, {
      initialData: {editData: profileData.name, editOption: 'Name'},
    });
  };

  const handleEditHometown = async () => {
    navigate(ROUTES.ABOUT_EDIT, {
      initialData: {editData: profileData.hometown, editOption: 'Hometown'},
    });
  };

  const handleEditGender = async () => {
    setIsGenderSelector(true);
  };

  const handleEditBirthday = async () => {
    setIsBirthdaySelector(true);
  };

  const renderSectionWithArrow = (
    title: string,
    value: string,
    onPress: () => void,
  ) => (
    <TouchableOpacity style={styles.section} onPress={onPress}>
      <CustomText
        fontFamily={Fonts.Medium}
        fontSize={RFValue(13)}
        style={styles.sectionTitle}>
        {title}
      </CustomText>
      <View style={styles.sectionValueContainer}>
        <CustomText
          fontSize={RFValue(12)}
          style={styles.sectionValue}
          numberOfLine={title === 'Bio' ? 2 : 1}>
          {value}
        </CustomText>
        <Icon name="chevron-forward" size={20} color="#999" />
      </View>
    </TouchableOpacity>
  );

  useFocusEffect(
    useCallback(() => {
      loadProfileData();
    }, [loadProfileData]),
  );

  return (
    <CustomSafeAreaView style={styles.container}>
      <BackButton />

      <ScrollView showsVerticalScrollIndicator={false}>
        {renderSectionWithArrow('Bio', profileData.bio, handleEditBio)}

        <View style={styles.divider} />

        {/* Avatar Section */}
        <TouchableOpacity
          style={styles.section}
          onPress={() => console.log('Edit avatar')}>
          <Text style={styles.sectionTitle}>Avatar</Text>
          <View style={styles.sectionValueContainer}>
            <Image
              source={{uri: profileData.avatar}}
              style={styles.avatarImage}
            />
            <Icon name="chevron-forward" size={20} color="#999" />
          </View>
        </TouchableOpacity>

        <View style={styles.divider} />

        {renderSectionWithArrow('Name', profileData.name, handleEditNickname)}

        <View style={styles.divider} />

        {renderSectionWithArrow(
          'Birthday',
          profileData.birthday,
          handleEditBirthday,
        )}

        <View style={styles.divider} />

        {renderSectionWithArrow('Gender', profileData.gender, handleEditGender)}

        <View style={styles.divider} />

        {renderSectionWithArrow(
          'Hometown',
          profileData.hometown,
          handleEditHometown,
        )}

        {/* Divider */}
        <View style={styles.divider} />

        {/* Labels Section */}
        <TouchableOpacity
          style={styles.section}
          onPress={() => console.log('Edit labels')}>
          <Text style={styles.sectionTitle}>Labels</Text>
          <View style={styles.sectionValueContainer}>
            <Icon name="chevron-forward" size={20} color="#999" />
          </View>
        </TouchableOpacity>
      </ScrollView>

      <GenderSelector
        visible={isGenderSelector}
        onClose={() => setIsGenderSelector(false)}
        onSelect={handleGender}
        currentGender={profileData.gender}
      />

      <DatePickerModal
        visible={isBirthdaySelector}
        onClose={() => setIsBirthdaySelector(false)}
        onSelect={handleBirthday}
        initialDate={profileData.birthday}
      />
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    color: '#666',
  },
  sectionValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '60%',
  },
  sectionValue: {
    marginRight: 8,
    color: '#333',
    textAlign: 'right',
  },
  divider: {
    height: 0.5,
    backgroundColor: '#e0e0e0',
    marginLeft: 16,
  },
  avatarImage: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 8,
  },
});

export default EditProfile;
