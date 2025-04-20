import CustomSafeAreaView from '@components/global/CustomSafeAreaView';
import {TabButtons} from '@utils/DummyData';
import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import TabButton from './TabButton';
import Home from '@navigation/Tabs/Home/Home';
import Search from '@navigation/Tabs/Search/Search';
import Add from '@navigation/Tabs/Add/Add';
import Chat from '@navigation/Tabs/Chat/Chat';
import Profile from '@navigation/Tabs/Profile/Profile';
import LinearGradient from 'react-native-linear-gradient';
import {gradientColor} from '@utils/Constants';
import {RouteProp, useRoute} from '@react-navigation/native';
import useKeyboardVisibilityListener from '@utils/useKeyboardVisibilityListener';

type HomeScreenRouteParams = {
  params: {
    item: {tab: number};
  };
};

const HomeScreen = () => {
  const route = useRoute<RouteProp<HomeScreenRouteParams, 'params'>>();
  const rt = route?.params;
  const tab = rt ? rt.item.tab : 0;
  const [selectedTab, setSelectedTab] = useState(tab);
  const isKeyboardVisible = useKeyboardVisibilityListener();

  const onSelectTab = (t: any) => {
    setSelectedTab(t);
  };

  return (
    <CustomSafeAreaView>
      <View style={styles.container}>
        {selectedTab === 0 ? (
          <Home onPressTab={onSelectTab} />
        ) : selectedTab === 1 ? (
          <Search />
        ) : selectedTab === 2 ? (
          <Add />
        ) : selectedTab === 3 ? (
          <Chat />
        ) : (
          <Profile />
        )}
        {!isKeyboardVisible && (
          <LinearGradient
            colors={gradientColor}
            start={{x: 1, y: 1}}
            end={{x: 0, y: 1}}
            style={styles.bottomContainer}>
            {TabButtons.map(item => (
              <TabButton
                onPress={() => setSelectedTab(item._id)}
                item={item}
                key={item._id}
                selectedTab={selectedTab}
              />
            ))}
          </LinearGradient>
        )}
      </View>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    elevation: 10,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  logoutButton: {
    padding: 8,
  },
  logoutText: {
    color: '#E53935',
    fontWeight: '600',
  },
  profileSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImagePlaceholderText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#757575',
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
  },
  connectedAccountsSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  accountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  accountIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4285F4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  accountIcon: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  accountDetails: {
    flex: 1,
  },
  accountName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  accountStatus: {
    fontSize: 14,
    color: '#4CAF50',
  },
  homeButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  homeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;
