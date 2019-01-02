import { Mutation, Query, Resolver } from '@nestjs/graphql';

import { Permission, SearchResponse } from '../../../../shared/generated-types';
import { Allow } from '../../api/decorators/allow.decorator';
import { InternalServerError } from '../../common/error/errors';

@Resolver()
export class SearchResolver {
    @Query()
    @Allow(Permission.Public)
    async search(...args: any): Promise<SearchResponse> {
        throw new InternalServerError(`error.no-search-plugin-configured`);
    }

    @Mutation()
    @Allow(Permission.UpdateCatalog)
    async reindex(...args: any[]): Promise<boolean> {
        throw new InternalServerError(`error.no-search-plugin-configured`);
    }
}
