import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CollectionsType, GOOGLE_WEB_CLIENT_ID, USER_DATA_KEY} from './config';
import firestore, {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  updateDoc,
} from '@react-native-firebase/firestore';
import {LoginManager, AccessToken} from 'react-native-fbsdk-next';
import messaging from '@react-native-firebase/messaging';
import {Platform} from 'react-native';

GoogleSignin.configure({
  webClientId: GOOGLE_WEB_CLIENT_ID,
});

export interface UserData {
  id: string;
  email: string;
  displayName: string;
  photoURL: string;
  providerId: string;
  age?: string;
  gender?: string;
  fcmToken?: string;
  following?: string[];
  followers?: string[];
  bio?: string;
  dob?: string;
  work?: string;
  education?: string;
  hometown?: string;
}

interface TokenData {
  userId: string;
  token: string;
  deviceType: string;
  createdAt: any;
  updatedAt: any;
}

class AuthService {
  private db = getFirestore();

  private async requestNotificationPermission(): Promise<string | null> {
    try {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        const fcmToken = await messaging().getToken();
        return fcmToken;
      }
      return null;
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return null;
    }
  }

  private async storeFCMToken(userId: string, token: string): Promise<void> {
    try {
      const tokenRef = firestore().collection(CollectionsType.Tokens).doc();
      const tokenData: TokenData = {
        userId,
        token,
        deviceType: Platform.OS,
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      };
      await tokenRef.set(tokenData);
    } catch (error) {
      console.error('Error storing FCM token:', error);
      throw error;
    }
  }

  async signInWithGoogle(): Promise<UserData | null> {
    try {
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
      const signInResult = await GoogleSignin.signIn();
      let idToken = signInResult.data?.idToken;

      if (!idToken) {
        idToken = signInResult.idToken;
      }
      if (!idToken) {
        throw new Error('No ID token found');
      }

      const googleCredential = auth.GoogleAuthProvider.credential(
        signInResult.data.idToken,
      );

      try {
        const userCredential = await auth().signInWithCredential(
          googleCredential,
        );

        const fcmToken = await this.requestNotificationPermission();
        if (fcmToken) {
          await this.storeFCMToken(userCredential.user.uid, fcmToken);
        }
        if (userCredential.user) {
          const userData: UserData = {
            id: userCredential.user.uid,
            email: userCredential.user.email || '',
            displayName: userCredential.user.displayName || '',
            photoURL: userCredential.user.photoURL || '',
            providerId: 'google.com',
            fcmToken: fcmToken || undefined,
            age: '',
            gender: '',
            following: [],
            followers: [],
            bio: '',
            dob: '',
            work: '',
            education: '',
            hometown: '',
          };
          if (userData.id) {
            await this.storeUserData(userData as UserData);
          } else {
            throw new Error('User ID is undefined');
          }

          return userData;
        }
      } catch (error: any) {
        if (
          error?.code === 'auth/account-exists-with-different-credential' &&
          error?.email
        ) {
          try {
            const methods = await auth().fetchSignInMethodsForEmail(
              error.email,
            );

            if (methods.length > 0) {
              if (methods.includes('facebook.com')) {
                const facebookUser = await this.signInWithFacebook();
                if (facebookUser) {
                  const currentUser = auth().currentUser;
                  if (currentUser) {
                    await currentUser.linkWithCredential(googleCredential);
                    const updatedUserData: UserData = {
                      ...facebookUser,
                      providerId: 'google.com',
                    };

                    await this.storeUserData(updatedUserData);

                    return updatedUserData;
                  }
                }
              }

              throw new Error(
                `This email is already associated with ${methods.join(
                  ', ',
                )}. Please sign in with ${methods[0]}.`,
              );
            }
          } catch (linkError) {
            console.error('Error during account linking:', linkError);
            throw linkError;
          }
        }

        throw error;
      }
      return null;
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      throw error;
    }
  }

  async signInWithFacebook(): Promise<UserData | null> {
    try {
      try {
        const result = await LoginManager.logInWithPermissions([
          'public_profile',
          'email',
        ]);

        if (result.isCancelled) {
          throw new Error('User cancelled the login process');
        }

        const data = await AccessToken.getCurrentAccessToken();

        if (!data) {
          throw new Error('Something went wrong obtaining the access token');
        }

        const facebookCredential = auth.FacebookAuthProvider.credential(
          data.accessToken,
        );

        try {
          const userCredential = await auth().signInWithCredential(
            facebookCredential,
          );
          const fcmToken = await this.requestNotificationPermission();
          if (fcmToken) {
            await this.storeFCMToken(userCredential.user.uid, fcmToken);
          }
          if (userCredential.user) {
            const userData: UserData = {
              id: userCredential.user.uid,
              email: userCredential.user.email || '',
              displayName: userCredential.user.displayName || '',
              photoURL: userCredential.user.photoURL || '',
              providerId: 'facebook.com',
              fcmToken: fcmToken || undefined,
              age: '',
              gender: '',
              following: [],
              followers: [],
              bio: '',
              dob: '',
              work: '',
              education: '',
              hometown: '',
            };

            await this.storeUserData(userData as UserData);

            return userData;
          }
        } catch (credentialError: any) {
          if (
            credentialError.message &&
            credentialError.message.includes(
              'account-exists-with-different-credential',
            )
          ) {
            try {
              const googleUser = await this.signInWithGoogle();
              return googleUser;
            } catch (googleError) {
              console.error('Google fallback failed:', googleError);
              throw new Error(
                'This email is already associated with a Google account. Please sign in with Google.',
              );
            }
          }

          throw credentialError;
        }
      } catch (innerError: any) {
        if (
          innerError.message &&
          innerError.message.includes(
            'account-exists-with-different-credential',
          )
        ) {
          const googleUser = await this.signInWithGoogle();
          return googleUser;
        }

        throw innerError;
      }

      return null;
    } catch (error) {
      console.error('Facebook Sign-In Error:', error);
      throw error;
    }
  }

  async signOut(provider: 'facebook.com' | 'google.com'): Promise<void> {
    try {
      if (provider === 'facebook.com') {
        await LoginManager.logOut();
      } else {
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
        await auth().signOut();
      }

      await AsyncStorage.removeItem(USER_DATA_KEY);
    } catch (error) {
      console.error('Sign Out Error:', error);
      throw error;
    }
  }

  async storeUserData(userData: UserData): Promise<void> {
    try {
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    } catch (error) {
      console.error('Error storing user data:', error);
    }
  }

  async getUserData(): Promise<UserData | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(USER_DATA_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Error retrieving user data:', error);
      return null;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    const userData = await this.getUserData();
    return userData !== null;
  }

  getCurrentUser() {
    return auth().currentUser;
  }

  async storeUserDataInFirestore(
    userData: UserData,
    collectionType: CollectionsType,
    userId: string,
  ): Promise<void> {
    try {
      await firestore()
        .collection(collectionType)
        .doc(userId)
        .set({
          ...userData,
          createdAt: firestore.FieldValue.serverTimestamp(),
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });
    } catch (error) {
      console.error('Error storing user data in Firestore:', error);
      throw error;
    }
  }

  async getUserDataFromFirestore(
    userId: string,
    collectionType: CollectionsType,
  ): Promise<UserData | null> {
    try {
      const userDoc = await firestore()
        .collection(collectionType)
        .doc(userId)
        .get();

      if (userDoc.exists) {
        if (collectionType === CollectionsType.Users) {
          return userDoc.data() as UserData;
        }
      }
      return null;
    } catch (error) {
      console.error('Error retrieving user data from Firestore:', error);
      throw error;
    }
  }

  async updateUserDataInFirestore(
    userId: string,
    userData: Partial<UserData>,
    collectionType: CollectionsType,
  ): Promise<void> {
    try {
      await firestore()
        .collection(collectionType)
        .doc(userId)
        .update({
          ...userData,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });

      if (collectionType === CollectionsType.Users) {
        await AsyncStorage.removeItem(USER_DATA_KEY);
        await this.storeUserData(userData as UserData);
      }
    } catch (error) {
      console.error('Error updating user data in Firestore:', error);
      throw error;
    }
  }

  async getSignInMethodsForEmail(email: string): Promise<string[]> {
    try {
      return await auth().fetchSignInMethodsForEmail(email);
    } catch (error) {
      console.error('Error fetching sign-in methods:', error);
      return [];
    }
  }

  async updateUserFCMTokenUser(userId: string): Promise<void> {
    try {
      const fcmToken = await this.requestNotificationPermission();
      if (fcmToken) {
        const userRef = firestore()
          .collection(CollectionsType.Users)
          .doc(userId);
        await userRef.update({
          fcmToken,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });
      }
    } catch (error) {
      console.error('Error updating user FCM token:', error);
      throw error;
    }
  }

  async updateUserFCMTokens(userId: string): Promise<void> {
    try {
      const fcmToken = await this.requestNotificationPermission();
      if (fcmToken) {
        await this.storeFCMToken(userId, fcmToken);
      }
    } catch (error) {
      console.error('Error updating user FCM token:', error);
      throw error;
    }
  }

  async getUserFCMTokens(userId: string): Promise<TokenData[]> {
    try {
      const snapshot = await firestore()
        .collection(CollectionsType.Tokens)
        .where('userId', '==', userId)
        .get();

      return snapshot.docs.map(doc => doc.data() as TokenData);
    } catch (error) {
      console.error('Error getting user FCM tokens:', error);
      throw error;
    }
  }

  async deleteFCMToken(token: string): Promise<void> {
    try {
      const snapshot = await firestore()
        .collection(CollectionsType.Tokens)
        .where('token', '==', token)
        .get();

      const batch = firestore().batch();
      snapshot.docs.forEach(document => {
        batch.delete(document.ref);
      });
      await batch.commit();
    } catch (error) {
      console.error('Error deleting FCM token:', error);
      throw error;
    }
  }

  async getUserById(userId: string): Promise<UserData | null> {
    try {
      const userRef = doc(this.db, CollectionsType.Users, userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists) {
        return userDoc.data() as UserData;
      }
      return null;
    } catch (error) {
      console.error('Error getting user data by ID:', error);
      throw error;
    }
  }

  async getAllUsers(): Promise<UserData[]> {
    try {
      const usersRef = collection(this.db, CollectionsType.Users);
      const snapshot = await getDocs(usersRef);

      return snapshot.docs.map(document => document.data() as UserData);
    } catch (error) {
      console.error('Error fetching all users:', error);
      throw error;
    }
  }

  async getAllUsersExceptCurrentUser(
    currentUserId: string,
  ): Promise<UserData[]> {
    try {
      const usersRef = collection(this.db, CollectionsType.Users);
      const snapshot = await getDocs(usersRef);

      return snapshot.docs
        .map(document => document.data() as UserData)
        .filter(user => user.id !== currentUserId);
    } catch (error) {
      console.error('Error fetching all users except current user:', error);
      throw error;
    }
  }

  async followUser(
    currentUserId: string,
    targetUserId: string,
  ): Promise<UserData | void> {
    try {
      const currentUserRef = doc(this.db, CollectionsType.Users, currentUserId);
      const targetUserRef = doc(this.db, CollectionsType.Users, targetUserId);

      await updateDoc(currentUserRef, {
        following: arrayUnion(targetUserId),
      });

      await updateDoc(targetUserRef, {
        followers: arrayUnion(currentUserId),
      });

      const user = await this.getUserById(currentUserId);
      if (user) {
        await AsyncStorage.removeItem(USER_DATA_KEY);
        await this.storeUserData(user);
        return user;
      }
    } catch (error) {
      console.error('Error following user:', error);
      throw error;
    }
  }

  async unfollowUser(
    currentUserId: string,
    targetUserId: string,
  ): Promise<UserData | void> {
    try {
      const currentUserRef = doc(this.db, CollectionsType.Users, currentUserId);
      const targetUserRef = doc(this.db, CollectionsType.Users, targetUserId);

      await updateDoc(currentUserRef, {
        following: arrayRemove(targetUserId),
      });

      await updateDoc(targetUserRef, {
        followers: arrayRemove(currentUserId),
      });
      const user = await this.getUserById(currentUserId);
      if (user) {
        await AsyncStorage.removeItem(USER_DATA_KEY);
        await this.storeUserData(user);
        return user;
      }
    } catch (error) {
      console.error('Error unfollowing user:', error);
      throw error;
    }
  }
}

export default new AuthService();
