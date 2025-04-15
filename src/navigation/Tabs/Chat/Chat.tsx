import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {FC, useCallback, useState} from 'react';
import CustomHeader from '../../../components/ui/CustomHeader';
import CustomInput from '../../../components/ui/CustomInput';
import authService, {UserData} from '../../../service/auth.service';
import {useAuth} from '../../../state/useAuth';
import SearchModal from '../../../components/ui/SearchModal';
import CustomKeyboardDismiss from '../../../components/global/CustomKeyboardDismiss';
import {navigate} from '../../../utils/NavigationUtils';
import {ROUTES} from '../../../navigation/Routes';
import chatsService, {LastChat} from '../../../service/chats.service';
import {Colors} from '../../../utils/Constants';
import { useFocusEffect } from '@react-navigation/native';

interface RecentUser extends UserData {
  timestamp: number;
}

const Chat: FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [allUsers, setAllUsers] = useState<UserData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(false);
  const {user} = useAuth();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [lastChats, setLastChats] = useState<LastChat[]>([]);

  const onClose = () => {
    setIsModalVisible(false);
  };

  const fetchLastChats = useCallback(async () => {
    setLoading(true);
    try {
      if (user?.id) {
        const chats = await chatsService.getLastChats(user.id);
        setLastChats(chats);
      }
    } catch (error: any) {
      console.error('Error fetching last chats:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const handleUserSelect = (selectedUser: UserData | RecentUser) => {
    const newRecentUser: RecentUser = {
      ...selectedUser,
      timestamp: Date.now(),
    };

    setRecentUsers(prev => {
      const filtered = prev.filter(u => u.id !== selectedUser.id);
      return [newRecentUser, ...filtered].slice(0, 5);
    });

    setIsModalVisible(false);
    setSearchQuery('');
    navigate(ROUTES.NEWMESAAGES, {item: selectedUser});
  };

  const fetchUsers = useCallback(async () => {
    try {
      if (user) {
        const users = await authService.getAllUsersExceptCurrentUser(user.id);
        setAllUsers(users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }, [user]);

  const handleSearch = (query: string) => {
    const trimmedQuery = query.trim();
    setSearchQuery(query);
    if (trimmedQuery.length === 0) {
      setFilteredUsers([]);
      return;
    }
    const filtered = allUsers.filter(u =>
      u.displayName.toLowerCase().startsWith(trimmedQuery.toLowerCase()),
    );
    setFilteredUsers(filtered);
  };

  const onNewMessage = (item: LastChat) => {
    const userData = {
      id: item.userId,
      displayName: item.userName,
      photoURL: item.userAvatar,
    };
    navigate(ROUTES.NEWMESAAGES, {item: userData});
  };

  const renderChatItem = ({item}: {item: LastChat}) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => onNewMessage(item)}>
      <Image
        source={
          item.userAvatar
            ? {uri: item.userAvatar}
            : require('../../../assets/images/user.png')
        }
        style={styles.avatar}
      />
      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={styles.userName}>{item.userName}</Text>
          <Text style={styles.timestamp}>
            {new Date(item.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.lastMessage}
        </Text>
      </View>
    </TouchableOpacity>
  );
  useFocusEffect(
    useCallback(() => {
      if (user) {
        fetchUsers();
        fetchLastChats();
      }
    }, [fetchUsers, fetchLastChats, user])
  );

  return (
    <CustomKeyboardDismiss>
      <View style={styles.container}>
        <CustomHeader title="Chats" />
        <View style={styles.searchContainer}>
          <CustomInput
            placeholder="Search users..."
            value={searchQuery}
            onChangeText={handleSearch}
            style={styles.searchInput}
            onFocus={() => setIsModalVisible(true)}
          />
        </View>
        {isModalVisible && (
          <SearchModal
            onClose={onClose}
            searchQuery={searchQuery}
            handleUserSelect={handleUserSelect}
            recentUsers={recentUsers}
            filteredUsers={filteredUsers}
          />
        )}

        <FlatList
          data={lastChats}
          renderItem={renderChatItem}
          keyExtractor={item => item.chatId}
          style={styles.chatList}
          ListEmptyComponent={<EmptyChatListComponent loading={loading} />}
        />
      </View>
    </CustomKeyboardDismiss>
  );
};

interface Props {
  loading: boolean;
}

const EmptyChatListComponent: FC<Props> = ({loading}) => (
  <View style={styles.emptyContainer}>
    {loading ? (
      <ActivityIndicator size="large" color={Colors.secondary} />
    ) : (
      <Text style={styles.emptyText}>No chats yet</Text>
    )}
  </View>
);

export default Chat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchInput: {
    marginHorizontal: 15,
    width: '92%',
  },
  searchContainer: {
    paddingHorizontal: 10,
  },
  chatList: {
    flex: 1,
    marginTop: 10,
  },
  chatItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  chatInfo: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
    marginRight: 50,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});
