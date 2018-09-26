import { Context } from '@nestjs/graphql';

import { REQUEST_CONTEXT_KEY } from './request-context.service';

/**
 * Resolver param decorator which extracts the RequestContext from the incoming
 * request object.
 */
export function Ctx() {
    return Context('req', {
        transform(req) {
            return req[REQUEST_CONTEXT_KEY];
        },
    });
}
