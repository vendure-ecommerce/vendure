import { Request } from 'express';

import { ApiKeyHashingStrategy } from '../../config';
import { AuthOptions } from '../../config/vendure-config';

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
 *
 * @see {@link AuthOptions}
 */
export async function extractSessionToken(
    req: Request,
    tokenMethod: Exclude<AuthOptions['tokenMethod'], undefined>,
    apiKeyHeaderKey: string,
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
    if (apiKeyHeader && tokenMethod.includes('api-key')) {
        return { method: 'api-key', token: await apiKeyHashingStrategy.hash(apiKeyHeader) };
    }
}
