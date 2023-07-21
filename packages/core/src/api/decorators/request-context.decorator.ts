import { ContextType, createParamDecorator, ExecutionContext } from '@nestjs/common';

import { REQUEST_CONTEXT_KEY, REQUEST_CONTEXT_MAP_KEY } from '../../common/constants';

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
    const getContext = (req: any) => {
        // eslint-disable-next-line @typescript-eslint/ban-types
        const map: Map<Function, any> | undefined = req[REQUEST_CONTEXT_MAP_KEY];

        // If a map contains associated transactional context with this handler
        // we have to use it. It means that this handler was wrapped with @Transaction decorator.
        // Otherwise use default context.
        return map?.get(ctx.getHandler()) || req[REQUEST_CONTEXT_KEY];
    };

    if (ctx.getType<ContextType | 'graphql'>() === 'graphql') {
        // GraphQL request
        return getContext(ctx.getArgByIndex(2).req);
    } else {
        // REST request
        return getContext(ctx.switchToHttp().getRequest());
    }
});
