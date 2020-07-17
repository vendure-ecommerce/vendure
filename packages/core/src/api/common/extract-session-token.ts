import { Request } from 'express';

import { AuthOptions } from '../../config/vendure-config';

/**
 * Get the session token from either the cookie or the Authorization header, depending
 * on the configured tokenMethod.
 */
export function extractSessionToken(
    req: Request,
    tokenMethod: AuthOptions['tokenMethod'],
): string | undefined {
    if (tokenMethod === 'cookie') {
        if (req.session && req.session.token) {
            return req.session.token;
        }
    } else {
        const authHeader = req.get('Authorization');
        if (authHeader) {
            const matches = authHeader.match(/bearer\s+(.+)$/i);
            if (matches) {
                return matches[1];
            }
        }
    }
}
