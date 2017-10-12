import * as firebase from 'firebase';
// Required for Side Effects
import 'firebase/firestore';
import 'firebase/auth';

import * as C from '../../config';
import { delay } from '../../utils/async';
import * as O from '../../utils/observable';

const app = firebase.initializeApp(C.firebaseConfig);

firebase.firestore.setLogLevel('debug');

export const firestore = firebase.firestore(app);
export const auth = firebase.auth(app);

export async function resetFirestore() {
    // firestore.
    await delay(1000);
}

export type FirestoreCollection = firebase.firestore.CollectionReference;
export type FirestoreDocument = firebase.firestore.DocumentReference;

export type CollectionId = string & { "__type": 'CollectionId' };

export class FirestoreAccess {
    async getDocument<T extends { id: string }>(collection: CollectionId, documentId: string): Promise<T> {
        const doc = await firestore.collection(collection)
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
        const snaptshot = await firestore.collection(collection)
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
        const snaptshot = await firestore.collection(collection)
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

        let query = firestore.collection(collection)
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

        let query = firestore.collection(collection)
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
        await firestore.collection(collection).add(data);
    }
}