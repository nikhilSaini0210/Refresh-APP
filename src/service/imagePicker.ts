import {
  launchCamera,
  launchImageLibrary,
  ImagePickerResponse,
  Asset,
  CameraOptions,
  ImageLibraryOptions,
} from 'react-native-image-picker';
import {Platform, PermissionsAndroid} from 'react-native';

const imagePickerOptions: CameraOptions & ImageLibraryOptions = {
  mediaType: 'photo' as const,
  includeBase64: false,
  maxHeight: 800,
  maxWidth: 800,
  quality: 0.8,
  saveToPhotos: false,
};

const requestCameraPermission = async (): Promise<boolean> => {
  if (Platform.OS !== 'android') {
    return true;
  }

  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Camera Permission',
        message: 'This app needs access to your camera to take photos.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.error('Failed to request camera permission:', err);
    return false;
  }
};

const requestStoragePermission = async (): Promise<boolean> => {
  if (Platform.OS !== 'android') {
    return true;
  }

  try {
    if (Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        'android.permission.READ_MEDIA_IMAGES',
        {
          title: 'Photos Permission',
          message: 'This app needs access to your photos to upload images.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } else {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'This app needs access to your storage to upload images.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
  } catch (err) {
    console.error('Failed to request storage permission:', err);
    return false;
  }
};

export const takePhoto = async (): Promise<Asset | null> => {
  // Request camera permission first
  const hasPermission = await requestCameraPermission();
  if (!hasPermission) {
    console.log('Camera permission denied');
    return null;
  }

  return new Promise(resolve => {
    launchCamera(imagePickerOptions, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        console.log('User cancelled camera');
        resolve(null);
      } else if (response.errorCode) {
        console.error('Camera error:', response.errorMessage);
        resolve(null);
      } else if (response.assets && response.assets.length > 0) {
        resolve(response.assets[0]);
      } else {
        resolve(null);
      }
    });
  });
};

export const selectFromGallery = async (): Promise<Asset | null> => {
  const hasPermission = await requestStoragePermission();
  if (!hasPermission) {
    console.log('Storage permission denied');
    return null;
  }

  return new Promise(resolve => {
    launchImageLibrary(imagePickerOptions, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        console.log('User cancelled image selection');
        resolve(null);
      } else if (response.errorCode) {
        console.error('ImagePicker Error:', response.errorMessage);
        resolve(null);
      } else if (response.assets && response.assets.length > 0) {
        resolve(response.assets[0]);
      } else {
        resolve(null);
      }
    });
  });
};

export const showImagePicker = async (): Promise<Asset | null> => {
  return await selectFromGallery();
};
