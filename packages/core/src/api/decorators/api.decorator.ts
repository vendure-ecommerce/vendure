import { createParamDecorator } from '@nestjs/common';
import { GraphQLResolveInfo } from 'graphql';

import { getApiType } from '../common/get-api-type';

/**
 * Resolver param decorator which returns which Api the request came though.
 * This is useful because sometimes the same resolver will have different behaviour
 * depending whether it is being called from the shop API or the admin API.
 */
export const Api = createParamDecorator((data, [root, args, ctx, info]) => {
    return getApiType(info);
});
