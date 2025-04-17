import {S3Client} from '@aws-sdk/client-s3';

export const GOOGLE_WEB_CLIENT_ID =
  '37585022096-halucdk8av5jdpl4a7oop33uq6nk7jpd.apps.googleusercontent.com';
export const USER_DATA_KEY = '@user_data';
export const USER_UPDATED_KEY = '@user_updated_data';

export enum CollectionsType {
  Users = 'users',
  Posts = 'posts',
  Tokens = 'tokens',
  Chats = 'chats',
  Messages = 'messages',
  LastChat = 'lastchat',
}

export const AWS_ACCESSY_KEY = 'AKIASLU5DTFJJI2YKFGO';
export const AWS_SECRET_KEY = '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';
export const BUCKET_NAME = 'socialappimageaws';
export const AWS_REGION = 'ap-south-1';

export const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESSY_KEY,
    secretAccessKey: AWS_SECRET_KEY,
  },
});

//LOCAL SERVER
// export const BASE_URL = 'http://192.168.75.181:4000/notification';

//LIVE SERVVER
export const BASE_URL = 'https://refresh-app-server.onrender.com/notification';

