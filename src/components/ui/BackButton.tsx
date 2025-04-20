import {StyleSheet, TouchableOpacity} from 'react-native';
import React, {FC} from 'react';
import {goBack} from '@utils/NavigationUtils';
import Icon from 'react-native-vector-icons/Ionicons';

interface Props {
  handleBackPress?: () => void;
}

const BackButton: FC<Props> = ({handleBackPress}) => {
  return (
    <TouchableOpacity
      style={styles.backButton}
      onPress={handleBackPress ? handleBackPress : goBack}>
      <Icon name="arrow-back" size={26} color="#000" />
    </TouchableOpacity>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  backButton: {
    width: 40,
    height: 60,
    marginHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
