/**
 * Returns a new object which is a subject of the input, including only the specified properties.
 * Can be called with a single argument (array of props to pick), in which case it returns a partially
 * applied pick function.
 */
export function pick<T extends object, U extends T = any>(props: Array<keyof T>): (input: U) => T;
export function pick<T extends object, U extends T = any>(input: U, props: Array<keyof T>): T;
export function pick<T extends object, U extends T = any>(
    inputOrProps: U | Array<keyof T>,
    maybeProps?: Array<keyof T>,
): T | ((input: U) => T) {
    if (Array.isArray(inputOrProps)) {
        return (input: U) => _pick(input, inputOrProps);
    } else {
        return _pick(inputOrProps, maybeProps || []);
    }
}

function _pick<T extends object, U extends T = any>(input: U, props: Array<keyof T>): T {
    const output: any = {};
    for (const prop of props) {
        output[prop] = input[prop];
    }
    return output;
}
