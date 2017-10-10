import * as notifications from "../../../common/notifications/server";

exports[notifications.setExpoPushToken_name] = notifications.setExpoPushToken;
exports['testSendPushNotification'] = notifications.testSendPushNotification;
exports['testGetPushToken'] = notifications.testGetPushToken;