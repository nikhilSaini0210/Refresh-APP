import notifee, {AndroidStyle} from '@notifee/react-native';
import {noti_Action} from './notificationContants';

export const addBadgeCount = async () => {
  await notifee.setBadgeCount(1).then(() => console.log('Badge Count'));
};

export const displayNotification = async (
  title: string,
  message: string,
  image: string,
  categoryId: string,
) => {
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    // sound: 'notification.mp3',
  });

  await notifee.displayNotification({
    title: title,
    body: message,
    android: {
      channelId: channelId,
      // sound: 'notification.mp3',
      onlyAlertOnce: true,
      // smallIcon: 'ic_stat_name',
      style: {
        type: AndroidStyle.BIGPICTURE,
        picture: image || require('../assets/images/gallery.png'),
      },
      actions: [
        {
          title: 'Okay',
          pressAction: {
            id: categoryId,
            launchActivity: 'default',
          },
        },
      ],
    },
    ios: {
      categoryId: categoryId,
      attachments: [
        {
          url: image || require('../assets/images/gallery.png'),
          thumbnailHidden: false,
        },
      ],
      foregroundPresentationOptions: {
        badge: true,
        sound: true,
        banner: true,
        list: true,
      },
      // sound: 'notification.wav',
    },
  });
};

export const setCategories = async () => {
  await notifee.setNotificationCategories([
    {
      id: noti_Action.LIKE_POST,
      actions: [
        {
          id: noti_Action.LIKE_POST,
          title: 'Like Post',
          foreground: true,
        },
      ],
    },
    {
      id: noti_Action.LIKE_POST,
      actions: [
        {
          id: noti_Action.LIKE_POST,
          title: 'Comment on Post',
          foreground: true,
        },
      ],
    },
  ]);
};
