import ms from 'ms';

import { SessionService } from '../../service/services/session.service';

import { ApiKeyGenerationStrategy } from './api-key-generation-strategy';
import { ApiKeyHashingStrategy } from './api-key-hashing-strategy';
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
 * // TODO docs
 */
export interface ApiKeyAuthorizationOptions {
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
     * It is important that this strategy is as fast as possible to avoid performance issues since
     * hashing happens on every request that uses API-Key authentication!
     *
     * // TODO default
     * // TODO see
     */
    hashingStrategy?: ApiKeyHashingStrategy;

    // TODO could have a key expiry strategy too that deletes keys that havent been used in X time
}
