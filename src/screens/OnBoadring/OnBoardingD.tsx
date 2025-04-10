import {Alert, StyleSheet, View} from 'react-native';
import React, {FC, useState} from 'react';
import {useRoute} from '@react-navigation/native';
import CustomSafeAreaView from '@components/global/CustomSafeAreaView';
import ProgressBar from '@components/onBoarding/ProgessBar';
import GradientText from '@components/ui/GradientText';
import GradientButton from '@components/ui/GradientButton';
import {Genders} from '@utils/DummyData';
import MixedButton from '@components/ui/MixedButton';
import {gradientColor, inActiveGradientColor} from '@utils/Constants';
import CheckMark from '@assets/images/ChackMark.png';
import {ROUTES} from '@navigation/Routes';
import {useAuth} from '@state/useAuth';
import authService from '@service/auth.service';
import {CollectionsType} from '@service/config';

interface RouteParams {
  userData: {
    name: string;
    age: string;
  };
}

const OnBoardingD: FC = () => {
  const route = useRoute();
  const [gender, setGender] = useState('');
  const [genderId, setGenderId] = useState<number | null>(null);
  const {user} = useAuth();
  const [loading, setLoading] = useState(false);

  const {userData: routeData} = route?.params as RouteParams;

  const onSelectGender = (item: any) => {
    setGenderId(item?._id);
    setGender(item?.title);
  };

  const onContinue = async () => {
    if (gender.length === 0) {
      Alert.alert('Please select your age.');
      return;
    }
    const userDate = {
      ...user,
      displayName: routeData.name,
      age: routeData.age,
      gender: gender,
    };

    try {
      setLoading(true);
      if (user) {
        await authService.updateUserDataInFirestore(
          user.id,
          userDate,
          ROUTES.HOME,
          CollectionsType.Users,
        );
      } else {
        Alert.alert('User is not logged in.');
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomSafeAreaView>
      <View style={styles.content}>
        <View style={styles.subContent}>
          <ProgressBar progress={100} pre={75} />
          <GradientText
            titleA="Choose the "
            titleB="identity"
            titleC=" that feels right for you?"
            containerStyle={styles.maskedContainer}
            titleStyleA={styles.titleStyleA}
            titleStyleC={styles.titleStyleA}
          />
          <View style={styles.flatListContainer}>
            {Genders.map(item => (
              <View key={item._id} style={styles.itemWrapper}>
                <MixedButton
                  title={item.title}
                  disabled={false}
                  loading={false}
                  onPress={() => onSelectGender(item)}
                  gradientColors={
                    genderId !== item._id
                      ? inActiveGradientColor
                      : gradientColor
                  }
                  textColor={genderId !== item._id ? '#4F5E7B' : '#FFFFFF'}
                  iconB={genderId === item._id && CheckMark}
                />
              </View>
            ))}
          </View>
        </View>
        <View style={styles.btn}>
          <GradientButton
            disabled={false}
            title="Continue"
            textColor="#FFF"
            loading={loading}
            onPress={onContinue}
          />
        </View>
      </View>
    </CustomSafeAreaView>
  );
};

export default OnBoardingD;

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  subContent: {
    paddingHorizontal: 34,
    marginTop: 30,
  },
  title: {
    color: '#312F2E',
    opacity: 0.7,
    textAlign: 'center',
  },
  maskedContainer: {
    marginTop: 70,
  },
  titleStyleA: {
    textTransform: 'capitalize',
    marginLeft: 1,
  },
  btn: {
    paddingHorizontal: 34,
    position: 'absolute',
    width: '100%',
    bottom: 0,
    paddingVertical: 15,
  },
  flatListContainer: {
    width: '100%',
    marginTop: 70,
  },
  itemWrapper: {
    flexDirection: 'row',
    marginBottom: 12,
  },
});
