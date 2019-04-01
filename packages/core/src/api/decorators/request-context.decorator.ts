import { createParamDecorator } from '@nestjs/common';

import { REQUEST_CONTEXT_KEY } from '../common/request-context.service';

/**
 * Resolver param decorator which extracts the RequestContext from the incoming
 * request object.
 */
export const Ctx = createParamDecorator((data, [root, args, ctx]) => {
    return ctx.req[REQUEST_CONTEXT_KEY];
});
