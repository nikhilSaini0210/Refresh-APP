import {StyleSheet, View} from 'react-native';
import React, {FC} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import CustomButton from '@components/ui/CustomButton';
import CustomText from '@components/ui/CustomText';
import {Fonts} from '@utils/Constants';

interface Props {
  handleFacebookSignIn: () => void;
  gmLoading: boolean;
  handleGoogleSignIn: () => void;
  fbLoading: boolean;
}

const Footer: FC<Props> = ({
  handleFacebookSignIn,
  gmLoading,
  handleGoogleSignIn,
  fbLoading,
}) => {
  return (
    <LinearGradient
      style={styles.gradientContainer}
      colors={['#F3A8CE', '#F7B174']}
      start={{x: 1, y: 1}}
      end={{x: 0, y: 1}}>
      <View style={styles.socialButtonsContainer}>
        <View style={styles.dotContainer}>
          <View style={styles.activeDot} />
          <View style={styles.inactiveDot} />
          <View style={styles.inactiveDot} />
          <View style={styles.inactiveDot} />
        </View>
        <CustomButton
          title="Countinue with Facebook"
          disabled={false}
          loading={fbLoading}
          onPress={handleFacebookSignIn}
          icon={require('@assets/images/fb.png')}
          bgColor="#1877F2"
          textColor="#FFF"
          style={styles.btn}
        />

        <CustomButton
          title="Countinue with Google"
          disabled={false}
          loading={gmLoading}
          onPress={handleGoogleSignIn}
          icon={require('@assets/images/google.png')}
          bgColor="#FFFFFF"
          textColor="#0000008A"
          style={styles.btn}
        />
        <View style={styles.orContainer}>
          <View style={styles.line} />
          <CustomText
            variant="h6"
            fontFamily={Fonts.SemiBold}
            style={styles.orText}>
            Or
          </CustomText>
          <View style={styles.line} />
        </View>
        <CustomText
          variant="h6"
          fontFamily={Fonts.SemiBold}
          style={styles.textA}>
          I agree to{' '}
          <CustomText
            variant="h6"
            fontFamily={Fonts.SemiBold}
            style={styles.textB}>
            Privacy Policy
          </CustomText>{' '}
          &{' '}
          <CustomText
            variant="h6"
            fontFamily={Fonts.SemiBold}
            style={styles.textB}>
            Terms of Service
          </CustomText>
        </CustomText>
      </View>
    </LinearGradient>
  );
};

export default Footer;

const styles = StyleSheet.create({
  gradientContainer: {
    width: '100%',
    borderTopRightRadius: 35,
    borderTopLeftRadius: 35,
    position: 'absolute',
    bottom: 0,
    paddingHorizontal: 30,
    paddingTop: 25,
    paddingBottom: 40,
  },
  socialButtonsContainer: {
    width: '100%',
  },
  dotContainer: {
    width: 64,
    height: 22,
    borderWidth: 1,
    borderColor: '#FFFFFF4D',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 4,
    elevation: 1,
  },
  activeDot: {
    width: 8,
    height: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 50,
  },
  inactiveDot: {
    width: 8,
    height: 8,
    backgroundColor: '##FFFFFF4D',
    borderRadius: 50,
    borderWidth: 0.2,
    borderColor: '#FFFFFF',
  },
  btn: {
    marginTop: 25,
  },
  orContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 28,
  },
  orText: {
    color: '#FFFFFF',
  },
  line: {
    width: '40%',
    height: 1.5,
    backgroundColor: '#FFFFFF80',
    borderRadius: 50,
  },
  textA: {
    textAlign: 'center',
    color: '#FFFFFF',
  },
  textB: {
    textAlign: 'center',
    color: '#FFFFFF',
    textDecorationLine: 'underline',
  },
});
