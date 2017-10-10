"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const firebase = require("firebase");
// Required for Side Effects
require("firebase/firestore");
require("firebase/auth");
const app = firebase.initializeApp({
    apiKey: "AIzaSyCT0PWUqJt69BbuUkBieW7z3o-T5zj4qJY",
    authDomain: "told-software.firebaseapp.com",
    databaseURL: "https://told-software.firebaseio.com",
    projectId: "told-software",
    storageBucket: "told-software.appspot.com",
    messagingSenderId: "972786940927"
});
exports.firestore = firebase.firestore(app);
exports.auth = firebase.auth(app);
