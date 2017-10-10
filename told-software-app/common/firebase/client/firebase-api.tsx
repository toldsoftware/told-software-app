import * as firebase from 'firebase';
// Required for Side Effects
import 'firebase/firestore';
import 'firebase/auth';

import * as C from '../../config';

const app = firebase.initializeApp(C.firebaseConfig);

export const firestore = firebase.firestore(app);
export const auth = firebase.auth(app);

export type FirestoreCollection = firebase.firestore.CollectionReference;
export type FirestoreDocument = firebase.firestore.DocumentReference;
