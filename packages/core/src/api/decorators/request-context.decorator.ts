import { createParamDecorator } from '@nestjs/common';

import { REQUEST_CONTEXT_KEY } from '../common/request-context.service';

/**
 * Resolver param decorator which extracts the RequestContext from the incoming
 * request object.
 */
export const Ctx = createParamDecorator((data, arg) => {
    if (Array.isArray(arg)) {
        // GraphQL request
        return arg[2].req[REQUEST_CONTEXT_KEY];
    } else {
        // REST request
        return arg[REQUEST_CONTEXT_KEY];
    }
});
