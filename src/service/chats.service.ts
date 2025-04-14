import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc,
  Timestamp,
  setDoc,
  where,
  getDoc,
} from '@react-native-firebase/firestore';
import {CollectionsType} from './config';
import {QuickReplies} from 'react-native-gifted-chat';

export interface User {
  _id: string;
  name?: string;
  avatar?: string;
}

export interface ReceiverUser {
  _id: string;
  name?: string;
  avatar?: string;
}

export interface ChatMessage {
  _id: string;
  text: string;
  createdAt: Date;
  senderId: string;
  receiverId: string;
  user: User;
  image?: string;
  video?: string;
  audio?: string;
  system?: boolean;
  sent?: boolean;
  received?: boolean;
  pending?: boolean;
  quickReplies?: QuickReplies;
  receiverUser: ReceiverUser;
}

export interface LastChat {
  chatId: string;
  lastMessage: string;
  timestamp: Date;
  userId: string;
  userName: string;
  userAvatar?: string;
  unreadCount: number;
}

class ChatService {
  private db = getFirestore();

  async addMessage(chatId: string, message: ChatMessage): Promise<void> {
    try {
      const chatRef = doc(this.db, `${CollectionsType.Chats}/${chatId}`);
      await setDoc(
        chatRef,
        {
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
          participants: [message.senderId, message.receiverId],
          participantNames: {
            [message.senderId]: message.user.name,
            [message.receiverId]: message.receiverUser.name,
          },
        },
        {merge: true},
      );

      const messagesRef = collection(
        this.db,
        `${CollectionsType.Chats}/${chatId}/${CollectionsType.Messages}`,
      );
      await addDoc(messagesRef, {
        ...message,
        createdAt: Timestamp.now(),
      });

      await this.updateChatDocument(chatId, message);
    } catch (error) {
      console.log('Error adding message:', error);
      throw error;
    }
  }

  async updateChatDocument(
    chatId: string,
    message: ChatMessage,
  ): Promise<void> {
    try {
      const lastChatRef = doc(
        this.db,
        `${CollectionsType.Chats}/${chatId}/${CollectionsType.LastChat}/lastmessage`,
      );

      await setDoc(
        lastChatRef,
        {
          lastMessage: message.text,
          lastMessageTimestamp: Timestamp.now(),
          participants: [message.senderId, message.receiverId],
          participantNames: {
            [message.senderId]: message.user.name,
            [message.receiverId]: message.receiverUser.name,
          },
          participantAvatars: {
            [message.senderId]: message.user.avatar,
            [message.receiverId]: message.receiverUser.avatar,
          },
        },
        {merge: true},
      );
    } catch (error) {
      console.error('Error updating chat document:', error);
      throw error;
    }
  }

  async getMessages(chatId: string): Promise<ChatMessage[]> {
    try {
      const messagesRef = collection(
        this.db,
        `${CollectionsType.Chats}/${chatId}/${CollectionsType.Messages}`,
      );
      const messagesQuery = query(messagesRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(messagesQuery);

      return snapshot.docs.map(snapshotDoc => ({
        _id: snapshotDoc.id,
        ...snapshotDoc.data(),
        createdAt: snapshotDoc.data().createdAt?.toDate() || new Date(),
      })) as ChatMessage[];
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  }

  async deleteMessage(chatId: string, messageId: string): Promise<void> {
    try {
      const messageRef = doc(
        this.db,
        `${CollectionsType.Chats}/${chatId}/${CollectionsType.Messages}/${messageId}`,
      );
      await deleteDoc(messageRef);
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  }

  async getLastChats(userId: string): Promise<LastChat[]> {
    try {
      const chatsRef = collection(this.db, CollectionsType.Chats);
      const chatQuery = query(
        chatsRef,
        where('participants', 'array-contains', userId),
      );

      const chatSnapshot = await getDocs(chatQuery);

      const lastChats: LastChat[] = [];

      for (const chatDoc of chatSnapshot.docs) {
        const lastChatRef = doc(
          this.db,
          `${CollectionsType.Chats}/${chatDoc.id}/${CollectionsType.LastChat}/lastmessage`,
        );

        const lastChatSnapshot = await getDoc(lastChatRef);

        if (lastChatSnapshot.exists) {
          const data = lastChatSnapshot.data();

          const otherUserId =
            data?.participants.find((id: string) => id !== userId) || '';
          lastChats.push({
            chatId: chatDoc.id,
            lastMessage: data?.lastMessage || '',
            timestamp: data?.lastMessageTimestamp?.toDate() || new Date(),
            userId: otherUserId,
            userName: data?.participantNames?.[otherUserId] || '',
            userAvatar: data?.participantAvatars?.[otherUserId] || '',
            unreadCount: data?.unreadCount?.[userId] || 0,
          });
        }
      }

      return lastChats.sort(
        (a, b) => b.timestamp.getTime() - a.timestamp.getTime(),
      );
    } catch (error) {
      console.error('Error details:', JSON.stringify(error, null, 2));
      throw error;
    }
  }
}

export default new ChatService();
