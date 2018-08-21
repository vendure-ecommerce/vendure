import { Connection, SelectQueryBuilder } from 'typeorm';
import { FindOptionsUtils } from 'typeorm/find-options/FindOptionsUtils';

import { Type } from '../../../shared/shared-types';
import { VendureEntity } from '../entity/base/base.entity';

import { ListQueryOptions } from './common-types';
import { parseSortParams } from './parse-sort-params';

/**
 * Creates and configures a SelectQueryBuilder for queries that return paginated lists of entities.
 */
export function buildListQuery<T extends VendureEntity>(
    connection: Connection,
    entity: Type<T>,
    options: ListQueryOptions<T>,
    relations?: string[],
): SelectQueryBuilder<T> {
    const skip = options.skip;
    let take = options.take;
    if (options.skip !== undefined && options.take === undefined) {
        take = Number.MAX_SAFE_INTEGER;
    }
    const order = parseSortParams(connection, entity, options.sort);

    const qb = connection.createQueryBuilder<T>(entity, entity.name.toLowerCase());
    FindOptionsUtils.applyFindManyOptionsOrConditionsToQueryBuilder(qb, { relations, take, skip });
    // tslint:disable-next-line:no-non-null-assertion
    FindOptionsUtils.joinEagerRelations(qb, qb.alias, qb.expressionMap.mainAlias!.metadata);

    return qb.orderBy(order);
}
