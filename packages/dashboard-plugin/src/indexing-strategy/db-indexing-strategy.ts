import { Injectable } from '@nestjs/common';
import { Injector, RequestContext, TransactionalConnection, VendureEntity } from '@vendure/core';
import { getMetadataArgsStorage, EntityMetadata } from 'typeorm';

import { GlobalSearchIndexItem } from '../entities/global-search-index-item';

import { GlobalIndexingStrategy } from './global-indexing-strategy';

@Injectable()
export class DbIndexingStrategy implements GlobalIndexingStrategy {
    private connection: TransactionalConnection;

    init(injector: Injector): void | Promise<void> {
        this.connection = injector.get(TransactionalConnection);
    }

    async removeFromIndex(ctx: RequestContext, entityType: string, entityId: string): Promise<void> {
        await this.connection.getRepository(ctx, GlobalSearchIndexItem).delete({
            entityType,
            entityId,
        });
    }

    async updateIndex(ctx: RequestContext, entityType: string, entityId: string): Promise<void> {
        const entity = (await this.connection.getRepository(ctx, entityType).findOne({
            where: {
                id: entityId,
            },
        })) as VendureEntity;

        if (!entity) {
            throw new Error(`Entity with id ${entityId} not found`);
        }

        await this.connection.getRepository(ctx, GlobalSearchIndexItem).upsert(
            [
                {
                    entityType,
                    entityId: entity.id,
                    name: this.getEntityName(entity),
                    data: JSON.stringify(this.getEntityData(entity)),
                    entityCreatedAt: entity.createdAt,
                    entityUpdatedAt: entity.updatedAt,
                },
            ],
            ['entityType', 'entityId'],
        );
    }

    async rebuildIndex(ctx: RequestContext): Promise<void> {
        // First clear the existing index
        await this.connection.getRepository(ctx, GlobalSearchIndexItem).clear();

        // Then rebuild it from scratch
        await this.buildIndex(ctx);
    }

    async buildIndex(ctx: RequestContext): Promise<void> {
        const entityMetadatas = this.connection.rawConnection.entityMetadatas;

        for (const entityMetadata of entityMetadatas) {
            const entityType = entityMetadata.targetName;
            const repository = this.connection.getRepository(
                ctx,
                entityMetadata.target as typeof VendureEntity,
            );

            // Get all entities of this type
            const entities = await repository.find();

            // Create index items for each entity
            const indexItems = entities.map(entity => {
                const indexItem = new GlobalSearchIndexItem({
                    entityType,
                    entityId: entity.id,
                    name: this.getEntityName(entity),
                    data: JSON.stringify(this.getEntityData(entity)),
                    entityCreatedAt: entity.createdAt,
                    entityUpdatedAt: entity.updatedAt,
                });
                return indexItem;
            });

            // Save all index items for this entity type
            if (indexItems.length > 0) {
                await this.connection.getRepository(ctx, GlobalSearchIndexItem).save(indexItems);
            }
        }
    }

    private getEntityName(entity: VendureEntity): string {
        // Try to get a meaningful name for the entity
        const entityAny = entity as any;
        if (entityAny.name) {
            return entityAny.name;
        }
        if (entityAny.title) {
            return entityAny.title;
        }
        if (entityAny.code) {
            return entityAny.code;
        }
        return entity.id.toString();
    }

    private getEntityData(entity: VendureEntity): Record<string, unknown> {
        // Get all properties of the entity that are not functions or undefined
        const data: Record<string, unknown> = {};
        const entityAny = entity as any;
        for (const key in entityAny) {
            if (typeof entityAny[key] !== 'function' && entityAny[key] !== undefined) {
                data[key] = entityAny[key];
            }
        }
        return data;
    }
}
