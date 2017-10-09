import * as functions from 'firebase-functions';
import { firestore } from './firebase-api';
import { SetExpoPushToken_RequestBody } from "./config";

export const setExpoPushToken = functions.https.onRequest((request, response) => {
    firestore.collection('expo-push-tokens').add(request.body as SetExpoPushToken_RequestBody);
    response.send(true);
});
