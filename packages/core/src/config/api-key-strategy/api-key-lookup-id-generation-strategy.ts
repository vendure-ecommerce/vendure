import { RequestContext } from '../../api/common/request-context';
import { InjectableStrategy } from '../../common/types/injectable-strategy';

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
 *
 * :::info
 *
 * This is configured via the `ApiKeyAuthenticationStrategy` in either:
 *
 * - `authOptions.adminAuthenticationStrategy`
 * - `authOptions.shopAuthenticationStrategy`
 *
 * of your VendureConfig.
 * :::
 *
 * @docsCategory auth
 * @since 3.6.0
 */
export interface ApiKeyLookupIdGenerationStrategy extends InjectableStrategy {
    /**
     * @description
     * Generates an API-Key lookup ID.
     *
     * @since 3.6.0
     */
    generateLookupId(ctx: RequestContext): Promise<string>;
}
