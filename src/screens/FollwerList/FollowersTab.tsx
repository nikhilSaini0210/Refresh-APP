import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {FC, useState} from 'react';
import CustomText from '../../components/ui/CustomText';
import authService, {UserData} from '../../service/auth.service';
import {Colors, Fonts} from '../../utils/Constants';

interface Props {
  dataList: UserData[];
  loading: boolean;
  setFollowers: React.Dispatch<React.SetStateAction<UserData[]>>;
  setFollowing: React.Dispatch<React.SetStateAction<UserData[]>>;
  isTab: 'followers' | 'following';
  setIsUpdateUser: React.Dispatch<React.SetStateAction<boolean>>;
  user: UserData;
}

const FollowersTab: FC<Props> = ({
  dataList,
  setFollowers,
  loading,
  setFollowing,
  isTab,
  setIsUpdateUser,
  user,
}) => {
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);

  const handleFollow = async (targetUserId: string) => {
    setLoadingUserId(targetUserId);
    try {
      if (user) {
        const updatedUser = await authService.followUser(user.id, targetUserId);
        if (updatedUser) {
          setIsUpdateUser(true);
          if (isTab === 'followers') {
            setFollowers(prev =>
              prev.map(u =>
                u.id === targetUserId
                  ? {...u, followers: [...(u.followers || []), user.id]}
                  : u,
              ),
            );
          } else if (isTab === 'following') {
            setFollowing(prev => [
              ...prev,
              {
                id: targetUserId,
                displayName: '',
                photoURL: '',
                followers: [],
                email: '',
                providerId: '',
              },
            ]);
          }
        }
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
        const updatedUser = await authService.unfollowUser(
          user.id,
          targetUserId,
        );
        if (updatedUser) {
          setIsUpdateUser(true);
          if (isTab === 'followers') {
            setFollowers(prev => prev);
          } else if (isTab === 'following') {
            setFollowing(prev => prev.filter(u => u.id !== targetUserId));
          }
        }
      }
    } catch (error) {
      console.error('Error unfollowing user:', error);
    } finally {
      setLoadingUserId(null);
    }
  };

  const renderUserItem = ({item}: {item: UserData}) => (
    <View style={styles.userContainer}>
      <View style={styles.userRow}>
        {item.photoURL ? (
          <Image source={{uri: item.photoURL}} style={styles.userImage} />
        ) : (
          <Image
            source={require('../../assets/images/user.png')}
            style={styles.userImage}
          />
        )}
        <CustomText fontFamily={Fonts.Medium} style={styles.userName}>
          {item.displayName}
        </CustomText>
      </View>
      {user?.following?.includes(item.id) ? (
        <TouchableOpacity
          style={styles.unfollowButton}
          onPress={() => handleUnfollow(item.id)}
          disabled={loadingUserId === item.id}>
          {loadingUserId === item.id ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <CustomText style={styles.buttonText}>Unfollow</CustomText>
          )}
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.followButton}
          onPress={() => handleFollow(item.id)}
          disabled={loadingUserId === item.id}>
          {loadingUserId === item.id ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <CustomText style={styles.buttonText}>Follow</CustomText>
          )}
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <FlatList
      data={dataList}
      keyExtractor={item => item.id}
      renderItem={renderUserItem}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <View style={[styles.emptyContainer]}>
          {loading ? (
            <ActivityIndicator size="large" color={Colors.secondary} />
          ) : (
            <CustomText>No Followers Found</CustomText>
          )}
        </View>
      }
    />
  );
};

export default FollowersTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    backgroundColor: Colors.primary,
  },
  tabIndicator: {
    backgroundColor: Colors.secondary,
  },
  tabLabel: {
    color: '#fff',
    fontFamily: Fonts.Medium,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    justifyContent: 'space-between',
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    color: Colors.text,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  followButton: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 5,
    width: '25%',
    justifyContent: 'center',
    alignItems: 'center',
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
    color: '#FFF',
    fontSize: 14,
  },
});
