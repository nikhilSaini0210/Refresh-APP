import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useRoute, RouteProp} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import {goBack} from '@utils/NavigationUtils';
import CustomSafeAreaView from '@components/global/CustomSafeAreaView';
import CustomKeyboardDismiss from '@components/global/CustomKeyboardDismiss';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AboutEditRouteParams = {
  params: {
    initialData: {editData: string; editOption: string};
  };
};

const AboutEdit = () => {
  const route = useRoute<RouteProp<AboutEditRouteParams, 'params'>>();
  const {initialData} = route.params;
  const rd = initialData?.editData ?? '';
  const aboutHeader = initialData?.editOption ?? '';

  const [value, setValue] = useState(rd);
  let maxLength;

  switch (aboutHeader) {
    case 'Bio':
      maxLength = 140;
      break;
    case 'Name':
      maxLength = 35;
      break;
    default:
      maxLength = 28;
      break;
  }

  const handleSave = async () => {
    try {
      if (aboutHeader === 'Bio') {
        const bio = value.trim();
        if (rd !== bio) {
          await AsyncStorage.setItem('user_bio', JSON.stringify(bio));
        }
      }
      if (aboutHeader === 'Name') {
        const name = value.trim();
        if (rd !== name) {
          await AsyncStorage.setItem('user_name', JSON.stringify(name));
        }
      }
      if (aboutHeader === 'Hometown') {
        const hometown = value.trim();
        if (rd !== hometown) {
          await AsyncStorage.setItem('user_hometown', JSON.stringify(hometown));
        }
      }
      goBack();
    } catch (error) {
      console.error('Failed to save bio:', error);
    } finally {
      setValue('');
    }
  };

  const handleCancel = useCallback(() => {
    goBack();
  }, []);

  return (
    <CustomSafeAreaView style={styles.container}>
      <CustomKeyboardDismiss>
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={handleCancel}>
              <Icon name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>{aboutHeader}</Text>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Icon name="checkmark" size={28} color="#00BFA5" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.bioInput}
              multiline
              value={value}
              onChangeText={setValue}
              maxLength={maxLength}
              placeholder="Add a bio..."
              placeholderTextColor="#999"
              autoFocus
              returnKeyType="done"
              blurOnSubmit={true}
              onSubmitEditing={handleSave}
            />
            <View style={styles.line} />

            <View style={styles.charCounterContainer}>
              <Text style={styles.charCounter}>
                {value.length}/{maxLength}
              </Text>
            </View>
          </View>

          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                {width: `${(value.length / maxLength) * 100}%`},
              ]}
            />
          </View>
        </KeyboardAvoidingView>
      </CustomKeyboardDismiss>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    height: 56,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  saveButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  inputContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  bioInput: {
    fontSize: 18,
    lineHeight: 24,
    padding: 0,
    textAlignVertical: 'top',
    color: '#333',
  },
  charCounterContainer: {
    position: 'absolute',
    top: 52,
    right: 20,
  },
  charCounter: {
    fontSize: 16,
    color: '#00BFA5',
  },
  progressBarContainer: {
    height: 3,
    backgroundColor: '#f0f0f0',
    width: '100%',
  },
  progressBar: {
    height: 3,
    backgroundColor: '#00BFA5',
  },
  line: {
    borderBottomWidth: 2,
    borderBottomColor: '#00BFA5',
    marginTop: 6,
    borderRadius: 2,
  },
});

export default AboutEdit;
