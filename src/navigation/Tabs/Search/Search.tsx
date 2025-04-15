import {
  FlatList,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {FC, useCallback, useEffect, useState} from 'react';
import authService, {UserData} from '../../../service/auth.service';
import {useAuth} from '../../../state/useAuth';
import CustomText from '../../../components/ui/CustomText';
import {Colors, Fonts} from '../../../utils/Constants';
import CustomHeader from '../../../components/ui/CustomHeader';
import CustomInput from '../../../components/ui/CustomInput';
import {RFValue} from 'react-native-responsive-fontsize';
import {displayNotification} from '../../../notification/notificationInitial';
import {noti_Action} from '../../../notification/notificationContants';
import {navigate} from '../../../utils/NavigationUtils';
import {ROUTES} from '../../../navigation/Routes';

const Search: FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [allUsers, setAllUsers] = useState<UserData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);
  const {user} = useAuth();

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

  const handleFollow = async (targetUserId: string) => {
    setLoadingUserId(targetUserId);
    try {
      if (user) {
        const res = await authService.followUser(user.id, targetUserId);
        if (res) {
          setCurrentUser(res);
          await displayNotification(
            user?.displayName,
            `You started following ${res.displayName}`,
            user?.photoURL || require('../../../assets/images/user.png'),
            noti_Action.FOLLOW,
          );
        }
        fetchUsers();
      }
    } catch (error) {
      console.error('Error following user:', error);
    } finally {
      setLoadingUserId(null);
    }
  };

  const handleUnfollow = async (targetUserId: string) => {
    setLoadingUserId(targetUserId);
    try {
      if (user) {
        const res = await authService.unfollowUser(user.id, targetUserId);
        if (res) {
          setCurrentUser(res);
        }
        fetchUsers();
      }
    } catch (error) {
      console.error('Error unfollowing user:', error);
    } finally {
      setLoadingUserId(null);
    }
  };

  const isFollowing = (targetUserId: string) => {
    return currentUser?.following?.includes(targetUserId);
  };

  const goToProfile = (item: UserData) => {
    navigate(ROUTES.PROFILEVISIT, {item: item});
  };

  useEffect(() => {
    fetchUsers();
    if (user) {
      setCurrentUser(user);
    }
  }, [fetchUsers, user]);

  return (
    <View style={styles.container}>
      <CustomHeader title="Search" />
      <View style={styles.searchContainer}>
        <CustomInput
          placeholder="Search users..."
          value={searchQuery}
          onChangeText={handleSearch}
          style={styles.searchInput}
        />
      </View>
      <FlatList
        data={filteredUsers}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flistContent}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.userContainer}
            onPress={() => goToProfile(item)}>
            <View style={styles.userRow}>
              {item.photoURL ? (
                <Image source={{uri: item.photoURL}} style={styles.userImage} />
              ) : (
                <Image
                  source={require('../../../assets/images/user.png')}
                  style={styles.userImage}
                />
              )}
              <CustomText
                fontFamily={Fonts.Medium}
                variant="h4"
                style={styles.userName}>
                {item.displayName}
              </CustomText>
            </View>
            {isFollowing(item.id) ? (
              <TouchableOpacity
                style={styles.unfollowButton}
                onPress={() => handleUnfollow(item.id)}
                disabled={loadingUserId === item.id}>
                {loadingUserId === item.id ? (
                  <ActivityIndicator size={'small'} color={'#FFF'} />
                ) : (
                  <CustomText
                    fontFamily={Fonts.Medium}
                    fontSize={RFValue(12)}
                    style={styles.buttonText}>
                    Unfollow
                  </CustomText>
                )}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.followButton}
                onPress={() => handleFollow(item.id)}
                disabled={loadingUserId === item.id}>
                {loadingUserId === item.id ? (
                  <ActivityIndicator size={'small'} color={'#FFF'} />
                ) : (
                  <CustomText
                    fontFamily={Fonts.Medium}
                    fontSize={RFValue(14)}
                    style={styles.buttonText}>
                    Follow
                  </CustomText>
                )}
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <CustomText
              fontFamily={Fonts.Regular}
              variant="h6"
              style={styles.emptyText}>
              No users found.
            </CustomText>
          </View>
        }
      />
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    marginHorizontal: 15,
    width: '92%',
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    color: Colors.text,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#999',
  },
  searchContainer: {
    paddingHorizontal: 10,
  },
  followButton: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: '25%',
  },
  unfollowButton: {
    backgroundColor: Colors.secondary,
    padding: 10,
    borderRadius: 5,
    width: '25%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
  },
  flistContent: {
    paddingBottom: 100,
  },
});
