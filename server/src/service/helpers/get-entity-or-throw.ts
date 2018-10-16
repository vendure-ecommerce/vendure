import { ID, Type } from 'shared/shared-types';
import { Connection } from 'typeorm';

import { VendureEntity } from '../../entity/base/base.entity';
import { I18nError } from '../../i18n/i18n-error';

/**
 * Attempts to find an entity of the given type and id, and throws an error if not found.
 */
export async function getEntityOrThrow<T extends VendureEntity>(
    connection: Connection,
    entityType: Type<T>,
    id: ID,
): Promise<T> {
    const entity = await connection.getRepository(entityType).findOne(id);
    if (!entity) {
        throw new I18nError(`error.entity-with-id-not-found`, {
            entityName: entityType.name,
            id,
        });
    }
    return entity;
}
