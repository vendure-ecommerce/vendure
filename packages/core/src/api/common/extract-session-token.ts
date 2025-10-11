import { Request } from 'express';

import { ApiKeyHashingStrategy, Logger } from '../../config';
import { AuthOptions } from '../../config/vendure-config';
import { ApiKeyService } from '../../service/services/api-key.service';

// Helper that gives us the content of the tokenmethod array so we dont duplicate options
type ExtractArrayElement<T> = T extends ReadonlyArray<infer U> ? U : T;

export type ExtractTokenResult = {
    method: Exclude<ExtractArrayElement<AuthOptions['tokenMethod']>, undefined>;
    token: string;
};

/**
 * Depending on the configured `tokenMethod`, tries to extract a session token in the order:
 *
 * 1. Cookie
 * 2. Authorization Header
 * 3. API-Key Header
 *     - If an ApiKey is found, its `lastUsedAt` timestamp will be updated in the background.
 *
 * @see {@link AuthOptions}
 */
export async function extractSessionToken(
    req: Request,
    tokenMethod: Exclude<AuthOptions['tokenMethod'], undefined>,
    apiKeyHeaderKey: string,
    apiKeyLookupHeaderKey: string,
    apiKeyService: ApiKeyService,
    apiKeyHashingStrategy: ApiKeyHashingStrategy,
): Promise<ExtractTokenResult | undefined> {
    if (req.session?.token && (tokenMethod === 'cookie' || tokenMethod.includes('cookie'))) {
        return { method: 'cookie', token: req.session.token as string };
    }

    const authHeader = req.get('Authorization')?.trim();
    if (authHeader && (tokenMethod === 'bearer' || tokenMethod.includes('bearer'))) {
        const matchesBearer = authHeader.match(/^bearer\s(.+)$/i);
        if (matchesBearer) return { method: 'bearer', token: matchesBearer[1] };
    }

    const apiKeyHeader = req.get(apiKeyHeaderKey)?.trim();
    const apiKeyLookupHeader = req.get(apiKeyLookupHeaderKey)?.trim();
    if (apiKeyHeader && apiKeyLookupHeader && tokenMethod.includes('api-key')) {
        const apiKeyHash = await apiKeyService.getHashByLookupId(apiKeyLookupHeader);

        // TODO lookupIds might be vulnerable to timing attacks because
        // we only hash the apiKeyHeader if we find a matching lookupId.
        // think about substituting a fake hash if no ApiKey is found.
        let token: string;
        if (apiKeyHash && (await apiKeyHashingStrategy.check(apiKeyHeader, apiKeyHash))) {
            token = apiKeyHash;
            // Update the lastUsedAt timestamp in the background, we don't want to hold up the request
            apiKeyService
                .updateLastUsedAtByLookupId(apiKeyLookupHeader)
                .catch(err =>
                    Logger.error(
                        `Failed to update lastUsedAt for ApiKey with lookupId ${apiKeyLookupHeader}`,
                        undefined,
                        err?.stack,
                    ),
                );
        } else {
            // Even though we know that there is no corresponding ApiKey entity,
            // we still hash the provided key to avoid leaking timing information.
            token = await apiKeyHashingStrategy.hash(apiKeyHeader);
        }

        return { method: 'api-key', token };
    }
}
