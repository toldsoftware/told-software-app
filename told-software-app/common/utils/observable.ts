
export type SlimObserver<T> = (item: T) => void;
export interface SlimObservable<T> {
    subscribe: (observer: SlimObserver<T>) => void;
    unsubscribe: () => void;
}

export class SlimSubject<T> implements SlimObservable<T> {
    observers: SlimObserver<T>[] = [];

    constructor(private onUnsubscribe: () => void) { }

    subscribe(observer: SlimObserver<T>) {
        this.observers.push(observer);
    }

    unsubscribe() {
        this.observers = null;
        this.onUnsubscribe();
    }

    next(value: T) {
        this.observers.forEach(x => x(value));
    }
}

