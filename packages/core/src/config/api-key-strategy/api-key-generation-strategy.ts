import { RequestContext } from '../../api/common/request-context';
import { InjectableStrategy } from '../../common/types/injectable-strategy';

/**
 * @description
 * Defines a custom strategy for how API-Keys get generated.
 *
 * Defining different strategies between production-/ and development-environments and or
 * differing strategies for Admin-/ and Customer-Users can be worthwhile to guarantee that API-Keys will never overlap.
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
export interface ApiKeyGenerationStrategy extends InjectableStrategy {
    /**
     * @description
     * Generates an API-Key.
     *
     * @since 3.6.0
     */
    generateApiKey(ctx: RequestContext): Promise<string>;
}
