import ms from 'ms';

import { RequestContext } from '../../api/common/request-context';
import { InjectableStrategy } from '../../common/types/injectable-strategy';
import { SessionService } from '../../service';
import { PasswordHashingStrategy } from '../auth/password-hashing-strategy';

/**
 * Needed to identify types of sessions when creating and deleting.
 *
 * @see {@link SessionService}
 */
export const API_KEY_AUTH_STRATEGY_NAME = 'apikey';

/**
 * Since API-Keys build upon Vendures Session mechanism, we need to set a very long
 * default duration to mimic the "forever" nature of API-Keys.
 *
 * @unit Milliseconds
 * @see {@link SessionService}
 */
export const API_KEY_AUTH_STRATEGY_DEFAULT_DURATION_MS = ms('100y');

/**
 * @see {@link ApiKeyStrategy}
 */
export type ApiKeyStrategyParseResult = null | {
    lookupId: string;
    apiKey: string;
};

/**
 * @description
 * Defines a custom strategy for how API-Keys get handled.
 *
 * Defining different strategies between production-/ and development-environments and or
 * differing strategies for Admin-/ and Customer-Users can be worthwhile to guarantee that API-Keys will never overlap.
 *
 * :::info
 *
 * This is configured in either:
 *
 * - `authOptions.adminApiKeyStrategy`
 * - `authOptions.shopApiKeyStrategy`
 *
 * of your VendureConfig.
 * :::
 *
 * @docsCategory auth
 * @since 3.6.0
 */
export interface ApiKeyStrategy extends InjectableStrategy {
    /**
     * @description
     * Generates the API-Key secret which ultimately gets hashed and determines the session id.
     *
     * @since 3.6.0
     */
    generateSecret(ctx: RequestContext): Promise<string>;

    /**
     * @description
     * Generates an API-Key lookup ID.
     *
     * A separate lookup ID enables us to use stronger salted hashing methods for the actual API-Key.
     * This is because when we extract the incoming API-Key from the request, hashing methods that
     * automatically handle salting (e.g. bcrypt) will produce different hashes for the same input,
     * making it impossible to compare the incoming API-Key with the stored hash.
     *
     * By using a separate lookup ID, we can identify the correct stored hash to compare against.
     *
     * @since 3.6.0
     */
    generateLookupId(ctx: RequestContext): Promise<string>;

    /**
     * @description
     * Defines a custom strategy for how API-Keys get hashed and checked.
     *
     * :::important Performance Consideration
     *
     * Vendure does not store API-Keys in plain text, but rather a hashed version of the key,
     * similar to how passwords are handled. This means that when a request comes in with an API-Key,
     * Vendure needs to hash the provided key and compare it with the stored hash. This means your hashing
     * strategy must preferably be as fast as possible to avoid performance issues since hashing happens
     * on every request that uses API-Key authorization.
     *
     * :::
     *
     * @since 3.6.0
     */
    hashingStrategy: PasswordHashingStrategy;

    /**
     * @description
     * Used when constructing and parsing API-Keys. You might need to override this
     * delimiter if you customized the secret-/ and or lookup-generation.
     * See {@link constructApiKey} or {@link parse} for more detailed information.
     *
     * @default ":"
     * @see {@link BaseApiKeyStrategy} for a default implementation
     */
    delimiter: string;

    /**
     * @description
     * Constructs an API-Key which the {@link User}s supply to the API.
     *
     * Each strategy determines how it combines the lookup ID with the secret itself,
     * because lookup-/ and secret-generation are customizable leading to Vendure not
     * enforcing a fixed delimiter.
     *
     * The output of this function must be parsable via this strategys {@link parse} function.
     *
     * @see {@link BaseApiKeyStrategy} for a default implementation
     * @since 3.6.0
     */
    constructApiKey(lookupId: string, secret: string): string;

    /**
     * @description
     * In order to allow users to send only one header with their API-Key, while still supporting
     * a separate lookup ID, strategies must be able to parse provided tokens into both parts, more
     * specifically this function must be able to parse the output of {@link constructApiKey}.
     *
     * We do not force an arbitrary delimiter, for example a colon `':'`, because the secret itself
     * and the lookup ID are both customizable and may conflict with it, hence the need for custom parsing.
     *
     * Custom parsing also allows strategies to use special characters in their API-Keys, by requiring
     * the token to be base64 encoded for example or include prefixes such as:
     *
     * - `'test_'`, `'prod_'`
     * - `'admin_'`, `'customer_'`
     *
     * to visually distinguish between keys more easily.
     *
     * @see {@link BaseApiKeyStrategy} for a default implementation
     * @since 3.6.0
     * @returns Either both parts for further processing or `null` if parsing failed.
     */
    parse(token: string): ApiKeyStrategyParseResult;
}

/**
 * Intended to be extended by consumers of the {@link ApiKeyStrategy} if they do not
 * require their own construction/parsing logic.
 */
export abstract class BaseApiKeyStrategy implements ApiKeyStrategy {
    abstract hashingStrategy: PasswordHashingStrategy;
    abstract generateSecret(ctx: RequestContext): Promise<string>;
    abstract generateLookupId(ctx: RequestContext): Promise<string>;

    delimiter = ':';

    constructApiKey(lookupId: string, secret: string): string {
        return `${lookupId}${this.delimiter}${secret}`;
    }

    parse(token: string): ApiKeyStrategyParseResult {
        if (!token) {
            return null;
        }

        const [lookupId, apiKey] = token.split(':', 2);

        if (!lookupId || !apiKey) {
            return null;
        }

        return { lookupId, apiKey };
    }
}
