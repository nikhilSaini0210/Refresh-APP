import {Image, StyleSheet, View} from 'react-native';
import React, {FC} from 'react';
import {Comment} from '@service/post.service';
import {Colors, Fonts} from '@utils/Constants';
import CustomText from '@components/ui/CustomText';

interface Props {
  comment: Comment;
}

const DisplayComments: FC<Props> = ({comment}) => {
  return (
    <View style={styles.commentContainer}>
      <View style={styles.content}>
        <Image
          style={styles.image}
          source={require('@assets/images/user.png')}
        />
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
  },
  commetSection: {
    width: '100%',
    paddingBottom: 15,
    paddingHorizontal: 15,
    paddingLeft: 35,
  },
});
