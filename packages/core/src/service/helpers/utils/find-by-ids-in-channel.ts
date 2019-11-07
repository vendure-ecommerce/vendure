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
) {
    const qb = connection.getRepository(entity).createQueryBuilder('product');
    FindOptionsUtils.applyFindManyOptionsOrConditionsToQueryBuilder(qb, findOptions);
    // tslint:disable-next-line:no-non-null-assertion
    FindOptionsUtils.joinEagerRelations(qb, qb.alias, qb.expressionMap.mainAlias!.metadata);
    return qb
        .leftJoin('product.channels', 'channel')
        .andWhere('channel.id = :channelId', { channelId })
        .getMany();
}
