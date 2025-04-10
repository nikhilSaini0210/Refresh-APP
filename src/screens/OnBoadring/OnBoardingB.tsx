import {Alert, Image, Keyboard, StyleSheet, View} from 'react-native';
import React, {FC, useEffect, useState} from 'react';
import CustomSafeAreaView from '@components/global/CustomSafeAreaView';
import ProgessBar from '@components/onBoarding/ProgessBar';
import CustomText from '@components/ui/CustomText';
import {Colors, Fonts} from '@utils/Constants';
import {RFValue} from 'react-native-responsive-fontsize';
import CustomInput from '@components/ui/CustomInput';
import GradientButton from '@components/ui/GradientButton';
import {navigate} from '@utils/NavigationUtils';
import {ROUTES} from '@navigation/Routes';
import {useAuth} from '@state/useAuth';

const OnBoardingB: FC = () => {
  const {user} = useAuth();
  const [name, setName] = useState(user?.displayName);

  const onContinue = () => {
    Keyboard.dismiss();
    if (name?.length === 0) {
      Alert.alert('Please enter your name.');
      return;
    }
    navigate(ROUTES.ONBOARD_C, {userData: {name: name}});
  };

  useEffect(() => {
    if (user) {
      setName(user?.displayName);
    }
  }, [user]);

  return (
    <CustomSafeAreaView>
      <View style={styles.content}>
        <View style={styles.subContent}>
          <ProgessBar progress={50} pre={25} />
          <View style={styles.headingContainer}>
            <CustomText
              fontFamily={Fonts.Medium}
              fontSize={RFValue(14)}
              style={styles.title}>
              Let’s get to know each other
            </CustomText>
          </View>
          <View style={styles.maskedContainer}>
            <CustomText
              fontFamily={Fonts.SemiBold}
              fontSize={RFValue(23)}
              numberOfLine={2}
              style={styles.textA}>
              What{' '}
              <CustomText
                fontFamily={Fonts.Regular}
                fontSize={RFValue(23)}
                style={styles.textB}>
                should we call{' '}
                <CustomText
                  fontFamily={Fonts.SemiBold}
                  fontSize={RFValue(23)}
                  style={styles.textC}>
                  you?
                </CustomText>
              </CustomText>
            </CustomText>
            <View style={styles.imageCon}>
              <Image
                source={require('@assets/images/line.png')}
                style={styles.img}
              />
            </View>
          </View>
          <View style={styles.inputCon}>
            <CustomInput
              left={
                <CustomText
                  style={styles.nameText}
                  fontSize={RFValue(16)}
                  fontFamily={Fonts.Regular}>
                  Name
                </CustomText>
              }
              right={true}
              value={name}
              onChangeText={setName}
              onClear={() => setName('')}
            />
          </View>
        </View>
        <View style={styles.btn}>
          <GradientButton
            disabled={false}
            title="Continue"
            textColor="#FFF"
            loading={false}
            onPress={onContinue}
          />
        </View>
      </View>
    </CustomSafeAreaView>
  );
};

export default OnBoardingB;

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  subContent: {
    paddingHorizontal: 34,
    marginTop: 30,
  },
  headingContainer: {
    marginTop: 40,
  },
  title: {
    color: '#312F2E',
    opacity: 0.7,
    textAlign: 'center',
  },
  gradietnStyle: {
    height: 55,
  },
  maskedContainer: {
    marginTop: 10,
  },
  textA: {
    color: '#F7B174',
    textTransform: 'capitalize',
    textAlign: 'center',
  },
  textB: {
    color: '#000000B2',
  },
  textC: {
    color: '#000000B2',
  },
  imageCon: {
    position: 'absolute',
    right: 15,
    width: 50,
    height: 50,
    top: 10,
  },
  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  nameText: {
    color: Colors.text,
    marginLeft: 15,
  },
  inputCon: {
    marginTop: 100,
  },
  btn: {
    paddingHorizontal: 34,
    position: 'absolute',
    width: '100%',
    bottom: 0,
    paddingVertical: 15,
  },
});
