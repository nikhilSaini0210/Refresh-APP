import {StyleSheet} from 'react-native';
import React, {useCallback, useEffect} from 'react';
import {resetAndNavigate} from '@utils/NavigationUtils';
import {ROUTES} from '@navigation/Routes';
import {useAuth} from '@state/useAuth';
import CustomSafeAreaView from '@components/global/CustomSafeAreaView';
import CustomText from '@components/ui/CustomText';
import {Fonts, gradientColor} from '@utils/Constants';
import {RFValue} from 'react-native-responsive-fontsize';
import LinearGradient from 'react-native-linear-gradient';

const SplashScreen = () => {
  const {isAuthenticated} = useAuth();

  const checkAuthenticate = useCallback(async () => {
    if (isAuthenticated) {
      resetAndNavigate(ROUTES.HOME);
    } else {
      resetAndNavigate(ROUTES.ONBOARD_A);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      checkAuthenticate();
    }, 1500);

    return () => clearTimeout(timerId);
  }, [checkAuthenticate]);

  return (
    <CustomSafeAreaView>
      <LinearGradient
        colors={gradientColor}
        start={{x: 1, y: 1}}
        end={{x: 0, y: 1}}
        style={styles.container}>
        <CustomText
          style={styles.text}
          fontFamily={Fonts.Bold}
          fontSize={RFValue(20)}>
          Social App
        </CustomText>
      </LinearGradient>
    </CustomSafeAreaView>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#FFF',
  },
});
