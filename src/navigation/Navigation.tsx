import React, {FC} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {ROUTES} from './Routes';
import { navigationRef } from '@utils/NavigationUtils';
import SplashScreen from '@screens/Splash/SplashScreen';
import OnBoardingA from '@screens/OnBoadring/OnBoardingA';
import OnBoardingB from '@screens/OnBoadring/OnBoardingB';
import OnBoardingC from '@screens/OnBoadring/OnBoardingC';
import OnBoardingD from '@screens/OnBoadring/OnBoardingD';
import HomeScreen from '@screens/Home/HomeScreen';
import Comments from '@screens/Comments/Comments';

const Stack = createNativeStackNavigator();

// const SplashScreenWithStatusBar: FC = () => (
//   <>
//     <CustomStatusBar />
//     <SplashScreen />
//   </>
// );

// const ProductDashboardWithStatusBar: FC = () => (
//   <>
//     <CustomStatusBar />
//     <ProductDashboard />
//   </>
// );

// const ProductCategoriesWithStatusBar: FC = () => (
//   <>
//     <CustomStatusBar />
//     <ProductCategories />
//   </>
// );

// const ProductOrderWithStatusBar: FC = () => (
//   <>
//     <CustomStatusBar />
//     <ProductOrder />
//   </>
// );

// const DeliveryLoginWithStatusBar: FC = () => (
//   <>
//     <CustomStatusBar />
//     <DeliveryLogin />
//   </>
// );

// const CustomerLoginWithStatusBar: FC = () => (
//   <>
//     <CustomStatusBar />
//     <CustomerLogin />
//   </>
// );

// const DeliveryDashboardWithStatusBar: FC = () => (
//   <>
//     <CustomStatusBar />
//     <DeliveryDashboard />
//   </>
// );

// const OrderSuccessWithStatusBar: FC = () => (
//   <>
//     <CustomStatusBar />
//     <OrderSuccess />
//   </>
// );

// const LiveTrackingWithStatusBar: FC = () => (
//   <>
//     <CustomStatusBar />
//     <LiveTracking />
//   </>
// );

// const ProfileWithStatusBar: FC = () => (
//   <>
//     <CustomStatusBar />
//     <Profile />
//   </>
// );

// const DeliveryMapWithStatusBar: FC = () => (
//   <>
//     <CustomStatusBar />
//     <DeliveryMap />
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
        <Stack.Screen
          name={ROUTES.HOME}
          component={HomeScreen}
        />
        <Stack.Screen
          name={ROUTES.COMMENTS}
          component={Comments}
        />
        {/* <Stack.Screen
          name={ROUTES.ORDERSUCCESS}
          component={OrderSuccessWithStatusBar}
        /> */}
        {/* <Stack.Screen
          name={ROUTES.LIVETRACKING}
          component={LiveTrackingWithStatusBar}
        /> */}
        {/* <Stack.Screen name={ROUTES.PROFILE} component={ProfileWithStatusBar} /> */}
        {/* <Stack.Screen
          name={ROUTES.DELIVERYMAP}
          component={DeliveryMapWithStatusBar}
        /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
