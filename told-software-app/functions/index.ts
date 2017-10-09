import * as expoPushNotification from './expo-push-notification';
import * as C from './config';

exports[C.setExpoPushToken_name] = expoPushNotification.setExpoPushToken;
exports['testSendPushNotification'] = expoPushNotification.testSendPushNotification;
exports['testGetPushToken'] = expoPushNotification.testGetPushToken;