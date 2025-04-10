import {StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import CustomSafeAreaView from '@components/global/CustomSafeAreaView';
import CustomText from '@components/ui/CustomText';
import {Fonts} from '@utils/Constants';
import ProgessBar from '@components/onBoarding/ProgessBar';
import MaskedText from '@components/ui/MaskedText';
import {RFValue} from 'react-native-responsive-fontsize';
import Footer from '@components/onBoarding/Footer';
import {resetAndNavigate} from '@utils/NavigationUtils';
import {ROUTES} from '@navigation/Routes';
import {useAuth} from '@state/useAuth';
import authService from '@service/auth.service';
import {CollectionsType} from '@service/config';

const OnBoardingA = () => {
  const {signInWithGoogle, signInWithFacebook} = useAuth();
  const [gmLoading, setGmLoading] = useState(false);
  const [fbLoading, setFbLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setGmLoading(true);
    try {
      const user = await signInWithGoogle();

      if (user) {
        const result = await authService.getUserDataFromFirestore(
          user?.id,
          CollectionsType.Users,
        );
        if (result) {
          if (
            result?.email === user?.email &&
            result?.providerId === user?.providerId &&
            result?.fcmToken === user?.fcmToken
          ) {
            await authService.storeUserData(result);
            resetAndNavigate(ROUTES.HOME);
            console.log('Device token already registered in firebase store.');
          } else {
            const userData = {
              ...result,
              providerId: user?.providerId,
              fcmToken: user?.fcmToken,
            };
            await authService.updateUserDataInFirestore(
              user.id,
              userData,
              CollectionsType.Users,
            );
             resetAndNavigate(ROUTES.HOME);
          }
        } else {
          await authService.storeUserDataInFirestore(
            user,
            CollectionsType.Users,
            user.id,
          );
          resetAndNavigate(ROUTES.ONBOARD_B);
        }
      }
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.message && err.message.includes('already associated with')) {
        const match = err.message.match(/Please sign in with (.*?)\./);
        if (match && match[1]) {
          const suggestedMethod = match[1];
          if (suggestedMethod === 'facebook.com') {
            await handleFacebookSignIn();
            return;
          }
        }
      }
    } finally {
      setGmLoading(false);
    }
  };

  const handleFacebookSignIn = async () => {
    setFbLoading(true);
    // setLocalError(''); // Clear previous errors
    try {
      const user = await signInWithFacebook();

      if (user) {
        const result = await authService.getUserDataFromFirestore(
          user?.id,
          CollectionsType.Users,
        );
        if (result) {
          if (
            result?.email === user?.email &&
            result?.providerId === user?.providerId &&
            result?.fcmToken === user?.fcmToken
          ) {
            const userData = {
              ...result,
              providerId: 'facebook.com',
            };
            await authService.updateUserDataInFirestore(
              user.id,
              userData,
              CollectionsType.Users,
            );
             resetAndNavigate(ROUTES.HOME);
            console.log('Device token already registered in firebase store.');
          } else {
            const userData = {
              ...result,
              providerId: 'facebook.com',
              fcmToken: user?.fcmToken,
            };
            await authService.updateUserDataInFirestore(
              user.id,
              userData,
              CollectionsType.Users,
            );
             resetAndNavigate(ROUTES.HOME);
          }
        } else {
          await authService.storeUserDataInFirestore(
            user,
            CollectionsType.Users,
            user.id,
          );
          resetAndNavigate(ROUTES.ONBOARD_B);
        }
      } else {
        const userData = await authService.getUserData();
        if (userData) {
          console.log('Found user data in storage, proceeding to Home');
          resetAndNavigate(ROUTES.HOME);
        }
      }
    } catch (err: any) {
      console.error('Login error:', err);
      if (err?.message?.includes('account-exists-with-different-credential')) {
        // setLocalError(
        //   'You already have an account with this email address using Google. Please sign in with Google instead.',
        // );
      } else {
        // setLocalError(err.message || 'Unknown error occurred during login');
      }
    } finally {
      setFbLoading(true);
    }
  };

  return (
    <CustomSafeAreaView>
      <View style={styles.content}>
        <View style={styles.subContent}>
          <ProgessBar progress={25} pre={0} />
          <View style={styles.maskedContainer}>
            <MaskedText
              title="Begin Your"
              fontFamily={Fonts.Regular}
              fontSize={RFValue(34)}
              gradientStyle={styles.gradietnStyle}
            />
            <MaskedText
              title="Mindful Journey"
              fontFamily={Fonts.Bold}
              fontSize={RFValue(34)}
              gradientStyle={styles.gradietnStyle}
            />
          </View>
          <CustomText
            fontSize={RFValue(13)}
            fontFamily={Fonts.Medium}
            style={styles.title}>
            Log in or sign up to begin your journey with personalized,
            human-like wellness support
          </CustomText>
        </View>

        <Footer
          handleGoogleSignIn={handleGoogleSignIn}
          handleFacebookSignIn={handleFacebookSignIn}
          gmLoading={gmLoading}
          fbLoading={fbLoading}
        />
      </View>
    </CustomSafeAreaView>
  );
};

export default OnBoardingA;

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  subContent: {
    paddingHorizontal: 34,
    marginTop: 30,
  },
  gradietnStyle: {
    height: 55,
  },
  maskedContainer: {
    marginTop: 40,
  },
  title: {
    color: '#000000',
    opacity: 0.5,
    textAlign: 'center',
    width: '96%',
    alignSelf: 'center',
  },
  googleButton: {
    backgroundColor: '#4285F4',
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  googleText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
});
