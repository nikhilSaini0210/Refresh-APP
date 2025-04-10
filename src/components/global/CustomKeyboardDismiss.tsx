import {Keyboard, TouchableWithoutFeedback} from 'react-native';
import React, {FC, ReactNode} from 'react';

interface Props {
  children: ReactNode;
}

const CustomKeyboardDismiss: FC<Props> = ({children}) => {
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };
  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      {children}
    </TouchableWithoutFeedback>
  );
};

export default CustomKeyboardDismiss;
