import { Injector, Logger, TransactionalConnection, VendureEntity } from '@vendure/core';
import { EntityMetadata } from 'typeorm';

import { Serializable } from 'node:child_process';
import { loggerCtx } from '../constants';
import { EntityDataMapperService } from '../entity-data-mapper/entity-data-mapper.service';
import { EntitySearchIndexItem } from '../types';
import { BaseDataProcessor } from './base-data-processor';

export class EntitiesDataProcessor extends BaseDataProcessor {
    private connection: TransactionalConnection;
    private entityDataMapperService: EntityDataMapperService;
    private entityMetadatas: EntityMetadata[] = [];
    private batchSize = 100;

    init(injector: Injector) {
        super.init(injector);
        this.connection = injector.get(TransactionalConnection);
        this.entityDataMapperService = injector.get(EntityDataMapperService);

        // Get all entity metadata from TypeORM DataSource
        this.entityMetadatas = this.connection.rawConnection.entityMetadatas;
        Logger.info(`Found ${this.entityMetadatas.length} entities to process for search indexing`);
    }

    getBatchSize(): number {
        return this.batchSize;
    }

    async getTotalResults(metadata: Record<string, Serializable> | undefined): Promise<number> {
        if (!metadata?.entityName) {
            Logger.error(`Entity target is required`, loggerCtx);
            return 0;
        }

        const entityMetadata = this.entityMetadatas.find(em => em.targetName === metadata.entityName);

        if (!entityMetadata) {
            Logger.error(`Could not find entity metadata for ${metadata.entityName}`, loggerCtx);
            return 0;
        }

        try {
            const repository = this.connection.rawConnection.getRepository(entityMetadata.target);
            return await repository.count();
        } catch (error) {
            Logger.error(`Failed to count entities for ${metadata.entityName}: ${error}`);
            return 0;
        }
    }

    async *processBatch(
        skip: number,
        limit: number,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        metadata: Record<string, any> | undefined,
    ): AsyncGenerator<void> {
        let processedCount = 0;
        let currentSkip = skip;

        for (const entityMetadata of this.entityMetadatas) {
            try {
                const repository = this.connection.rawConnection.getRepository(entityMetadata.target);
                const totalInEntity = await repository.count();

                // Calculate how many to skip/take from this entity
                if (currentSkip >= totalInEntity) {
                    currentSkip -= totalInEntity;
                    continue;
                }

                const takeFromEntity = Math.min(limit - processedCount, totalInEntity - currentSkip);

                const entities = (await repository.find({
                    skip: currentSkip,
                    take: takeFromEntity,
                })) as VendureEntity[];

                const searchIndexItems: EntitySearchIndexItem[] = [];

                for (const entity of entities) {
                    const searchIndexItem = await this.mapEntityToSearchIndexItem(entity, entityMetadata);
                    if (searchIndexItem) {
                        searchIndexItems.push(searchIndexItem);
                    }
                }

                if (searchIndexItems.length > 0) {
                    await this.searchIndexingStrategy.persist(searchIndexItems);
                }

                processedCount += entities.length;
                currentSkip = 0; // Reset for next entity type

                yield;

                if (processedCount >= limit) {
                    break;
                }
            } catch (error) {
                Logger.error(`Failed to process batch for entity ${entityMetadata.name}: ${error}`);
            }
        }
    }

    async processOne(id: string, metadata: Record<string, Serializable> | undefined): Promise<void> {
        if (!metadata?.entityName) {
            Logger.error(`Entity metadata is required`, loggerCtx);
            return;
        }

        const entityName = metadata.entityName as string;
        const entityMetadata = this.entityMetadatas.find(m => m.name === entityName);

        if (!entityMetadata) {
            Logger.warn(`Entity type ${entityName} not found in registered entities`, loggerCtx);
            return;
        }

        try {
            const repository = this.connection.rawConnection.getRepository(entityMetadata.target);
            const entity = (await repository.findOne({ where: { id } })) as VendureEntity | null;

            if (entity) {
                const searchIndexItem = await this.mapEntityToSearchIndexItem(entity, entityMetadata);
                if (searchIndexItem) {
                    await this.searchIndexingStrategy.persist([searchIndexItem]);
                }
            } else {
                Logger.warn(`Entity ${entityName} with id ${id} not found`);
                // Remove from index if entity no longer exists
                await this.searchIndexingStrategy.remove(`entity_${entityName}_${id}`);
            }
        } catch (error) {
            Logger.error(`Failed to process entity ${entityName} with id ${id}: ${error}`);
        }

        return;
    }

    private async mapEntityToSearchIndexItem(
        entity: VendureEntity,
        metadata: EntityMetadata,
    ): Promise<EntitySearchIndexItem | null> {
        const mappedData = await this.entityDataMapperService.map(metadata.name, entity);

        return {
            ...mappedData,
            entityId: entity.id,
            entityName: metadata.name,
        };
    }
}
