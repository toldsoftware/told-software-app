"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const firebase_api_1 = require("./firebase-api");
exports.setExpoPushToken = functions.https.onRequest((request, response) => {
    firebase_api_1.firestore.collection('expo-push-tokens').add(request.body);
    response.send(true);
});
