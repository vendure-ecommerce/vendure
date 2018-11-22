import { ApolloError } from 'apollo-server-core';

/**
 * All errors thrown in the Vendure server must use or extend this error class. This allows the
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
export abstract class I18nError extends ApolloError {
    protected constructor(
        public message: string,
        public variables: { [key: string]: string | number } = {},
        code?: string,
    ) {
        super(message, code);
    }
}
