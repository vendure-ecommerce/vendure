import { ContextType, createParamDecorator, ExecutionContext } from '@nestjs/common';

import { internal_getRequestContext } from '../common/request-context';

/**
 * @description
 * Resolver param decorator which extracts the {@link RequestContext} from the incoming
 * request object.
 *
 * @example
 * ```ts
 *  \@Query()
 *  getAdministrators(\@Ctx() ctx: RequestContext) {
 *      // ...
 *  }
 * ```
 *
 * @docsCategory request
 * @docsPage Ctx Decorator
 */
export const Ctx = createParamDecorator((data, ctx: ExecutionContext) => {
    if (ctx.getType<ContextType | 'graphql'>() === 'graphql') {
        // GraphQL request
        return internal_getRequestContext(ctx.getArgByIndex(2).req, ctx);
    } else {
        // REST request
        return internal_getRequestContext(ctx.switchToHttp().getRequest(), ctx);
    }
});
