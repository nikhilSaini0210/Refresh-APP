import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CollectionsType, GOOGLE_WEB_CLIENT_ID, USER_DATA_KEY} from './config';
import firestore from '@react-native-firebase/firestore';
import {ROUTES} from '@navigation/Routes';
import {resetAndNavigate} from '@utils/NavigationUtils';
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
}

interface TokenData {
  userId: string;
  token: string;
  deviceType: string;
  createdAt: any;
  updatedAt: any;
}

class AuthService {
  // Request notification permissions and get FCM token
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

  // Store FCM token in separate collection
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

  // Google Sign In
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
          };
          await this.storeUserData(userData);

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

  // Facebook Sign In
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
            };

            await this.storeUserData(userData);

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
          console.log(
            'Google sign-in successful from outer catch, returning user',
          );
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
  // Sign out
  async signOut(provider: 'facebook.com' | 'google.com'): Promise<void> {
    try {
      if (provider === 'facebook.com') {
        await LoginManager.logOut();
        // await GoogleSignin.revokeAccess();
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

  // Store user data in AsyncStorage
  async storeUserData(userData: UserData): Promise<void> {
    try {
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    } catch (error) {
      console.error('Error storing user data:', error);
    }
  }

  // Get user data from AsyncStorage
  async getUserData(): Promise<UserData | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(USER_DATA_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Error retrieving user data:', error);
      return null;
    }
  }

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    const userData = await this.getUserData();
    return userData !== null;
  }

  // Get current authenticated user
  getCurrentUser() {
    return auth().currentUser;
  }

  // Store user data in Firestore
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

  // Get user data from Firestore
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

  // Update user data in Firestore
  async updateUserDataInFirestore(
    userId: string,
    userData: Partial<UserData>,
    routeName: ROUTES,
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
        await this.storeUserData(userData);
      }

      if (routeName) {
        resetAndNavigate(routeName);
      }
    } catch (error) {
      console.error('Error updating user data in Firestore:', error);
      throw error;
    }
  }

  // Get sign-in methods for an email
  async getSignInMethodsForEmail(email: string): Promise<string[]> {
    try {
      return await auth().fetchSignInMethodsForEmail(email);
    } catch (error) {
      console.error('Error fetching sign-in methods:', error);
      return [];
    }
  }

  // Update FCM token for a user
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

  // Update FCM token for a user
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

  // Get all FCM tokens for a user
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

  // Delete FCM token
  async deleteFCMToken(token: string): Promise<void> {
    try {
      const snapshot = await firestore()
        .collection(CollectionsType.Tokens)
        .where('token', '==', token)
        .get();

      const batch = firestore().batch();
      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      await batch.commit();
    } catch (error) {
      console.error('Error deleting FCM token:', error);
      throw error;
    }
  }
}

export default new AuthService();
