import { ContextType, createParamDecorator, ExecutionContext } from '@nestjs/common';

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
export const Ctx = createParamDecorator((data, ctx: ExecutionContext) => {
    if (ctx.getType<ContextType | 'graphql'>() === 'graphql') {
        // GraphQL request
        return ctx.getArgByIndex(2).req[REQUEST_CONTEXT_KEY];
    } else {
        // REST request
        return ctx.switchToHttp().getRequest()[REQUEST_CONTEXT_KEY];
    }
});
