import { Request } from 'express';

import { AuthOptions } from '../../config/vendure-config';

import { WebSocketRequest } from './websocket-type';

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

function getFromHeader(req: Request | WebSocketRequest): string | undefined {
    let authHeader: string | undefined;
    // Check if running in an HTTP context with Express Request object
    if (req && typeof (req as Request).get === 'function') {
        authHeader = (req as Request).get('Authorization');
    }
    // Otherwise, assume a WebSocket context and check connectionParams
    if ((req as WebSocketRequest).connectionParams?.Authorization) {
        authHeader = (req as WebSocketRequest).connectionParams.Authorization;
    }
    if (authHeader) {
        const matches = authHeader.trim().match(/^bearer\s(.+)$/i);
        if (matches) {
            return matches[1];
        }
    }
    return undefined;
}
