export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

/**
 * Type-safe omit function - returns a new object which omits the specified keys.
 */
export function omit<T extends object, K extends keyof T>(obj: T, keysToOmit: K[]): Omit<T, K> {
    return Object.keys(obj).reduce((output: any, key) => {
        if (keysToOmit.includes(key as K)) {
            return output;
        }
        return { ...output, [key]: (obj as any)[key] };
    }, {} as Omit<T, K>);
}
