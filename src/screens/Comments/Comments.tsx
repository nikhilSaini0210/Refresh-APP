import {
  Alert,
  FlatList,
  Image,
  Keyboard,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import 'firebase/firestore';
import {useRoute} from '@react-navigation/native';
import postService, {Comment, Post} from '@service/post.service';
import CustomSafeAreaView from '@components/global/CustomSafeAreaView';
import CustomHeader from '@components/ui/CustomHeader';
import {Colors} from '@utils/Constants';
import CustomKeyboardDismiss from '@components/global/CustomKeyboardDismiss';
import {useAuth} from '@state/useAuth';
import {v4 as uuidv4} from 'uuid';
import DisplayComments from './DisplayComments';

const Comments = () => {
  const route = useRoute();
  const params = route.params as {postData: Post} | undefined;
  const postData = params?.postData;
  const [comment, setComment] = useState('');
  const {user} = useAuth();

  const postComment = async () => {
    Keyboard.dismiss();
    if (comment.trim() === '') {
      return;
    }
    if (user && postData) {
      const uid = uuidv4();
      const newComment: Comment = {
        commentId: uid,
        comment: comment,
        userId: user.id,
        timestamp: Date.now().toString(),
      };

      try {
        await postService.addComment(postData.id, newComment);
        setComment('');
      } catch (error) {
        Alert.alert('Error', 'Failed to post comment.');
      }
    } else {
      Alert.alert('Login', 'Please login to post a comment.');
    }
  };

  return (
    <CustomSafeAreaView>
      <CustomKeyboardDismiss>
        <View style={styles.container}>
          <CustomHeader title="Comments" />
          <FlatList
            data={postData?.comments || []}
            keyExtractor={item => item.commentId}
            renderItem={({item}) => <DisplayComments comment={item} />}
          />
          <View style={styles.bottomContent}>
            <TextInput
              style={styles.textInput}
              placeholder="type comment here..."
              placeholderTextColor={Colors.border}
              cursorColor={Colors.text}
              onChangeText={setComment}
              value={comment}
            />
            <TouchableOpacity
              disabled={comment.length === 0}
              onPress={postComment}>
              <Image
                source={require('@assets/images/send.png')}
                style={styles.send}
              />
            </TouchableOpacity>
          </View>
        </View>
      </CustomKeyboardDismiss>
    </CustomSafeAreaView>
  );
};

export default Comments;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomContent: {
    width: '100%',
    height: 60,
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    alignItems: 'center',
    flexDirection: 'row',
  },
  textInput: {
    width: '80%',
  },
  send: {
    width: 30,
    height: 30,
  },
});
