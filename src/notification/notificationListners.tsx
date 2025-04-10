import notifee, {EventType} from '@notifee/react-native';
import {noti_Action} from './notificationContants';

notifee.onForegroundEvent(({type, detail}) => {
  switch (type) {
    case EventType.ACTION_PRESS:
      if (detail.pressAction?.id === noti_Action.LIKE_POST) {
        console.log('LIKE ACTION ❤');
      }
      if (detail.pressAction?.id === noti_Action.COMMENT_POST) {
        console.log('COMMENT ACTION 💞');
      }
      break;
  }
});

notifee.onBackgroundEvent(async ({type, detail}) => {
  console.log(type);
  console.log(detail);
  if (
    type === EventType.ACTION_PRESS &&
    detail.pressAction?.id === noti_Action.LIKE_POST
  ) {
    console.log('LIKE ACTION BACKGROUND🥛');
  }
});
