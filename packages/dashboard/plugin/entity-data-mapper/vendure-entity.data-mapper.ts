import { VendureEntity } from '@vendure/core';

import { EntitySearchIndexItem } from '../types';

import { EntityDataMapper } from './entity-data-mapper.interface';

export abstract class VendureEntityDataMapper implements EntityDataMapper {
    map(entity: VendureEntity): Partial<EntitySearchIndexItem> {
        return {
            entityId: entity.id,
            lastModified: entity.updatedAt ?? entity.createdAt,
        };
    }
}
