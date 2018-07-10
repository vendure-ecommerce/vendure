/**
 * All errors thrown in the Vendure server must use this error class. This allows the
 * error message to be translated before being served to the client.
 *
 * The message should be of the form `Could not find user {{ id }}`, with the variables argument
 * being used to provide interpolation values.
 *
 * @example
 * ```
 * throw new I18nError(`Could not find user {{ id }}`, { id });
 * ```
 */
export class I18nError extends Error {
    constructor(public message: string, public variables: { [key: string]: string | number } = {}) {
        super(message);
    }
}
