import {Alert, Keyboard, StyleSheet, View} from 'react-native';
import React, {FC, useState} from 'react';
import CustomHeader from '@components/ui/CustomHeader';
import UploadImageView from './UploadImageView';
import CameraAndImageOpenButton from './CameraAndImageOpenButton';
import {Asset} from 'react-native-image-picker';
import {selectFromGallery, takePhoto} from '@service/imagePicker';
import ActivityLoaderModal from '@components/global/ActivityLoaderModal';
import CustomKeyboardDismiss from '@components/global/CustomKeyboardDismiss';
import {useAuth} from '@state/useAuth';
import postService from '@service/post.service';

const Add: FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [imageData, setImageData] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(false);
  const [caption, setCaption] = useState('');
  const {user} = useAuth();

  const handleImageSelection = async (type: 'camera' | 'gallery') => {
    Keyboard.dismiss();
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    Keyboard.dismiss();
    setLoading(true);
    try {
      if (imageData) {
        await postService.createPost(
          imageData,
          caption,
          user?.displayName || '',
          user?.email || '',
          user?.id || '',
        );

        Alert.alert('Success', 'Post Successfully Added.');
        setCaption('');
        setImage(null);
        setImageData(null);
      } else {
        console.error('Invalid image data for upload');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomKeyboardDismiss>
      <View style={styles.container}>
        <CustomHeader
          title="Post"
          secondTitle={'Upload'}
          secondTitleColor="#4285F4"
          onPress={handleUpload}
        />
        <View style={styles.uploadCont}>
          <UploadImageView
            imageData={image}
            onChangeText={setCaption}
            value={caption}
          />
        </View>
        <CameraAndImageOpenButton
          title="Open Camera"
          icon={require('@assets/images/camera.png')}
          onPress={() => handleImageSelection('camera')}
        />
        <CameraAndImageOpenButton
          title="Open Gallery"
          icon={require('@assets/images/gallery.png')}
          onPress={() => handleImageSelection('gallery')}
        />
        <ActivityLoaderModal visible={loading} />
      </View>
    </CustomKeyboardDismiss>
  );
};

export default Add;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  uploadCont: {
    paddingHorizontal: 20,
  },
});
