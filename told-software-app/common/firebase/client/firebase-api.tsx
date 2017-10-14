import * as firebase from 'firebase';
// Required for Side Effects
import 'firebase/firestore';
import 'firebase/auth';

import * as C from '../../config';
import { delay } from '../../utils/async';
import * as O from '../../utils/observable';

declare var global: any;

class FakeImage {
    static ensureImageExists() {
        if (!global.Image) {
            global.Image = FakeImage;
        }
    }

    _isLoaded = false;
    _callbacks: (() => void)[] = [];

    set src(url: string) {
        this._isLoaded = false;
        this.load(url);
    }

    load = async (url: string) => {
        // Handle an empty url or random errors
        try {
            await fetch(url);
        } catch (err) { }

        this._callbacks.forEach(x => x());
        this._isLoaded = true;
    };

    onload(callback: () => void) {
        if (this._isLoaded) { callback(); }
        this._callbacks.push(callback);
    }
}

FakeImage.ensureImageExists();

function setup() {
    const app = firebase.initializeApp(C.firebaseConfig);

    // firebase.firestore.setLogLevel('debug');
    const firestore = firebase.firestore(app);
    const auth = firebase.auth(app);

    return { app, firestore, auth };
}

const instance = setup();

async function resetFirebase() {
    // FakeImage.ensureImageExists();

    // console.log(':::resetFirestore START');

    // console.log(':::resetFirestore Delete Firestore');
    // try {
    //     await instance.app.delete();
    // } catch (err) {
    //     console.log(':::resetFirestore Delete App ERROR: ain\'t nobody got time for that', err);
    // }

    // // Recreate app
    // const newApp = setup();
    // instance.app = newApp.app;
    // instance.firestore = newApp.firestore;
    // instance.auth = newApp.auth;

    // console.log(':::resetFirestore END');
}

export type FirestoreCollection = firebase.firestore.CollectionReference;
export type FirestoreDocument = firebase.firestore.DocumentReference;

export type CollectionId = string & { "__type": 'CollectionId' };

class FirestoreAccess {
    async getDocument<T extends { id: string }>(collection: CollectionId, documentId: string): Promise<T> {
        const doc = await instance.firestore.collection(collection)
            .doc(documentId)
            .get();

        if (!doc.exists) {
            return null;
        }

        const d = doc.data() as T;
        d.id = doc.id;
        return d;
    }

    async getDocuments<T extends { id: string }>(collection: CollectionId, documentIds: string[]): Promise<T[]> {
        return Promise.all(documentIds.map((x) => this.getDocument<T>(collection, x)));
    }

    async getDocuments_all<T extends { id: string }>(collection: CollectionId): Promise<T[]> {
        const snaptshot = await instance.firestore.collection(collection)
            .get();

        const data = snaptshot.docs.map(x => {
            const d = x.data() as T;
            d.id = x.id;
            return d;
        });

        return data;
    }

    async getDocumentByValue<T extends { id: string }>(collection: CollectionId, key: keyof T, value: any): Promise<T> {
        const x = await this.getDocumentsByValue<T>(collection, key, value);
        return x && x[0] || null;
    }
    async getDocumentsByValue<T extends { id: string }>(collection: CollectionId, key: keyof T, value: any): Promise<T[]> {
        const snaptshot = await instance.firestore.collection(collection)
            .where(key, '==', value)
            .get();

        const data = snaptshot.docs.map(x => {
            const d = x.data() as T;
            d.id = x.id;
            return d;
        });

        return data;
    }

    async getDocumentsByValue_paged<T extends { id: string }>(
        collection: CollectionId, key: keyof T, value: any, orderKey: keyof T, order: 'asc' | 'desc' = 'asc', startAfterValue: any = null, limit = 10
    ): Promise<T[]> {

        console.log('getDocumentsByValue_paged START',
            collection, key, value, orderKey, order, startAfterValue, limit
        );

        let query = instance.firestore.collection(collection)
            .where(key, '==', value)
            .orderBy(orderKey, order);

        if (startAfterValue) {
            query = query
                .startAfter(startAfterValue)
        }

        query = query.limit(limit);

        const snapshot = await query.get();

        const data = snapshot.docs
            .map(x => {
                const d = x.data() as T;
                d.id = x.id;
                return d;
            });

        console.log('getDocumentsByValue_paged START',
            'data.length', data.length,
        );

        return data;
    }

    subscribe<T extends { id: string }>(
        collection: CollectionId, key: keyof T, value: any, orderKey: keyof T, order: 'asc' | 'desc' = 'asc', startAfterValue: any = null, limit = 10
    ): O.SlimObservable<T[]> {

        console.log('getDocumentsByValue_paged START',
            collection, key, value, orderKey, order, startAfterValue, limit
        );

        let query = instance.firestore.collection(collection)
            .where(key, '==', value)
            .orderBy(orderKey, order);

        if (startAfterValue) {
            query = query
                .startAfter(startAfterValue)
        }

        query = query.limit(limit);

        const subject = new O.SlimSubject<T[]>(() => unsub());

        const unsub = query.onSnapshot((snapshot) => {
            const data = snapshot.docChanges
                .map(xChange => {
                    const x = xChange.doc;
                    const d = x.data() as T;
                    d.id = x.id;
                    return d;
                });

            subject.next(data);
        });

        return subject;
    }

    async createDocument<T>(collection: CollectionId, data: T) {
        await instance.firestore.collection(collection).add(data);
    }
}

class AuthAccess {
    get currentUser() { return instance.auth.currentUser; }
    async signOut() {
        await resetFirebase();
        // return instance.auth.signOut();
    }
    async signInAnonymously() {
        await resetFirebase();
        return instance.auth.signInAnonymously();
    }
    async signInWithEmailAndPassword(email: string, password: string) {
        await resetFirebase();
        return instance.auth.signInWithEmailAndPassword(email, password);
    }
}

export const firestore = new FirestoreAccess();
export const auth = new AuthAccess();