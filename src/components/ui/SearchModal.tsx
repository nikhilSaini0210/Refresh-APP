import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {FC} from 'react';
import {UserData} from '@service/auth.service';

interface RecentUser extends UserData {
  timestamp: number;
}

interface Peops {
  onClose: () => void;
  searchQuery: string;
  filteredUsers: UserData[];
  recentUsers: RecentUser[];
  handleUserSelect: (item: UserData | RecentUser) => void;
}

const SearchModal: FC<Peops> = ({
  onClose,
  searchQuery,
  filteredUsers,
  recentUsers,
  handleUserSelect,
}) => {
  const renderUserItem = ({item}: {item: UserData | RecentUser}) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => handleUserSelect(item)}>
      <Image
        source={
          item.photoURL
            ? {uri: item.photoURL}
            : require('@assets/images/user.png')
        }
        style={styles.avatar}
      />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.displayName}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {searchQuery.length > 0 ? (
            <FlatList
              data={filteredUsers}
              renderItem={renderUserItem}
              keyExtractor={item => item.id}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No users found</Text>
              }
            />
          ) : (
            <>
              <Text style={styles.sectionTitle}>Recent Searches</Text>
              <FlatList
                data={recentUsers}
                renderItem={renderUserItem}
                keyExtractor={item => item.id}
                ListEmptyComponent={
                  <Text style={styles.emptyText}>No recent searches</Text>
                }
              />
            </>
          )}
        </View>
      </View>
  );
};

export default SearchModal;

const styles = StyleSheet.create({
  modalContainer: {
    paddingHorizontal: 15,
  },
  modalContent: {
    height: '70%',
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 15,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 15,
  },
  closeButton: {
    padding: 10,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#666',
  },
  userItem: {
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
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    marginLeft: 15,
  },
  emptyText: {
    textAlign: 'center',
    padding: 20,
    color: '#666',
  },
});
