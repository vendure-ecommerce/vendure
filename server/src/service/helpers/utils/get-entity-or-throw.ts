import { Connection, FindOneOptions } from 'typeorm';

import { ID, Type } from '../../../../../shared/shared-types';
import { EntityNotFoundError } from '../../../common/error/errors';
import { VendureEntity } from '../../../entity/base/base.entity';

/**
 * Attempts to find an entity of the given type and id, and throws an error if not found.
 */
export async function getEntityOrThrow<T extends VendureEntity>(
    connection: Connection,
    entityType: Type<T>,
    id: ID,
    findOptions?: FindOneOptions<T>,
): Promise<T> {
    const entity = await connection.getRepository(entityType).findOne(id, findOptions);
    if (!entity) {
        throw new EntityNotFoundError(entityType.name as any, id);
    }
    return entity;
}
