import {Image, StyleSheet, TextInput, View} from 'react-native';
import React, {FC} from 'react';
import {RFValue} from 'react-native-responsive-fontsize';
import {Colors, Fonts} from '@utils/Constants';

interface Props {
  imageData: string | null;
}

const UploadImageView: FC<Props & React.ComponentProps<typeof TextInput>> = ({
  imageData,
  ...props
}) => {
  return (
    <View style={styles.container}>
      {imageData !== null ? (
        <Image source={{uri: imageData}} style={styles.image} />
      ) : (
        <Image
          source={require('@assets/images/photo.png')}
          style={styles.image}
        />
      )}
      <TextInput
        {...props}
        multiline={true}
        placeholder="Type Caption here..."
        style={styles.textInput}
        textAlignVertical="top"
        cursorColor={Colors.text}
      />
    </View>
  );
};

export default UploadImageView;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 150,
    alignSelf: 'center',
    marginTop: 20,
    borderRadius: 10,
    borderColor: '#8E8E8E',
    borderWidth: 0.2,
    flexDirection: 'row',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 10,
    margin: 10,
  },
  textInput: {
    flex: 1,
    padding: 10,
    fontSize: RFValue(13),
    fontFamily: Fonts.Medium,
    color: Colors.text,
  },
});
