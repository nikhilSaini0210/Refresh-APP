import {Image, StyleSheet, View, TouchableOpacity} from 'react-native';
import React, {FC} from 'react';
import {Comment} from '@service/post.service';
import {Colors, Fonts} from '@utils/Constants';
import CustomText from '@components/ui/CustomText';
import {UserData} from '@service/auth.service';
import Icon from 'react-native-vector-icons/Ionicons';
import {navigate} from '@utils/NavigationUtils';
import {ROUTES} from '@navigation/Routes';

interface Props {
  comment: Comment;
  postUser: UserData;
  onDelete?: () => void;
}

const DisplayComments: FC<Props> = ({comment, postUser, onDelete}) => {
  const onUser = () => {
    if (comment) {
      navigate(ROUTES.PROFILEVISIT, {item: comment.userId});
    }
  };

  return (
    <View style={styles.commentContainer}>
      <View style={styles.content}>
        <TouchableOpacity style={styles.btn} onPress={onUser}>
          {postUser?.photoURL ? (
            <Image style={styles.image} source={{uri: postUser?.photoURL}} />
          ) : (
            <Image
              style={styles.image}
              source={require('../../assets/images/user.png')}
            />
          )}

          <CustomText
            numberOfLine={1}
            fontFamily={Fonts.Regular}
            variant="h5"
            style={styles.textStyle}>
            {postUser?.displayName}
          </CustomText>
        </TouchableOpacity>
        {onDelete && (
          <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
            <Icon name="trash-outline" size={16} color="#FF3B30" />
          </TouchableOpacity>
        )}
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
    paddingVertical: 15,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
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
  deleteButton: {
    padding: 8,
    position: 'absolute',
    right: 0,
    top: 0,
  },
});
