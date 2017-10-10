import * as firebase from 'firebase';
// Required for Side Effects
import 'firebase/firestore';
import 'firebase/auth';
const app = firebase.initializeApp({
    apiKey: "AIzaSyCT0PWUqJt69BbuUkBieW7z3o-T5zj4qJY",
    authDomain: "told-software.firebaseapp.com",
    databaseURL: "https://told-software.firebaseio.com",
    projectId: "told-software",
    storageBucket: "told-software.appspot.com",
    messagingSenderId: "972786940927"
});
export const firestore = firebase.firestore(app);
export const auth = firebase.auth(app);
