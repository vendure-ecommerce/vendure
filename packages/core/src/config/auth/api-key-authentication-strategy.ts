import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

import { RequestContext } from '../../api/common/request-context';
import { Injector } from '../../common/injector';
import { Logger } from '../../config';

import { AuthenticationStrategy } from './authentication-strategy';

/**
 * API key authentication strategy usable with the standard authenticate mutation.
 * Verifies the key, enforces scope (admin/shop), and links the session to the key
 * for targeted invalidation. Initial session TTL is capped to the key's expiry
 * via AuthService when ctx.apiKeyId is set.
 * @since 3.5.0
 */
export class ApiKeyAuthenticationStrategy implements AuthenticationStrategy<{ key: string }> {
    readonly name = 'apiKey';

    private apiKeyService: import('../../service/services/api-key.service').ApiKeyService;

    async init(injector: Injector) {
        const { ApiKeyService } = await import('../../service/services/api-key.service.js');
        this.apiKeyService = injector.get(ApiKeyService);
    }

    defineInputType(): DocumentNode {
        return gql`
            input ApiKeyAuthInput {
                key: String!
            }
        `;
    }

    async authenticate(
        ctx: RequestContext,
        data: { key: string },
    ): Promise<import('../../entity/user/user.entity').User | false | string> {
        const result = await this.apiKeyService.verifyRawKey(ctx, data.key);
        if (!result) {
            return false;
        }
        // Enforce scope based on API type
        const scopeOk =
            (ctx.apiType === 'admin' && result.apiKey.scope === 'admin') ||
            (ctx.apiType === 'shop' && result.apiKey.scope === 'shop');
        if (!scopeOk) {
            return false;
        }
        // Best-effort mark last used
        void this.apiKeyService
            .markUsed(ctx, result.apiKey.id)
            .catch(err => Logger.warn(err?.message ?? String(err), 'ApiKeyAuthenticationStrategy'));
        // Attach apiKeyId so AuthService can link the session and cap TTL initially
        ctx.setApiKeyId(result.apiKey.id);
        return result.user;
    }
}
