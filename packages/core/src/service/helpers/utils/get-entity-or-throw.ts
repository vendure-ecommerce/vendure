import { ID, Type } from '@vendure/common/shared-types';
import { Connection, FindOneOptions } from 'typeorm';

import { EntityNotFoundError } from '../../../common/error/errors';
import { SoftDeletable } from '../../../common/types/common-types';
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
    if (!entity || (entity.hasOwnProperty('deletedAt') && (entity as T & SoftDeletable).deletedAt !== null)) {
        throw new EntityNotFoundError(entityType.name as any, id);
    }
    return entity;
}
