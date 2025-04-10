import {StatusBar} from 'react-native';
import React, {FC} from 'react';
import {useRoute} from '@react-navigation/native';
import {ROUTES} from '@navigation/Routes';
import {Colors} from '@utils/Constants';

const CustomStatusBar: FC = () => {
  const route = useRoute();

  const routeStatusBarConfig = {
    [ROUTES.SPLASH]: {
      barStyle: 'light-content' as 'light-content',
      backgroundColor: Colors.primary,
      hidden: true as boolean,
    },
    [ROUTES.CUSTOMERLOGIN]: {
      barStyle: 'dark-content' as 'dark-content',
      backgroundColor: '#ffffff',
      hidden: false as boolean,
    },
    [ROUTES.DELIVERYLOGIN]: {
      barStyle: 'dark-content' as 'dark-content',
      backgroundColor: '#FFFFFF',
      hidden: false as boolean,
    },
    [ROUTES.PROFILE]: {
      barStyle: 'dark-content' as 'dark-content',
      backgroundColor: '#FFFFFF',
      hidden: false as boolean,
    },
    [ROUTES.PRODUCTDASHBOARD]: {
      barStyle: 'light-content' as 'light-content',
      backgroundColor: 'rgba(54, 67, 92, 0.9)',
      hidden: false as boolean,
    },
    [ROUTES.DELIVERYDASHBOARD]: {
      barStyle: 'dark-content' as 'dark-content',
      backgroundColor: Colors.primary,
      hidden: false as boolean,
    },
    [ROUTES.PRODUCTCATEGORIES]: {
      barStyle: 'dark-content' as 'dark-content',
      backgroundColor: '#FFFFFF',
      hidden: false as boolean,
    },
    [ROUTES.PRODUCTORDER]: {
      barStyle: 'dark-content' as 'dark-content',
      backgroundColor: '#FFFFFF',
      hidden: false as boolean,
    },
    [ROUTES.ORDERSUCCESS]: {
      barStyle: 'dark-content' as 'dark-content',
      backgroundColor: '#FFFFFF',
      hidden: false as boolean,
    },
    [ROUTES.LIVETRACKING]: {
      barStyle: 'light-content' as 'light-content',
      backgroundColor: Colors.secondary,
      hidden: false as boolean,
    },
    [ROUTES.DELIVERYMAP]: {
      barStyle: 'dark-content' as 'dark-content',
      backgroundColor: Colors.primary,
      hidden: false as boolean,
    },
  };

  const currentScreenConfig = routeStatusBarConfig[
    route.name as keyof typeof routeStatusBarConfig
  ] || {
    barStyle: 'default',
    backgroundColor: 'transparent',
    hidden: false,
  };

  return (
    <StatusBar
      animated={true}
      barStyle={currentScreenConfig.barStyle}
      backgroundColor={currentScreenConfig.backgroundColor}
      translucent={true}
      hidden={currentScreenConfig?.hidden}
    />
  );
};

export default CustomStatusBar;
