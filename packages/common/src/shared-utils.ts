/**
 * Predicate with type guard, used to filter out null or undefined values
 * in a filter operation.
 */
export function notNullOrUndefined<T>(val: T | undefined | null): val is T {
    return val !== undefined && val !== null;
}

/**
 * Used in exhaustiveness checks to assert a codepath should never be reached.
 */
export function assertNever(value: never): never {
    throw new Error(`Expected never, got ${typeof value}`);
}

/**
 * Given an array of option arrays `[['red, 'blue'], ['small', 'large']]`, this method returns a new array
 * containing all the combinations of those options:
 *
 * @example
 * ```
 * generateAllCombinations([['red, 'blue'], ['small', 'large']]);
 * // =>
 * // [
 * //  ['red', 'small'],
 * //  ['red', 'large'],
 * //  ['blue', 'small'],
 * //  ['blue', 'large'],
 * // ]
 */
export function generateAllCombinations<T>(
    optionGroups: T[][],
    combination: T[] = [],
    k: number = 0,
    output: T[][] = [],
): T[][] {
    if (k === optionGroups.length) {
        output.push(combination);
        return [];
    } else {
        // tslint:disable:prefer-for-of
        for (let i = 0; i < optionGroups[k].length; i++) {
            generateAllCombinations(optionGroups, combination.concat(optionGroups[k][i]), k + 1, output);
        }
        // tslint:enable:prefer-for-of
        return output;
    }
}
