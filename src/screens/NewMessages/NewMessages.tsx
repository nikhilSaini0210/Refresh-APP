import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {FC, useCallback, useEffect, useState} from 'react';
import {GiftedChat, Send} from 'react-native-gifted-chat';
import CustomSafeAreaView from '../../components/global/CustomSafeAreaView';
import {useRoute, RouteProp} from '@react-navigation/native';
import {useAuth} from '../../state/useAuth';
import chaService, {ChatMessage} from '../../service/chats.service';
import {Asset} from 'react-native-image-picker';
import {selectFromGallery, takePhoto} from '../../service/imagePicker';
import ActivityLoaderModal from '../../components/global/ActivityLoaderModal';
import {uploadToS3} from '../../service/uploadToS3';
import CustomHeader from '../../components/ui/CustomHeader';
import {navigate} from '../../utils/NavigationUtils';
import {ROUTES} from '../../navigation/Routes';

interface RouteParams extends Record<string, object | undefined> {
  params: {
    item: any;
  };
}

const NewMessages: FC = () => {
  const route = useRoute<RouteProp<RouteParams, 'params'>>();
  const {item} = route.params;
  const {user} = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [image, setImage] = useState<string | null>(null);
  const [imageData, setImageData] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  const toggleModal = (uri: string | null) => {
    navigate(ROUTES.IMAGEVIEWER, {item: uri});
  };

  const getMessages = useCallback(async () => {
    setIsLoadingMessages(true);
    try {
      if (user?.id && item?.id) {
        const chatId = generateChatId(user.id, item.id);
        const response = await chaService.getMessages(chatId);
        if (response) {
          setMessages(response);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingMessages(false);
    }
  }, [user?.id, item?.id]);

  const handleImageSelection = async (type: 'camera' | 'gallery') => {
    Keyboard.dismiss();
    setLoading(true);
    setImage(null);
    setImageData(null);
    try {
      let selectedImage: Asset | null;

      if (type === 'camera') {
        selectedImage = await takePhoto();
      } else {
        selectedImage = await selectFromGallery();
      }

      if (selectedImage && selectedImage.uri) {
        setImageData(selectedImage);
        const imageUri = await uploadToS3(
          selectedImage.uri,
          selectedImage.fileName,
          selectedImage.type,
        );
        setImage(imageUri);
      }
    } catch (error) {
      console.error('Error selecting image:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSend = useCallback(
    async (newMessages: any) => {
      if (!user) {
        Alert.alert('Please login first.');
        return;
      }
      const msg = newMessages[0];
      const updateUser = msg.user;
      const currentUser = {
        ...updateUser,
        name: user?.displayName,
        avatar: user?.photoURL,
      };
      const receiverUser = {
        id: item?.id,
        name: item?.displayName,
        avatar: item?.photoURL,
      };
      const updatedMsg = {
        ...msg,
        receiverUser: receiverUser,
        user: currentUser,
        senderId: user.id,
        receiverId: item.id,
        image: image,
      };

      try {
        const chatId = generateChatId(user.id, item.id);
        setMessages(previousMessages =>
          GiftedChat.append(previousMessages, updatedMsg),
        );
        await chaService.addMessage(chatId, updatedMsg);
        setImage(null);
        setImageData(null);
      } catch (error) {
        console.error('Error sending message:', error);
        Alert.alert('Failed to send message. Please try again.');
      }
    },
    [image, item?.displayName, item.id, item?.photoURL, user],
  );

  useEffect(() => {
    if (user) {
      getMessages();
    }
  }, [user, getMessages]);

  const renderMessageImage = (props: any) => {
    return (
      <TouchableOpacity onPress={() => toggleModal(props.currentMessage.image)}>
        <View style={styles.messageImageContainer}>
          <Image
            source={{uri: props.currentMessage.image}}
            style={styles.messageImage}
            resizeMode="cover"
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <CustomSafeAreaView>
      <View style={styles.container}>
        <CustomHeader
          title={item?.displayName ?? 'User'}
          profileImage={item?.photoURL ? item?.photoURL : 'User'}
          left={true}
        />
        <GiftedChat
          messages={messages}
          onSend={newMessages => onSend(newMessages)}
          user={{
            _id: user?.id ?? '',
          }}
          alwaysShowSend
          renderSend={props => {
            return (
              <View style={styles.sendContainer}>
                <TouchableOpacity
                  style={styles.customButton}
                  onPress={() => handleImageSelection('gallery')}>
                  {imageData ? (
                    <Image
                      source={{uri: imageData.uri}}
                      style={styles.sendImage}
                    />
                  ) : (
                    <Image
                      source={require('../../assets/images/add-image.png')}
                      style={styles.sendImage}
                    />
                  )}
                </TouchableOpacity>
                <Send {...props} containerStyle={styles.sendButton}>
                  <Image
                    source={require('../../assets/images/send.png')}
                    style={styles.sendImage}
                  />
                </Send>
              </View>
            );
          }}
          renderMessageImage={renderMessageImage}
          isLoadingEarlier={isLoadingMessages}
          renderLoading={() => (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          )}
        />
        <ActivityLoaderModal visible={loading} />
      </View>
    </CustomSafeAreaView>
  );
};

export default NewMessages;

const generateChatId = (userId1: string, userId2: string): string => {
  const sortedIds = [userId1, userId2].sort();
  return `${sortedIds[0]}_${sortedIds[1]}`;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  sendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sendButton: {
    justifyContent: 'center',
    marginRight: 10,
  },
  sendImage: {
    width: 30,
    height: 30,
    borderRadius: 5,
  },
  customButton: {
    marginRight: 10,
  },
  messageImageContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    margin: 5,
  },
  messageImage: {
    width: 200,
    height: 200,
  },
  messageVideoContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    margin: 5,
  },
  messageVideo: {
    width: 200,
    height: 200,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});
