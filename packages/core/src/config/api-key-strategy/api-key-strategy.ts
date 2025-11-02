import { RequestContext } from '../../api/common/request-context';
import { InjectableStrategy } from '../../common/types/injectable-strategy';
import { PasswordHashingStrategy } from '../auth/password-hashing-strategy';

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
     * Constructs an API-Key which the {@link User}s supply to the API.
     *
     * Each strategy determines how it combines the lookup ID with the secret itself,
     * because lookup-/ and secret-generation are customizable leading to Vendure not
     * enforcing a fixed delimiter.
     *
     * The output of this function must be parsable via this strategys {@link tryParse} function.
     *
     * @see {@link tryParse}
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
     * the token to be base64 encoded for example.
     *
     * @since 3.6.0
     * @see {@link constructApiKey}
     * @returns Either both parts for further processing or `null` if parsing failed.
     */
    tryParse(token: string): ApiKeyStrategyParseResult;
}
