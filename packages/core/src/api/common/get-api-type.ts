import { GraphQLResolveInfo } from 'graphql';

/**
 * @description
 * Which of the GraphQL APIs the current request came via.
 *
 * @docsCategory request
 */
export type ApiType = 'admin' | 'shop';

/**
 * Inspects the GraphQL "info" resolver argument to determine which API
 * the request came through.
 */
export function getApiType(info: GraphQLResolveInfo): ApiType {
    const query = info.schema.getQueryType();
    if (query) {
        return !!query.getFields().administrators ? 'admin' : 'shop';
    }
    return 'shop';
}
