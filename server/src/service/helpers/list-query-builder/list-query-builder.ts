import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { ID, Type } from 'shared/shared-types';
import { Connection, FindConditions, FindManyOptions, FindOneOptions, SelectQueryBuilder } from 'typeorm';
import { FindOptionsUtils } from 'typeorm/find-options/FindOptionsUtils';

import { ListQueryOptions } from '../../../common/types/common-types';
import { VendureEntity } from '../../../entity/base/base.entity';

import { parseChannelParam } from './parse-channel-param';
import { parseFilterParams } from './parse-filter-params';
import { parseSortParams } from './parse-sort-params';

export type ExtendedListQueryOptions<T extends VendureEntity> = {
    relations?: string[];
    channelId?: ID;
    where?: FindConditions<T>;
    orderBy?: FindOneOptions<T>['order'];
};

@Injectable()
export class ListQueryBuilder {
    constructor(@InjectConnection() private connection: Connection) {}

    /**
     * Creates and configures a SelectQueryBuilder for queries that return paginated lists of entities.
     */
    build<T extends VendureEntity>(
        entity: Type<T>,
        options: ListQueryOptions<T> = {},
        extendedOptions: ExtendedListQueryOptions<T> = {},
    ): SelectQueryBuilder<T> {
        const skip = options.skip;
        let take = options.take;
        if (options.skip !== undefined && options.take === undefined) {
            take = Number.MAX_SAFE_INTEGER;
        }
        const sort = parseSortParams(this.connection, entity, options.sort);
        const filter = parseFilterParams(this.connection, entity, options.filter);

        const qb = this.connection.createQueryBuilder<T>(entity, entity.name.toLowerCase());
        FindOptionsUtils.applyFindManyOptionsOrConditionsToQueryBuilder(qb, {
            relations: extendedOptions.relations,
            take,
            skip,
            where: extendedOptions.where || {},
        } as FindManyOptions<T>);
        // tslint:disable-next-line:no-non-null-assertion
        FindOptionsUtils.joinEagerRelations(qb, qb.alias, qb.expressionMap.mainAlias!.metadata);

        filter.forEach(({ clause, parameters }, index) => {
            if (index === 0) {
                qb.where(clause, parameters);
            } else {
                qb.andWhere(clause, parameters);
            }
        });

        if (extendedOptions.channelId) {
            const channelFilter = parseChannelParam(this.connection, entity, extendedOptions.channelId);
            if (channelFilter) {
                qb.andWhere(channelFilter.clause, channelFilter.parameters);
            }
        }

        return qb.orderBy(sort);
    }
}
