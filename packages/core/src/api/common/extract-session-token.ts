import { Request } from 'express';

import { AuthOptions } from '../../config/vendure-config';

/**
 * Get the session token from either the cookie or the Authorization header, depending
 * on the configured tokenMethod.
 */
export function extractSessionToken(
    req: Request,
    tokenMethod: Exclude<AuthOptions['tokenMethod'], undefined>,
): string | undefined {
    const tokenFromCookie = getFromCookie(req);
    const tokenFromHeader = getFromHeader(req);

    if (tokenMethod === 'cookie') {
        return tokenFromCookie;
    } else if (tokenMethod === 'bearer') {
        return tokenFromHeader;
    }
    if (tokenMethod.includes('cookie') && tokenFromCookie) {
        return tokenFromCookie;
    }
    if (tokenMethod.includes('bearer') && tokenFromHeader) {
        return tokenFromHeader;
    }
}

function getFromCookie(req: Request): string | undefined {
    if (req.session && req.session.token) {
        return req.session.token;
    }
}

function getFromHeader(req: Request): string | undefined {
    const authHeader = req.get('Authorization');
    if (authHeader) {
        const matches = authHeader.trim().match(/^bearer\s(.+)$/i);
        if (matches) {
            return matches[1];
        }
    }
}
