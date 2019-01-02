import { Args, Query, Resolver } from '@nestjs/graphql';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import { Permission } from '../../../../shared/generated-types';
import { Allow } from '../../api/decorators/allow.decorator';
import { SearchResolver as BaseSearchResolver } from '../../api/resolvers/search.resolver';

import { SearchIndexItem } from './search-index-item.entity';

@Resolver()
export class FulltextSearchResolver extends BaseSearchResolver {
    constructor(@InjectConnection() private connection: Connection) {
        super();
    }

    @Query()
    @Allow(Permission.Public)
    async search(@Args() args: any) {
        return this.connection
            .getRepository(SearchIndexItem)
            .createQueryBuilder('si')
            .addSelect(`MATCH (productName) AGAINST ('${args.input.term}')`, 'score')
            .orderBy('score', 'DESC')
            .getMany()
            .then(res => {
                return res;
            });
    }
}
