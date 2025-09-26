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
 * Get the session token from either the cookie or the Authorization header, depending
 * on the configured tokenMethod.
 */
export async function extractSessionToken(
    req: Request,
    tokenMethod: Exclude<AuthOptions['tokenMethod'], undefined>,
    apiKeyHashingStrategy: ApiKeyHashingStrategy,
): Promise<ExtractTokenResult | undefined> {
    if (tokenMethod === 'cookie' || tokenMethod.includes('cookie')) {
        if (req.session?.token) return { method: 'cookie', token: req.session.token as string };
    }

    if (tokenMethod === 'bearer' || tokenMethod.includes('bearer')) {
        const authHeader = req.get('Authorization')?.trim();
        if (!authHeader) return;

        const matchesBearer = authHeader.match(/^bearer\s(.+)$/i);
        if (matchesBearer) return { method: 'bearer', token: matchesBearer[1] };
    }

    if (tokenMethod.includes('api-key')) {
        // TODO we could also use a custom header like "X-API-KEY" or similar
        const authHeader = req.get('Authorization')?.trim();
        if (!authHeader) return;

        const matchesBasic = authHeader.match(/^basic\s(.+)$/i); // TODO document this
        if (matchesBasic) {
            // Per Auth-Spec "Basic" is base64 encoded and includes "username:password"
            const decodedHeader = Buffer.from(matchesBasic[1], 'base64').toString('utf8'); // TODO if this stays document utf8
            const decodedApiKey = decodedHeader.split(':', 1)[0];
            return { method: 'api-key', token: await apiKeyHashingStrategy.hash(decodedApiKey) };
        }
    }
}
