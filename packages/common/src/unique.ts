/**
 * Returns an array with only unique values. Objects are compared by reference,
 * unless the `byKey` argument is supplied, in which case matching properties will
 * be used to check duplicates
 */
export function unique<T>(arr: T[], byKey?: keyof T): T[] {
    return arr.filter((item, index, self) => {
        return (
            index ===
            self.findIndex(i => {
                if (byKey === undefined) {
                    return i === item;
                } else {
                    return i[byKey] === item[byKey];
                }
            })
        );
    });
}
