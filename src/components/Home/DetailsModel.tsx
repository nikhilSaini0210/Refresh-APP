import React, {FC} from 'react';
import {
  Modal,
  View,
  TouchableWithoutFeedback,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import CustomText from '@components/ui/CustomText';
import {Colors, Fonts} from '@utils/Constants';

interface Props {
  visible: boolean;
  onClose: () => void;
  onAddToFavorites: () => void;
  onShare: () => void;
  onDeletePost: () => void;
  onViewAccount: () => void;
}

const DetailsModal: FC<Props> = ({
  visible,
  onClose,
  onAddToFavorites,
  onShare,
  onDeletePost,
  onViewAccount,
}) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.container}>
              <CustomText style={styles.header} fontFamily={Fonts.SemiBold}>
                Post Options
              </CustomText>
              <TouchableOpacity
                style={styles.option}
                onPress={onAddToFavorites}>
                <CustomText style={styles.optionText}>
                  Add to Favorites
                </CustomText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.option} onPress={onShare}>
                <CustomText style={styles.optionText}>Share</CustomText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.option} onPress={onDeletePost}>
                <CustomText style={[styles.optionText, styles.deleteText]}>
                  Delete Post
                </CustomText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.option} onPress={onViewAccount}>
                <CustomText style={styles.optionText}>About Account</CustomText>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    width: '90%',
    alignItems: 'center',
  },
  header: {
    fontSize: RFValue(16),
    marginBottom: 20,
    color: Colors.primary,
    textAlign: 'center',
  },
  option: {
    width: '100%',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    alignItems: 'center',
  },
  optionText: {
    fontSize: RFValue(14),
    color: '#333',
  },
  deleteText: {
    color: 'red',
  },
});

export default DetailsModal;
