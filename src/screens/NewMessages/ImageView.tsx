import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import CustomSafeAreaView from '@components/global/CustomSafeAreaView';
import {RouteProp, useRoute} from '@react-navigation/native';
import {goBack} from '@utils/NavigationUtils';
import Icon from 'react-native-vector-icons/Ionicons';

interface RouteParams extends Record<string, object | undefined> {
  params: {
    item: any;
  };
}

const {width, height} = Dimensions.get('window');

const ImageView = () => {
  const route = useRoute<RouteProp<RouteParams, 'params'>>();
  const {item} = route.params;

  return (
    <CustomSafeAreaView>
      <View style={styles.container}>
        <Image
          source={{uri: item}}
          style={styles.fullScreenImage}
          resizeMode="contain"
        />
        <TouchableOpacity style={styles.backButton} onPress={() => goBack()}>
          <Icon name="arrow-back" size={26} color="#FFF" />
        </TouchableOpacity>
      </View>
    </CustomSafeAreaView>
  );
};

export default ImageView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 15,
    width: 40,
    height: 40,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
  },
  fullScreenImage: {
    width: width,
    height: height,
  },
});
