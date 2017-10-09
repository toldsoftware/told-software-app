import * as functions from 'firebase-functions';
import { firestore } from './firebase-api';
import { SetExpoPushToken_RequestBody } from "./config";

import * as Expo from 'expo-server-sdk';

interface UserExpoPushToken {
    userKey: string;
    expoPushToken: string;
}

// https://docs.expo.io/versions/latest/guides/push-notifications.html

// Set User's Expo Push Token
export const setExpoPushToken = functions.https.onRequest((request, response) => {
    const data = request.body as SetExpoPushToken_RequestBody;
    const d: UserExpoPushToken = { userKey: data.user.userKey, expoPushToken: data.token.value };
    firestore.collection('expo-push-tokens').add(d);
    response.send(true);
});

// Send Push Notification
export const testSendPushNotification = functions.https.onRequest(async (request, response) => {
    await sendPushNotifications([{
        to: { userKey: '38Ejs81bZNV7CU5HDeUXKr38m052' },
        body: 'This is a simple push message',
    }]);
    response.send(true);
});

export const testGetPushToken = functions.https.onRequest(async (request, response) => {
    const pushToken = await getPushToken({ userKey: '38Ejs81bZNV7CU5HDeUXKr38m052' });
    response.send(`pushToken: '${pushToken}'`);
});

const getPushToken = async (to: { pushToken?: string, userKey?: string }) => {
    let pushToken = to.pushToken;

    if (!pushToken) {
        const result = await firestore.collection('expo-push-tokens').where('userKey', '==', to.userKey).get();
        result.forEach(doc => pushToken = (doc.data() as UserExpoPushToken).expoPushToken);
    }

    if (!pushToken) {
        console.error(`Push Token not found for UserKey ${to.userKey}`);
        return null;
    }

    return pushToken;
};

export const sendPushNotifications = async (expoMessages: { to: { pushToken?: string, userKey?: string }, body: string, data?: any, sound?: string }[]) => {

    // Create a new Expo SDK client
    let expo = new Expo();

    // Create the messages that you want to send to clents
    let messages = [];
    for (let { to, body, data, sound } of expoMessages) {

        const pushToken = await getPushToken(to);

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
        })
    }

    // The Expo push notification service accepts batches of notifications so
    // that you don't need to send 1000 requests to send 1000 notifications. We
    // recommend you batch your notifications to reduce the number of requests
    // and to compress them (notifications with similar content will get
    // compressed).
    let chunks = expo.chunkPushNotifications(messages);

    (async () => {
        // Send the chunks to the Expo push notification service. There are
        // different strategies you could use. A simple one is to send one chunk at a
        // time, which nicely spreads the load out over time:
        for (let chunk of chunks) {
            try {
                let receipts = await expo.sendPushNotificationsAsync(chunk);
                console.log(receipts);
            } catch (error) {
                console.error(error);
            }
        }
    })();

};