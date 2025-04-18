import React, {useState, useCallback, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Keyboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomSafeAreaView from '@components/global/CustomSafeAreaView';
import BackButton from '@components/ui/BackButton';
import CustomText from '@components/ui/CustomText';
import {Fonts} from '@utils/Constants';
import {RFValue} from 'react-native-responsive-fontsize';
import {goBack, navigate, resetAndNavigate} from '@utils/NavigationUtils';
import {ROUTES} from '@navigation/Routes';
import GenderSelector from '@components/Profile/GenderSelector';
import {useFocusEffect} from '@react-navigation/native';
import DatePickerModal from '@components/Profile/DatePickerModal';
import GradientButton from '@components/ui/GradientButton';
import {useAuth} from '@state/useAuth';
import authService, {UserData} from '@service/auth.service';
import {Asset} from 'react-native-image-picker';
import {selectFromGallery, takePhoto} from '@service/imagePicker';
import {uploadToS3} from '@service/uploadToS3';
import {calculateAge} from '@utils/DateUtils';
import {CollectionsType} from '@service/config';

const EditProfile = () => {
  const {user} = useAuth();
  const [profileData, setProfileData] = useState<UserData | null>(null);
  const [isGenderSelector, setIsGenderSelector] = useState(false);
  const [isBirthdaySelector, setIsBirthdaySelector] = useState(false);
  const [imageData, setImageData] = useState<Asset | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData(user);
    }
  }, [user]);

  const handleImageSelection = async (type: 'camera' | 'gallery') => {
    Keyboard.dismiss();
    try {
      let selectedImage: Asset | null;

      if (type === 'camera') {
        selectedImage = await takePhoto();
      } else {
        selectedImage = await selectFromGallery();
      }

      if (selectedImage && selectedImage.uri) {
        setImage(selectedImage.uri);
        setImageData(selectedImage);
      }
    } catch (error) {
      console.error('Error selecting image:', error);
    }
  };

  const loadProfileData = useCallback(async () => {
    try {
      if (profileData) {
        const jsonValue = await AsyncStorage.getItem('user_bio');
        const savedBio =
          jsonValue != null ? JSON.parse(jsonValue) : profileData?.bio;
        if (savedBio) {
          setProfileData(prev => {
            if (!prev) {
              return null;
            }
            return {
              ...prev,
              bio: savedBio,
            };
          });
        }

        const sn = await AsyncStorage.getItem('user_name');
        const savedName =
          sn != null ? JSON.parse(sn) : profileData?.displayName;
        if (savedName) {
          setProfileData(prev => {
            if (!prev) {
              return null;
            }
            return {
              ...prev,
              displayName: savedName,
            };
          });
        }

        const st = await AsyncStorage.getItem('user_hometown');
        const savedHometown =
          st != null ? JSON.parse(st) : profileData?.hometown;
        if (savedHometown) {
          setProfileData(prev => {
            if (!prev) {
              return null;
            }
            return {
              ...prev,
              hometown: savedHometown,
            };
          });
        }
      }
    } catch (error) {
      console.error('Failed to load profile data:', error);
    }
  }, [profileData]);

  const handleSave = async () => {
    setLoading(true);
    try {
      if (profileData?.id) {
        let updateddata;
        const age = calculateAge(profileData?.dob || '01/01/2001');
        if (imageData) {
          const imageUrl = await uploadToS3(
            imageData.uri ?? '',
            imageData.fileName,
            imageData.type,
          );
          updateddata = {
            ...profileData,
            photoURL: imageUrl,
            age: age.toString(),
          };
        } else {
          updateddata = {
            ...profileData,
            age: age.toString(),
          };
        }
        await authService.updateUserDataInFirestore(
          profileData?.id,
          updateddata,
          CollectionsType.Users,
        );
        goBack();
      } else {
        resetAndNavigate(ROUTES.ONBOARD_A);
      }
    } catch (error) {
      console.error('Failed to save profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBirthday = (savedDate: string) => {
    setProfileData(prev => {
      if (!prev) {
        return null;
      }
      return {
        ...prev,
        dob: savedDate,
      };
    });
  };

  const handleGender = (savedGender: string) => {
    setProfileData(prev => {
      if (!prev) {
        return null;
      }
      return {
        ...prev,
        gender: savedGender,
      };
    });
  };

  const handleEditBio = () => {
    navigate(ROUTES.ABOUT_EDIT, {
      initialData: {editData: profileData?.bio, editOption: 'Bio'},
    });
  };

  const handleEditNickname = async () => {
    navigate(ROUTES.ABOUT_EDIT, {
      initialData: {editData: profileData?.displayName, editOption: 'Name'},
    });
  };

  const handleEditHometown = async () => {
    navigate(ROUTES.ABOUT_EDIT, {
      initialData: {editData: profileData?.hometown, editOption: 'Hometown'},
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
        <TouchableOpacity
          style={styles.avtarContainer}
          onPress={() => handleImageSelection('gallery')}>
          <View>
            {image ? (
              <Image source={{uri: image}} style={styles.avatarImage} />
            ) : profileData?.photoURL ? (
              <Image
                source={{uri: profileData?.photoURL}}
                style={styles.avatarImage}
              />
            ) : (
              <Image
                source={require('@assets/images/user.png')}
                style={styles.avatarImage}
              />
            )}
          </View>
        </TouchableOpacity>

        {renderSectionWithArrow('Bio', profileData?.bio ?? '', handleEditBio)}

        <View style={styles.divider} />

        {renderSectionWithArrow(
          'Name',
          profileData?.displayName || 'User',
          handleEditNickname,
        )}

        <View style={styles.divider} />

        {renderSectionWithArrow(
          'Birthday',
          profileData?.dob || '01/01/2001',
          handleEditBirthday,
        )}

        <View style={styles.divider} />

        {renderSectionWithArrow(
          'Gender',
          profileData?.gender || 'Male',
          handleEditGender,
        )}

        <View style={styles.divider} />

        {renderSectionWithArrow(
          'Hometown',
          profileData?.hometown || 'India',
          handleEditHometown,
        )}
        <View style={styles.divider} />

        {/* Labels Section */}
        <TouchableOpacity
          style={styles.section}
          onPress={() => console.log('Edit labels')}>
          <CustomText
            fontFamily={Fonts.Medium}
            fontSize={RFValue(13)}
            style={styles.sectionTitle}>
            Labels
          </CustomText>
          <View style={styles.sectionValueContainer}>
            <Icon name="chevron-forward" size={20} color="#999" />
          </View>
        </TouchableOpacity>
      </ScrollView>
      <View style={styles.saveButton}>
        <GradientButton
          title="Save"
          textColor="#FFF"
          onPress={handleSave}
          loading={loading}
        />
      </View>
      <GenderSelector
        visible={isGenderSelector}
        onClose={() => setIsGenderSelector(false)}
        onSelect={handleGender}
        currentGender={profileData?.gender || 'Male'}
      />

      <DatePickerModal
        visible={isBirthdaySelector}
        onClose={() => setIsBirthdaySelector(false)}
        onSelect={handleBirthday}
        initialDate={profileData?.dob || '01/01/2001'}
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
  avtarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  saveButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    paddingHorizontal: 16,
  },
});

export default EditProfile;
