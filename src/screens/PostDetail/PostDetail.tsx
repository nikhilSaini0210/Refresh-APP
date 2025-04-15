import React, {FC} from 'react';
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useRoute, RouteProp} from '@react-navigation/native';
import CustomSafeAreaView from '../../components/global/CustomSafeAreaView';
import BackButton from '../../components/ui/BackButton';
import CustomText from '../../components/ui/CustomText';
import {Post} from '../../service/post.service';
import {RFValue} from 'react-native-responsive-fontsize';
import {Fonts} from '../../utils/Constants';
import Icon from 'react-native-vector-icons/Ionicons';
import {UserData} from '../../service/auth.service';

const {width} = Dimensions.get('window');

type PostDetailRouteParams = {
  params: {
    postData: {
      post: Post;
      userInfo: UserData;
    };
  };
};

const PostDetail: FC = () => {
  const route = useRoute<RouteProp<PostDetailRouteParams, 'params'>>();
  const {postData} = route.params;

  const handleLike = () => {
    // Implement like functionality
  };

  const handleComment = () => {
    // Implement comment functionality
  };

  const handleShare = () => {
    // Implement share functionality
  };

  return (
    <CustomSafeAreaView>
      <View style={styles.container}>
        <BackButton />
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.container}>
          <View style={styles.userSection}>
            <Image
              source={{uri: postData.userInfo?.photoURL}}
              style={styles.userAvatar}
            />
            <View style={styles.userInfo}>
              <CustomText fontSize={RFValue(16)} fontFamily={Fonts.Medium}>
                {postData.userInfo?.displayName}
              </CustomText>
              <CustomText
                fontSize={RFValue(12)}
                fontFamily={Fonts.Regular}
                style={styles.timeText}>
                {/* Add timestamp formatting logic */}2 hours ago
              </CustomText>
            </View>
          </View>

          <Image
            source={{uri: postData.post.imageUrl}}
            style={styles.postImage}
            resizeMode="cover"
          />

          {postData.post.caption && (
            <View style={styles.captionContainer}>
              <CustomText
                fontSize={RFValue(14)}
                fontFamily={Fonts.Regular}
                style={styles.caption}>
                {postData.post.caption}
              </CustomText>
            </View>
          )}

          <View style={styles.actionButtons}>
            <TouchableOpacity onPress={handleLike} style={styles.actionButton}>
              <Icon name="heart-outline" size={24} color="#333" />
              <CustomText style={styles.actionText}>
                {postData.post.likes?.length || 0}
              </CustomText>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleComment}
              style={styles.actionButton}>
              <Icon name="chatbubble-outline" size={24} color="#333" />
              <CustomText style={styles.actionText}>
                {postData.post.comments?.length || 0}
              </CustomText>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
              <Icon name="share-outline" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <View style={styles.commentsSection}>
            <CustomText
              fontSize={RFValue(16)}
              fontFamily={Fonts.Medium}
              style={styles.commentsHeader}>
              Comments
            </CustomText>
            {postData.post.comments?.map((comment, index) => (
              <View key={index} style={styles.commentItem}>
                <Image
                  source={{uri: comment?.profileUri}}
                  style={styles.commentAvatar}
                />
                <View style={styles.commentContent}>
                  <CustomText fontSize={RFValue(14)} fontFamily={Fonts.Medium}>
                    {comment?.userName}
                  </CustomText>
                  <CustomText fontSize={RFValue(14)} fontFamily={Fonts.Regular}>
                    {comment.comment}
                  </CustomText>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userInfo: {
    marginLeft: 12,
  },
  timeText: {
    color: '#666',
    marginTop: 2,
  },
  postImage: {
    width: width,
    height: width,
    backgroundColor: '#f0f0f0',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  actionText: {
    marginLeft: 6,
    fontSize: RFValue(14),
    color: '#333',
  },
  captionContainer: {
    padding: 16,
  },
  caption: {
    lineHeight: 20,
  },
  commentsSection: {
    padding: 16,
  },
  commentsHeader: {
    marginBottom: 16,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  commentContent: {
    marginLeft: 12,
    flex: 1,
  },
});

export default PostDetail;
