import { createParamDecorator } from '@nestjs/common';

import { REQUEST_CONTEXT_KEY } from '../common/request-context.service';

/**
 * @description
 * Resolver param decorator which extracts the {@link RequestContext} from the incoming
 * request object.
 *
 * @example
 * ```TypeScript
 *  \@Query()
 *  getAdministrators(\@Ctx() ctx: RequestContext) {
 *      // ...
 *  }
 * ```
 *
 * @docsCategory request
 * @docsPage Decorators
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
