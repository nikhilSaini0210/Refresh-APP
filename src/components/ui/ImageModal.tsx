import {
  Image,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  View,
} from 'react-native';
import React, {FC} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';

interface Props {
  imageUri: string;
  visible: boolean;
  onPress: () => void;
}

const {width, height} = Dimensions.get('window');

const ImageModal: FC<Props> = ({imageUri, visible, onPress}) => {
  return (
    <Modal visible={visible} onRequestClose={onPress}>
      <View style={styles.modalContainer}>
        <Image
          source={{uri: imageUri}}
          style={styles.fullScreenImage}
          resizeMode="contain"
        />
        <TouchableOpacity
          style={styles.closeIconContainer}
          onPress={onPress}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
          >
          <Icon name="close" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default ImageModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  closeIconContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 20,
    padding: 8,
    zIndex: 999999,
    elevation: 999999,
  },
  fullScreenImage: {
    width: width,
    height: height,
  },
});
