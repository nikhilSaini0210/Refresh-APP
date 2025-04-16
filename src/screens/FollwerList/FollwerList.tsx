import React, {FC, useState, useEffect, useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {TabView, TabBar} from 'react-native-tab-view';
import CustomSafeAreaView from '@components/global/CustomSafeAreaView';
import CustomHeader from '@components/ui/CustomHeader';
import CustomText from '@components/ui/CustomText';
import {Colors, Fonts} from '@utils/Constants';
import authService, {UserData} from '@service/auth.service';
import {useAuth} from '@state/useAuth';
import FollowersTab from './FollowersTab';

const FollwerList: FC = () => {
  const {user, setIsUpdateUser} = useAuth();
  const [followers, setFollowers] = useState<UserData[]>([]);
  const [following, setFollowing] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(false);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'followers', title: 'Followers', id: 0},
    {key: 'following', title: 'Following', id: 1},
  ]);

  const fetchFollowersAndFollowing = useCallback(async () => {
    if (user) {
      setLoading(true);
      try {
        const allUsers = await authService.getAllUsers();
        const userFollowers = allUsers.filter(u =>
          user.followers?.includes(u.id),
        );
        const userFollowing = allUsers.filter(u =>
          user.following?.includes(u.id),
        );
        setFollowers(userFollowers);
        setFollowing(userFollowing);
      } catch (error) {
        console.error('Error fetching followers and following:', error);
      } finally {
        setLoading(false);
      }
    }
  }, [user]);

  const renderScene = ({route}: {route: {key: string}}) => {
    switch (route.key) {
      case 'followers':
        return (
          <FollowersTab
            dataList={followers}
            loading={loading}
            setFollowing={setFollowers}
            setFollowers={setFollowing}
            isTab={route.key}
            setIsUpdateUser={setIsUpdateUser}
            user={user!}
          />
        );
      case 'following':
        return (
          <FollowersTab
            dataList={following}
            loading={loading}
            setFollowing={setFollowing}
            setFollowers={setFollowers}
            isTab={route.key}
            setIsUpdateUser={setIsUpdateUser}
            user={user!}
          />
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    if (user) {
      fetchFollowersAndFollowing();
    }
  }, [fetchFollowersAndFollowing, user]);

  return (
    <CustomSafeAreaView>
      <View style={styles.container}>
        <CustomHeader title="Followers & Following" left={true} />
        <TabView
          navigationState={{index, routes}}
          renderScene={renderScene}
          onIndexChange={setIndex}
          renderTabBar={props => (
            <TabBar
              {...props}
              indicatorStyle={styles.tabIndicator}
              style={styles.tabBar}
              renderLabel={({
                route,
                focused,
              }: {
                route: {key: string; title: string};
                focused: boolean;
              }) => {
                const color = focused ? Colors.secondary : '#fff';
                return (
                  <CustomText style={[styles.tabLabel, {color: color}]}>
                    {route.title}
                  </CustomText>
                );
              }}
              activeColor={Colors.secondary}
              inactiveColor="#fff"
            />
          )}
        />
      </View>
    </CustomSafeAreaView>
  );
};

export default FollwerList;

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
  },
  followButton: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unfollowButton: {
    backgroundColor: Colors.secondary,
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 14,
  },
});
