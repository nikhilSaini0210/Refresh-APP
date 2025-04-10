import {Alert, FlatList, StyleSheet, View} from 'react-native';
import React, {FC, useState} from 'react';
import CustomSafeAreaView from '@components/global/CustomSafeAreaView';
import ProgressBar from '@components/onBoarding/ProgessBar';
import CustomText from '@components/ui/CustomText';
import {Fonts, gradientColor, inActiveGradientColor} from '@utils/Constants';
import {RFValue} from 'react-native-responsive-fontsize';
import GradientText from '@components/ui/GradientText';
import GradientButton from '@components/ui/GradientButton';
import {navigate} from '@utils/NavigationUtils';
import {ROUTES} from '@navigation/Routes';
import {useRoute} from '@react-navigation/native';
import MixedButton from '@components/ui/MixedButton';
import CheckMark from '@assets/images/ChackMark.png';
import {Ages} from '@utils/DummyData';

interface RouteParams {
  userData: {name: string};
}

const OnBoardingC: FC = () => {
  const [age, setAge] = useState('');
  const [ageId, setAgeId] = useState<number | null>(null);
  const route = useRoute();

  const {userData: routeData} = route?.params as RouteParams;

  const onSelectAge = (item: any) => {
    setAgeId(item?._id);
    setAge(item?.title);
  };

  const onContinue = () => {
    if (age.length === 0) {
      Alert.alert('Please select your age.');
      return;
    }
    navigate(ROUTES.ONBOARD_D, {userData: {name: routeData.name, age: age}});
  };

  return (
    <CustomSafeAreaView>
      <View style={styles.content}>
        <View style={styles.subContent}>
          <ProgressBar progress={75} pre={50} />
          <View style={styles.headingContainer}>
            <CustomText
              fontFamily={Fonts.Medium}
              fontSize={RFValue(14)}
              style={styles.title}>
              Great, Let’s make Mynd all about you!
            </CustomText>
          </View>
          <GradientText
            titleA="How long have you been rocking this"
            titleB="world? "
            titleC="🎂"
            containerStyle={styles.maskedContainer}
          />
          <View style={styles.flatListContainer}>
            <FlatList
              data={Ages}
              numColumns={2}
              keyExtractor={item => item._id.toString()}
              renderItem={({item}) => (
                <View style={styles.itemWrapper}>
                  <MixedButton
                    title={item.title}
                    disabled={false}
                    loading={false}
                    onPress={() => onSelectAge(item)}
                    gradientColors={
                      ageId !== item._id ? inActiveGradientColor : gradientColor
                    }
                    textColor={ageId !== item._id ? '#4F5E7B' : '#FFFFFF'}
                    iconB={ageId === item._id && CheckMark}
                  />
                </View>
              )}
              columnWrapperStyle={styles.row}
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

export default OnBoardingC;

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
  maskedContainer: {
    marginTop: 10,
  },
  btn: {
    paddingHorizontal: 34,
    position: 'absolute',
    width: '100%',
    bottom: 0,
    paddingVertical: 15,
  },
  itemWrapper: {
    width: '50%',
    paddingHorizontal: 6,
    flexDirection: 'row',
  },
  row: {
    marginBottom: 12,
  },
  flatListContainer: {
    width: '100%',
    marginTop: 70,
  },
});
