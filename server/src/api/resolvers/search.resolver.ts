import { Args, Query, Resolver } from '@nestjs/graphql';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import { Permission } from '../../../../shared/generated-types';
import { Allow } from '../../api/decorators/allow.decorator';
import { InternalServerError } from '../../common/error/errors';

@Resolver()
export class SearchResolver {
    @Query()
    @Allow(Permission.Public)
    async search(@Args() args: any): Promise<any[]> {
        throw new InternalServerError(`error.no-search-plugin-configured`);
    }
}
