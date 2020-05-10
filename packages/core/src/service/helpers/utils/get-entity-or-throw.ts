import { ID, Type } from '@vendure/common/lib/shared-types';
import { Connection, FindOneOptions } from 'typeorm';

import { EntityNotFoundError } from '../../../common/error/errors';
import { ChannelAware, SoftDeletable } from '../../../common/types/common-types';
import { VendureEntity } from '../../../entity/base/base.entity';

import { findOneInChannel } from './channel-aware-orm-utils';

/**
 * Attempts to find an entity of the given type and id, and throws an error if not found.
 * If the entity is a ChannelAware type, then the `channelId` must be supplied or else
 * the function will "fail" by resolving to the `never` type.
 */
export async function getEntityOrThrow<T extends VendureEntity>(
    connection: Connection,
    entityType: Type<T>,
    id: ID,
    findOptions?: FindOneOptions<T>,
): Promise<T extends ChannelAware ? never : T>;
export async function getEntityOrThrow<T extends VendureEntity | ChannelAware>(
    connection: Connection,
    entityType: Type<T>,
    id: ID,
    channelId: ID,
    findOptions?: FindOneOptions<T>,
    eager?: boolean,
): Promise<T>;
export async function getEntityOrThrow<T extends VendureEntity>(
    connection: Connection,
    entityType: Type<T>,
    id: ID,
    findOptionsOrChannelId?: FindOneOptions<T> | ID,
    maybeFindOptions?: FindOneOptions<T>,
    eager?: boolean,
): Promise<T> {
    let entity: T | undefined;
    if (isId(findOptionsOrChannelId)) {
        entity = await findOneInChannel(
            connection,
            entityType,
            id,
            findOptionsOrChannelId,
            maybeFindOptions,
            eager,
        );
    } else {
        entity = await connection.getRepository(entityType).findOne(id, findOptionsOrChannelId);
    }
    if (!entity || (entity.hasOwnProperty('deletedAt') && (entity as T & SoftDeletable).deletedAt !== null)) {
        throw new EntityNotFoundError(entityType.name as any, id);
    }
    return entity;
}

function isId(value: unknown): value is ID {
    return typeof value === 'string' || typeof value === 'number';
}
