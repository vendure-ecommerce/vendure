import { Request, Response } from 'express';
import ms from 'ms';

import { AuthOptions } from '../../config/vendure-config';

/**
 * Sets the authToken either as a cookie or as a response header, depending on the
 * config settings.
 */
export function setSessionToken(options: {
    sessionToken: string;
    rememberMe: boolean;
    authOptions: Required<AuthOptions>;
    req: Request;
    res: Response;
}) {
    const { sessionToken, rememberMe, authOptions, req, res } = options;
    const usingCookie =
        authOptions.tokenMethod === 'cookie' ||
        (Array.isArray(authOptions.tokenMethod) && authOptions.tokenMethod.includes('cookie'));
    const usingBearer =
        authOptions.tokenMethod === 'bearer' ||
        (Array.isArray(authOptions.tokenMethod) && authOptions.tokenMethod.includes('bearer'));

    if (usingCookie) {
        if (req.session) {
            if (rememberMe) {
                req.sessionOptions.maxAge = ms('1y');
            }
            req.session.token = sessionToken;
        }
    }
    if (usingBearer) {
        // Only attempt to set the header if `res` is a valid Response object
        // This prevents errors in contexts like WebSockets where `res` might not exist
        // or have the `set` method.
        if (typeof res?.set === 'function') {
            res.set(authOptions.authTokenHeaderKey, sessionToken);
        }
    }
}
