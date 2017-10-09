"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const firebase_api_1 = require("./firebase-api");
const Expo = require("expo-server-sdk");
// https://docs.expo.io/versions/latest/guides/push-notifications.html
// Set User's Expo Push Token
exports.setExpoPushToken = functions.https.onRequest((request, response) => {
    const data = request.body;
    const d = { userKey: data.user.userKey, expoPushToken: data.token.value };
    firebase_api_1.firestore.collection('expo-push-tokens').add(d);
    response.send(true);
});
// Send Push Notification
exports.testSendPushNotification = functions.https.onRequest((request, response) => __awaiter(this, void 0, void 0, function* () {
    yield exports.sendPushNotifications([{
            to: { userKey: '38Ejs81bZNV7CU5HDeUXKr38m052' },
            body: 'This is a simple push message',
        }]);
    response.send(true);
}));
exports.testGetPushToken = functions.https.onRequest((request, response) => __awaiter(this, void 0, void 0, function* () {
    const pushToken = yield getPushToken({ userKey: '38Ejs81bZNV7CU5HDeUXKr38m052' });
    response.send(`pushToken: '${pushToken}'`);
}));
const getPushToken = (to) => __awaiter(this, void 0, void 0, function* () {
    let pushToken = to.pushToken;
    if (!pushToken) {
        const result = yield firebase_api_1.firestore.collection('expo-push-tokens').where('userKey', '==', to.userKey).get();
        result.forEach(doc => pushToken = doc.data().expoPushToken);
    }
    if (!pushToken) {
        console.error(`Push Token not found for UserKey ${to.userKey}`);
        return null;
    }
    return pushToken;
});
exports.sendPushNotifications = (expoMessages) => __awaiter(this, void 0, void 0, function* () {
    // Create a new Expo SDK client
    let expo = new Expo();
    // Create the messages that you want to send to clents
    let messages = [];
    for (let { to, body, data, sound } of expoMessages) {
        const pushToken = yield getPushToken(to);
        // Check that all your push tokens appear to be valid Expo push tokens
        if (!Expo.isExpoPushToken(pushToken)) {
            console.error(`Push token ${pushToken} is not a valid Expo push token`);
            continue;
        }
        // Construct a message (see https://docs.expo.io/versions/latest/guides/push-notifications.html)
        messages.push({
            to: pushToken,
            sound: sound || 'default',
            body,
            data,
        });
    }
    // The Expo push notification service accepts batches of notifications so
    // that you don't need to send 1000 requests to send 1000 notifications. We
    // recommend you batch your notifications to reduce the number of requests
    // and to compress them (notifications with similar content will get
    // compressed).
    let chunks = expo.chunkPushNotifications(messages);
    (() => __awaiter(this, void 0, void 0, function* () {
        // Send the chunks to the Expo push notification service. There are
        // different strategies you could use. A simple one is to send one chunk at a
        // time, which nicely spreads the load out over time:
        for (let chunk of chunks) {
            try {
                let receipts = yield expo.sendPushNotificationsAsync(chunk);
                console.log(receipts);
            }
            catch (error) {
                console.error(error);
            }
        }
    }))();
});
