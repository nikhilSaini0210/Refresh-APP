import {Image, StyleSheet, View} from 'react-native';
import React, {FC} from 'react';
import {Comment} from '@service/post.service';
import {Colors, Fonts} from '@utils/Constants';
import CustomText from '@components/ui/CustomText';
import {UserData} from '@service/auth.service';

interface Props {
  comment: Comment;
  postUser: UserData;
}

const DisplayComments: FC<Props> = ({comment, postUser}) => {
  return (
    <View style={styles.commentContainer}>
      <View style={styles.content}>
        {postUser?.photoURL ? (
          <Image style={styles.image} source={{uri: postUser?.photoURL}} />
        ) : (
          <Image
            style={styles.image}
            source={require('@assets/images/user.png')}
          />
        )}

        <CustomText
          numberOfLine={1}
          fontFamily={Fonts.Regular}
          variant="h5"
          style={styles.textStyle}>
          {postUser?.displayName}
        </CustomText>
      </View>

      <View style={styles.commetSection}>
        <CustomText fontFamily={Fonts.Regular} variant="h5">
          {comment.comment}
        </CustomText>
      </View>
    </View>
  );
};

export default DisplayComments;

const styles = StyleSheet.create({
  commentContainer: {
    width: '100%',
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  content: {
    width: '100%',
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 50,
  },
  commetSection: {
    width: '100%',
    paddingBottom: 15,
    paddingHorizontal: 15,
    paddingLeft: 35,
  },
  textStyle: {
    paddingHorizontal: 10,
  },
});
