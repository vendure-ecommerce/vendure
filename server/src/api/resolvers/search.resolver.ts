import { Mutation, Query, ResolveProperty, Resolver } from '@nestjs/graphql';

import { Permission, SearchResponse } from '../../../../shared/generated-types';
import { Omit } from '../../../../shared/omit';
import { Allow } from '../../api/decorators/allow.decorator';
import { InternalServerError } from '../../common/error/errors';
import { Translated } from '../../common/types/locale-types';
import { FacetValue } from '../../entity';

@Resolver()
export class SearchResolver {
    @Query()
    @Allow(Permission.Public)
    async search(...args: any): Promise<Omit<SearchResponse, 'facetValues'>> {
        throw new InternalServerError(`error.no-search-plugin-configured`);
    }

    @ResolveProperty()
    async facetValues(...args: any[]): Promise<Array<Translated<FacetValue>>> {
        throw new InternalServerError(`error.no-search-plugin-configured`);
    }

    @Mutation()
    @Allow(Permission.UpdateCatalog)
    async reindex(...args: any[]): Promise<boolean> {
        throw new InternalServerError(`error.no-search-plugin-configured`);
    }
}
