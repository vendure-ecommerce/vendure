import ms from 'ms';

import { SessionService } from '../../service/services/session.service';

import { ApiKeyGenerationStrategy } from './api-key-generation-strategy';
import { ApiKeyHashingStrategy } from './api-key-hashing-strategy';
import { ApiKeyLookupIdGenerationStrategy } from './api-key-lookup-id-generation-strategy';
import { RandomBytesApiKeyGenerationStrategy } from './random-bytes-api-key-generation-strategy';

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
 * @description
 * The ApiKeyAuthorizationOptions define how authorization via API-Keys is managed.
 *
 * @docsCategory auth
 */
export interface ApiKeyAuthorizationOptions {
    /**
     * @description
     * Defines a custom strategy for how API-Key lookup identifiers get generated.
     *
     * A separate lookup ID enables us to use stronger salted hashing methods for the actual API-Key.
     * This is because when we extract the incoming API-Key from the request, hashing methods that
     * automatically handle salting (e.g. bcrypt) will produce different hashes for the same input,
     * making it impossible to compare the incoming API-Key with the stored hash.
     *
     * By using a separate lookup ID, we can identify the correct stored hash to compare against.
     */
    lookupIdStrategy?: ApiKeyLookupIdGenerationStrategy;
    /**
     * @description
     * Defines how API-Keys get generated.
     *
     * Defining different strategies between production-/ and development-environments and or
     * differing strategies for Admin-/ and Customer-Users can be worthwhile to guarantee that API-Keys will never overlap.
     *
     * For example you could make strategies that generate keys with prefixes like
     *
     * - `'test_'`, `'prod_'`
     * - `'admin_'`, `'customer_'`
     *
     * to visually distinguish between keys more easily.
     *
     * @default RandomBytesApiKeyGenerationStrategy
     * @see {@link RandomBytesApiKeyGenerationStrategy}
     */
    generationStrategy?: ApiKeyGenerationStrategy;
    /**
     * @description
     * Defines how API-Keys get hashed for storage and how incoming API-Keys get hashed for comparison.
     *
     * Please keep in mind that introducing a compute heavy hashing method may introduce performance
     * issues since hashing happens on every request that uses API-Key authentication!
     *
     * @default BcryptPasswordHashingStrategy
     * @see {@link BcryptPasswordHashingStrategy}
     */
    hashingStrategy?: ApiKeyHashingStrategy;
}
