/**
 * @description
 * Returns a de-duplicated copy of the given array. Objects are compared by reference,
 * unless the `byKey` argument is supplied, in which case the specified property will
 * be used to determine uniqueness
 */
export function unique<T>(arr: T[], byKey?: keyof T): T[] {
    if (byKey == null) {
        return Array.from(new Set(arr));
    } else {
        // Based on https://stackoverflow.com/a/58429784/772859
        return [...new Map(arr.map(item => [item[byKey], item])).values()];
    }
}
