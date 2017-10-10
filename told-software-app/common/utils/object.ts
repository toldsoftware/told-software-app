export function toLookup<T>(items: T[], getKey: (x: T) => string) {
    const g = items.reduce((o, x) => {
        const k = getKey(x);
        o[k] = x;
        return o;
    }, {} as any) as { [key: string]: T };

    return g;
}

export function toGroup<T>(items: T[], getKey: (x: T) => string) {
    const g = items.reduce((o, x) => {
        const k = getKey(x);
        const group = o[k] = o[k] || { items: [] };
        group.items.push(x);
        return o;
    }, {} as any) as { [key: string]: { items: T[] } };

    return g;
}

export function toGroupArray<T>(items: T[], getKey: (x: T) => string) {
    const g = toGroup(items, getKey);
    return Object.getOwnPropertyNames(g).map(k => g[k].items);
}

export function toUniqueValues<T extends string>(items: T[]): T[] {
    return toUniqueItems(items.filter(x => !!x), x => x);
}
export function toUniqueItems<T>(items: T[], getKey: (x: T) => string) {
    return toGroupArray(items, getKey).map(x => x[0]);
}

export function assignPartial<T>(t: T, p: Partial<T>): T {
    for (let k in p) {
        if (p.hasOwnProperty(k)) {
            t[k] = p[k];
        }
    }

    return t;
}

export function partialDeepCompare<T>(a: T, e: Partial<T>, depth = 0) {
    if (depth > 100) {
        throw 'partialDeepCompare Seems to be in a cyclic loop';
    }

    if (e === a) { return true; }
    if ((e === undefined || e === null) && (a === undefined || a === null)) { return true; }
    if ((e === undefined || e === null || a === undefined || a === null)) { return false; }
    if (typeof a === 'string') { return false; }

    for (let k in e) {
        // if (!e.hasOwnProperty(k)) { continue; }

        const e2 = e[k];
        const a2 = a[k];

        if (!partialDeepCompare(a2, e2 as any, depth + 1)) {
            return false;
        }
    }

    return true;
}

export function deepCompare<T>(actual: T, expected: T) {
    return partialDeepCompare(actual, expected) && partialDeepCompare(expected, actual);
}

