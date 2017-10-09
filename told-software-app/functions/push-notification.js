"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const firebase_api_1 = require("./firebase-api");
const config_1 = require("./config");
exports.pushNotification_SetPushToken_Url = config_1.rootUrl + '/setPushToken';
exports.setPushToken = functions.https.onRequest((request, response) => {
    firebase_api_1.firestore.collection('expo-push-tokens').add(request.body);
    response.send(true);
});
