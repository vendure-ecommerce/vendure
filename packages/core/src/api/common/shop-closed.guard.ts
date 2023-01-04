import { CanActivate, ContextType, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { RequestContext } from '..';
import { REQUEST_CONTEXT_KEY, REQUEST_CONTEXT_MAP_KEY } from '../../common/constants';

@Injectable()
export class ShopClosedGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const venctx: RequestContext = getCtx(context);
        if (!venctx.channel.customFields.isOpen) {
            throw new Error('This store is closed');
        }
        return true;
    }
}

const getCtx = (ctx: ExecutionContext) => {
    const getContext = (req: any) => {
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
};
