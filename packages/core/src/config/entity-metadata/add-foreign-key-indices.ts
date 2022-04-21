import { Index } from 'typeorm';
import { MetadataArgsStorage } from 'typeorm/metadata-args/MetadataArgsStorage';

import { StockMovement } from '../../entity/stock-movement/stock-movement.entity';

import { EntityMetadataModifier } from './entity-metadata-modifier';

/**
 * @description
 * Dynamically adds `@Index()` metadata to all many-to-one relations. These are already added
 * by default in MySQL/MariaDB, but not in Postgres. So this modification can lead to improved
 * performance with Postgres - especially when dealing with large numbers of products, orders etc.
 *
 * See https://github.com/vendure-ecommerce/vendure/issues/1502
 *
 * TODO: In v2 we will add the Index to all relations manually, this making this redundant.
 */
export const addForeignKeyIndices: EntityMetadataModifier = (metadata: MetadataArgsStorage) => {
    for (const relationMetadata of metadata.relations) {
        const { relationType, target } = relationMetadata;
        if (relationType === 'many-to-one') {
            const embeddedIn = metadata.embeddeds.find(e => e.type() === relationMetadata.target)?.target;
            const targetClass = (embeddedIn ?? target) as FunctionConstructor;
            if (typeof targetClass === 'function') {
                const instance = new targetClass();
                if (!(instance instanceof StockMovement)) {
                    Index()(instance, relationMetadata.propertyName);
                }
            }
        }
    }
};
