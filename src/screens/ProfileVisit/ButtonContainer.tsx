import {StyleSheet, View} from 'react-native';
import React, {FC} from 'react';
import GradientButton from '@components/ui/GradientButton';

interface Props {
  onMessage: () => void;
  onPress: () => void;
  isFollow: boolean;
  loading: boolean;
}

const ButtonContainer: FC<Props> = ({
  onMessage,
  onPress,
  isFollow,
  loading,
}) => {
  return (
    <View style={styles.buttonContainer}>
      <GradientButton
        textColor="#FFF"
        title={isFollow ? 'Unfollow' : 'Follow'}
        btnStyle={styles.button}
        loading={loading}
        disabled={false}
        onPress={onPress}
      />
      <GradientButton
        textColor="#FFF"
        title="Message"
        btnStyle={styles.button}
        onPress={onMessage}
        loading={false}
        disabled={false}
      />
    </View>
  );
};

export default ButtonContainer;

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
    alignSelf: 'center',
  },
  button: {
    width: '45%',
  },
});
