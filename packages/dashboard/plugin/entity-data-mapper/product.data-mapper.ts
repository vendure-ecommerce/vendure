import { Product } from '@vendure/core';

import { EntitySearchIndexItem } from '../types';

import { VendureEntityDataMapper } from './vendure-entity.data-mapper';

export class ProductDataMapper extends VendureEntityDataMapper {
    map(entity: Product): Partial<EntitySearchIndexItem> {
        const product = super.map(entity);

        return {
            ...product,
            entityName: Product.name,
            thumbnailUrl: entity.featuredAsset ? entity.featuredAsset.preview : undefined,
            title: entity.name,
            description: entity.description,
            metadata: {
                enabled: entity.enabled,
            },
        };
    }
}
