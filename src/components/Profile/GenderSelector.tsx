import CustomText from '@components/ui/CustomText';
import {Fonts} from '@utils/Constants';
import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Modal} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import Icon from 'react-native-vector-icons/Ionicons';

interface GenderSelectorProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (gender: string) => void;
  currentGender: string;
}

const GenderSelector: React.FC<GenderSelectorProps> = ({
  visible,
  onClose,
  onSelect,
  currentGender,
}) => {
  const [selectedGender, setSelectedGender] = useState<string>(
    currentGender || 'Male',
  );

  const handleSelect = (gender: string) => {
    setSelectedGender(gender);
  };

  const handleClose = () => {
    setSelectedGender(currentGender);
    onClose();
  };

  const handleConfirm = async () => {
    try {
      onSelect(selectedGender);
      onClose();
    } catch (error) {
      console.error('Failed to save gender:', error);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Icon name="close" size={24} color="#999" />
          </TouchableOpacity>
          <CustomText
            fontFamily={Fonts.SemiBold}
            fontSize={RFValue(15)}
            style={styles.title}>
            Choose your gender
          </CustomText>
          <CustomText fontSize={RFValue(12)} style={styles.description}>
            You can change gender only once within 30 days.
          </CustomText>

          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={styles.optionRow}
              onPress={() => handleSelect('Male')}>
              <View style={styles.optionLeft}>
                <View style={styles.maleIconContainer}>
                  <Icon name="male" size={24} color="#4D7BFF" />
                </View>
                <CustomText
                  fontSize={RFValue(15)}
                  style={styles.optionCustomText}>
                  Male
                </CustomText>
              </View>
              <View
                style={[
                  styles.radioButton,
                  selectedGender === 'Male' && styles.radioButtonSelected,
                ]}>
                {selectedGender === 'Male' && (
                  <Icon name="checkmark" size={16} color="#000" />
                )}
              </View>
            </TouchableOpacity>
            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.optionRow}
              onPress={() => handleSelect('Female')}>
              <View style={styles.optionLeft}>
                <View style={styles.femaleIconContainer}>
                  <Icon name="female" size={24} color="#FF4D9D" />
                </View>
                <CustomText
                  fontSize={RFValue(15)}
                  style={styles.optionCustomText}>
                  Female
                </CustomText>
              </View>
              <View
                style={[
                  styles.radioButton,
                  selectedGender === 'Female' && styles.radioButtonSelected,
                ]}>
                {selectedGender === 'Female' && (
                  <Icon name="checkmark" size={16} color="#000" />
                )}
              </View>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleConfirm}>
            <CustomText
              fontFamily={Fonts.SemiBold}
              fontSize={RFValue(15)}
              style={styles.confirmButtonCustomText}>
              Confirm
            </CustomText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
  },
  title: {
    marginTop: 12,
    textAlign: 'center',
  },
  description: {
    color: '#999',
    marginTop: 8,
    marginBottom: 24,
    textAlign: 'center',
  },
  optionsContainer: {
    width: '100%',
    marginBottom: 24,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    width: '100%',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  maleIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F0FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  femaleIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFECF5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionCustomText: {
    marginLeft: 16,
  },
  radioButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    backgroundColor: '#FFDE00',
    borderColor: '#FFDE00',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    width: '100%',
  },
  confirmButton: {
    backgroundColor: '#FFDE00',
    width: '100%',
    borderRadius: 28,
    paddingVertical: 14,
    alignItems: 'center',
  },
  confirmButtonCustomText: {
    color: '#000',
  },
});

export default GenderSelector;
