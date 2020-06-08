import { ID, Type } from '@vendure/common/lib/shared-types';
import { Connection, FindManyOptions, FindOptionsUtils } from 'typeorm';

import { ChannelAware } from '../../../common/types/common-types';
import { VendureEntity } from '../../../entity';

/**
 * Like the TypeOrm `Repository.findByIds()` method, but limits the results to
 * the given Channel.
 */
export function findByIdsInChannel<T extends ChannelAware | VendureEntity>(
    connection: Connection,
    entity: Type<T>,
    ids: ID[],
    channelId: ID,
    findOptions?: FindManyOptions<T>,
    eager = true,
) {
    //the syntax described in https://github.com/typeorm/typeorm/issues/1239#issuecomment-366955628
    //breaks if the array is empty
    if(ids.length === 0){
        return Promise.resolve([]);
    }
    
    const qb = connection.getRepository(entity).createQueryBuilder('product');
    FindOptionsUtils.applyFindManyOptionsOrConditionsToQueryBuilder(qb, findOptions);
    if (eager) {
        // tslint:disable-next-line:no-non-null-assertion
        FindOptionsUtils.joinEagerRelations(qb, qb.alias, qb.expressionMap.mainAlias!.metadata);
    }
    return qb
        .leftJoin('product.channels', 'channel')
        .andWhere("product.id IN (:...ids)", { ids })
        .andWhere('channel.id = :channelId', { channelId })
        .getMany();
}

/**
 * Like the TypeOrm `Repository.findOne()` method, but limits the results to
 * the given Channel.
 */
export function findOneInChannel<T extends ChannelAware | VendureEntity>(
    connection: Connection,
    entity: Type<T>,
    id: ID,
    channelId: ID,
    findOptions?: FindManyOptions<T>,
    eager = true,
) {
    const qb = connection.getRepository(entity).createQueryBuilder('product');
    FindOptionsUtils.applyFindManyOptionsOrConditionsToQueryBuilder(qb, findOptions);
    if (eager) {
        // tslint:disable-next-line:no-non-null-assertion
        FindOptionsUtils.joinEagerRelations(qb, qb.alias, qb.expressionMap.mainAlias!.metadata);
    }
    return qb
        .leftJoin('product.channels', 'channel')
        .andWhere('product.id = :id', { id })
        .andWhere('channel.id = :channelId', { channelId })
        .getOne();
}
