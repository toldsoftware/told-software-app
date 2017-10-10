import * as notifications from './notifications/server';

exports[notifications.setExpoPushToken_name] = notifications.setExpoPushToken;
exports['testSendPushNotification'] = notifications.testSendPushNotification;
exports['testGetPushToken'] = notifications.testGetPushToken;