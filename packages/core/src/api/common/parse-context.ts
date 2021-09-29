import { ArgumentsHost, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request, Response } from 'express';
import { GraphQLResolveInfo } from 'graphql';

export type RestContext = { req: Request; res: Response; isGraphQL: false; info: undefined };
export type GraphQLContext = {
    req: Request;
    res: Response;
    isGraphQL: true;
    info: GraphQLResolveInfo;
};

/**
 * Parses in the Nest ExecutionContext of the incoming request, accounting for both
 * GraphQL & REST requests.
 */
export function parseContext(context: ExecutionContext | ArgumentsHost): RestContext | GraphQLContext {
    // TODO: Remove this check once this issue is resolved: https://github.com/nestjs/graphql/pull/1469
    if ((context as ExecutionContext).getHandler?.()?.name === '__resolveType') {
        return {
            req: context.getArgs()[1].req,
            res: context.getArgs()[1].res,
            isGraphQL: false,
            info: undefined,
        };
    }

    const graphQlContext = GqlExecutionContext.create(context as ExecutionContext);
    const info = graphQlContext.getInfo();
    let req: Request;
    let res: Response;
    if (info) {
        const ctx = graphQlContext.getContext();
        req = ctx.req;
        res = ctx.res;
    } else {
        req = context.switchToHttp().getRequest();
        res = context.switchToHttp().getResponse();
    }
    return {
        req,
        res,
        info,
        isGraphQL: !!info,
    };
}
