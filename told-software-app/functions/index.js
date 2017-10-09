"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expoPushNotification = require("./expo-push-notification");
const C = require("./config");
exports[C.setExpoPushToken_name] = expoPushNotification.setExpoPushToken;
exports['testSendPushNotification'] = expoPushNotification.testSendPushNotification;
exports['testGetPushToken'] = expoPushNotification.testGetPushToken;
