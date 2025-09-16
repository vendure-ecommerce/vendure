import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

import { RequestContext } from '../../api/common/request-context';

import { AuthenticationStrategy } from './authentication-strategy';

/**
 * Admin authentication via API key. Issues a short-TTL Admin session that
 * inherits the bound Administrator's Roles/Permissions/Channels.
 * @since 3.5.0
 */
export class ApiKeyAdminAuthStrategy implements AuthenticationStrategy<{ key: string }> {
    readonly name = 'apiKey';

    private apiKeyService: import('../../service/services/api-key.service').ApiKeyService;

    async init(injector: import('../../common/injector').Injector) {
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
        const result = await this.apiKeyService.validateRawKey(ctx, data.key);
        if (!result) {
            return false;
        }
        // Mark the key used asynchronously (best effort)
        void this.apiKeyService.markUsed(ctx, result.apiKey.id);
        // Attach the apiKey id to the context so the session can be linked post-creation.
        // We avoid changing public method signatures.
        (ctx as any).__apiKeyId = result.apiKey.id;
        return result.administrator.user;
    }
}
