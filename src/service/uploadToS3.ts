import RNFetchBlob from 'react-native-blob-util';
import {AWS_REGION, BUCKET_NAME, s3Client} from './config';
import {Platform} from 'react-native';
import {PutObjectCommand} from '@aws-sdk/client-s3';
import {Buffer} from 'buffer';

global.Buffer = Buffer;

export const uploadToS3 = async (
  imageUri: string,
  fileName?: string,
  contentType = 'image/jpeg',
): Promise<string> => {
  try {
    const uniqueFileName = fileName || `image_${Date.now()}.jpg`;

    const s3Key = `uploads/${uniqueFileName}`;

    let realPath = imageUri;
    if (Platform.OS === 'ios' && imageUri.startsWith('file://')) {
      realPath = imageUri.substring(7);
    }

    const fileData = await RNFetchBlob.fs.readFile(realPath, 'base64');

    const buffer = Buffer.from(fileData, 'base64');

    const uploadCommand = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: s3Key,
      Body: buffer,
      ContentType: contentType,
    });

    await s3Client.send(uploadCommand);

    const s3Url = `https://${BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${s3Key}`;

    return s3Url;
  } catch (error) {
    console.error('Error uploading image to S3:', error);
    throw error;
  }
};
