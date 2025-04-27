import React, {FC, useState} from 'react';
import {
  Modal,
  View,
  TouchableWithoutFeedback,
  StyleSheet,
  Image,
} from 'react-native';
import MixedButton from './MixedButton';
import {Colors, Fonts, gradientColor} from '@utils/Constants';
import GradientBorderButton from './GradientBorderButton';
import CustomText from './CustomText';
import {RFValue} from 'react-native-responsive-fontsize';

interface Props {
  visible: boolean;
  onClose: () => void;
  onGallery: () => void;
  onCamera: () => void;
}

const ImageSelectionModal: FC<Props> = ({
  visible,
  onClose,
  onCamera,
  onGallery,
}) => {
  const [galleryLodaing, setGalleryLoading] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);

  const handleGallery = () => {
    setGalleryLoading(true);
    onGallery();
    setGalleryLoading(false);
  };

  const handleCamera = () => {
    setCameraLoading(true);
    onCamera();
    setCameraLoading(false);
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <View style={styles.container}>
            <CustomText
              fontFamily={Fonts.SemiBold}
              fontSize={RFValue(12)}
              style={styles.header}>
              We highly recommend that you use a selfie. As the data shows that
              the chance of getting followers will increase by 50% if a selfie
              is used as an avatar or in the album.
            </CustomText>
            <View style={styles.examplesContainer}>
              <Image
                source={require('@assets/images/sample1.jpg')}
                style={styles.exampleImage1}
              />
              <Image
                source={require('@assets/images/sample2.jpg')}
                style={styles.exampleImage2}
              />
              <Image
                source={require('@assets/images/sample3.jpg')}
                style={styles.exampleImage3}
              />
            </View>
            <CustomText style={styles.examplesText}>Good example</CustomText>
            <View style={styles.buttonContainer}>
              <MixedButton
                title="Choose From Library "
                textColor="#FFF"
                onPress={handleGallery}
                gradientColors={gradientColor}
                style={styles.btnStyle}
                loading={galleryLodaing}
                activityGradientColors={[Colors.primary, Colors.secondary]}
              />
            </View>
            <View style={styles.buttonContainer}>
              <GradientBorderButton
                title={'Take Photos'}
                onPress={handleCamera}
                gradientColors={gradientColor}
                loading={cameraLoading}
              />
            </View>
          </View>
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
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    padding: 20,
    width: '100%',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
  },
  buttonContainer: {
    width: '100%',
    marginVertical: 10,
  },
  header: {
    textAlign: 'left',
    marginBottom: 20,
    width: '87%',
    color: '#000',
  },
  subHeader: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  examplesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 35,
  },
  exampleImage1: {
    width: 50,
    height: 50,
    borderRadius: 40,
    backgroundColor: '#ccc',
    left: 40,
    top: 20,
  },
  exampleImage2: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ccc',
    top: 20,
  },
  exampleImage3: {
    width: 60,
    height: 60,
    borderRadius: 40,
    backgroundColor: '#ccc',
    right: 30,
  },
  examplesText: {
    color: '#333',
    marginBottom: 10,
  },
  btnStyle: {
    alignItems: 'center',
    borderRadius: 8,
    paddingVertical: 15,
  },
});

export default ImageSelectionModal;
