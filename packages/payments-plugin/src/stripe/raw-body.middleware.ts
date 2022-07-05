import { json } from 'body-parser';
import { ServerResponse } from 'http';

import { RequestWithRawBody } from './types';

/**
 * Middleware which adds the raw request body to the incoming message object. This is needed by
 * Stripe to properly verify webhook events.
 */
export const rawBodyMiddleware = json({
    verify(req: RequestWithRawBody, _: ServerResponse, buf: Buffer) {
        if (Buffer.isBuffer(buf)) {
            req.rawBody = Buffer.from(buf);
        }

        return true;
    },
});
