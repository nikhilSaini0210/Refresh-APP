import React, {FC} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {ROUTES} from './Routes';
import {navigationRef} from '../utils/NavigationUtils';
import SplashScreen from '../screens/Splash/SplashScreen';
import OnBoardingA from '../screens/OnBoadring/OnBoardingA';
import OnBoardingB from '../screens/OnBoadring/OnBoardingB';
import OnBoardingC from '../screens/OnBoadring/OnBoardingC';
import OnBoardingD from '../screens/OnBoadring/OnBoardingD';
import HomeScreen from '../screens/Home/HomeScreen';
import Comments from '../screens/Comments/Comments';
import FollwerList from '../screens/FollwerList/FollwerList';
import NewMessages from '../screens/NewMessages/NewMessages';
import ImageView from '../screens/NewMessages/ImageView';
import ProfileVisit from '../screens/ProfileVisit/ProfileVisit';
import PostDetail from '../screens/PostDetail/PostDetail';

const Stack = createNativeStackNavigator();

// const SplashScreenWithStatusBar: FC = () => (
//   <>
//     <CustomStatusBar />
//     <SplashScreen />
//   </>
// );


const Navigation: FC = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName={ROUTES.SPLASH}>
        <Stack.Screen
          name={ROUTES.SPLASH}
          component={SplashScreen}
          options={{
            animation: 'fade',
          }}
        />
        <Stack.Screen
          name={ROUTES.ONBOARD_A}
          component={OnBoardingA}
          options={{
            animation: 'fade',
          }}
        />
        <Stack.Screen
          options={{
            animation: 'fade',
          }}
          name={ROUTES.ONBOARD_B}
          component={OnBoardingB}
        />
        <Stack.Screen
          options={{
            animation: 'fade',
          }}
          name={ROUTES.ONBOARD_C}
          component={OnBoardingC}
        />
        <Stack.Screen
          options={{
            animation: 'fade',
          }}
          name={ROUTES.ONBOARD_D}
          component={OnBoardingD}
        />
        <Stack.Screen name={ROUTES.HOME} component={HomeScreen} />
        <Stack.Screen name={ROUTES.COMMENTS} component={Comments} />
        <Stack.Screen name={ROUTES.FOLLOWERLIST} component={FollwerList} />
        <Stack.Screen name={ROUTES.NEWMESAAGES} component={NewMessages} />
        <Stack.Screen name={ROUTES.IMAGEVIEWER} component={ImageView} />
        <Stack.Screen name={ROUTES.PROFILEVISIT} component={ProfileVisit} />
        <Stack.Screen name={ROUTES.POST_DETAIL} component={PostDetail} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
