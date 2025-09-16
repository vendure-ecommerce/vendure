import { Request } from 'express';

import { ApiKeyHashingStrategy } from '../../config';
import { AuthOptions } from '../../config/vendure-config';

/**
 * Get the session token from either the cookie or the Authorization header, depending
 * on the configured tokenMethod.
 */
export async function extractSessionToken(
    req: Request,
    tokenMethod: Exclude<AuthOptions['tokenMethod'], undefined>,
    apiKeyHashingStrategy: ApiKeyHashingStrategy,
): Promise<string | undefined> {
    if (tokenMethod === 'cookie' || tokenMethod.includes('cookie')) {
        if (req.session?.token) return req.session.token;
    }

    if (tokenMethod === 'bearer' || tokenMethod.includes('bearer')) {
        const authHeader = req.get('Authorization')?.trim();
        if (!authHeader) return;

        const matchesBearer = authHeader.match(/^bearer\s(.+)$/i);
        if (matchesBearer) return matchesBearer[1];
    }

    if (tokenMethod.includes('api-key')) {
        // TODO we could also use a custom header like "X-API-KEY" or similar
        const authHeader = req.get('Authorization')?.trim();
        if (!authHeader) return;

        const matchesBasic = authHeader.match(/^basic\s(.+)$/i); // TODO document this
        if (matchesBasic) {
            // Per Auth-Spec "Basic" is base64 encoded and includes "username:password"
            const decodedHeader = Buffer.from(matchesBasic[1], 'base64').toString('ascii');
            const decodedApiKey = decodedHeader.split(':', 1)[0];
            return apiKeyHashingStrategy.hash(decodedApiKey);
        }
    }
}
