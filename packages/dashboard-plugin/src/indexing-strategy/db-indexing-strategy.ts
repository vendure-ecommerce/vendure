import { Injectable } from '@nestjs/common';
import {
    EntityHydrator,
    GlobalSettingsService,
    Injector,
    LanguageCode,
    Logger,
    RequestContext,
    RequestContextService,
    TransactionalConnection,
    Translatable,
    TranslatorService,
    VendureEntity,
} from '@vendure/core';

import { loggerCtx, notIndexableEntities } from '../constants';
import { GlobalSearchIndexItem } from '../entities/global-search-index-item';

import { GlobalIndexingStrategy } from './global-indexing-strategy';

@Injectable()
export class DbIndexingStrategy implements GlobalIndexingStrategy {
    private connection: TransactionalConnection;
    private globalSettingsService: GlobalSettingsService;
    private requestContextService: RequestContextService;
    private entityHydrator: EntityHydrator;
    private translator: TranslatorService;

    init(injector: Injector) {
        this.connection = injector.get(TransactionalConnection);
        this.globalSettingsService = injector.get(GlobalSettingsService);
        this.requestContextService = injector.get(RequestContextService);
        this.entityHydrator = injector.get(EntityHydrator);
        this.translator = injector.get(TranslatorService);
    }

    async removeFromIndex(ctx: RequestContext, entityType: string, entityId: string): Promise<boolean> {
        await this.connection.getRepository(ctx, GlobalSearchIndexItem).delete({
            entityType,
            entityId,
        });
        return true;
    }

    async updateIndex(ctx: RequestContext, entityType: string, entityId: string): Promise<boolean> {
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
                    name: String(this.getEntityName(entity)),
                    data: JSON.stringify(this.getEntityData(entity)),
                    entityCreatedAt: entity.createdAt,
                    entityUpdatedAt: entity.updatedAt,
                    enabled: this.getEntityEnabled(entity),
                },
            ],
            ['entityType', 'entityId'],
        );
        return true;
    }

    async rebuildIndex(ctx: RequestContext): Promise<boolean> {
        // First clear the existing index
        await this.connection.getRepository(ctx, GlobalSearchIndexItem).clear();

        // Then rebuild it from scratch
        return this.buildIndex(ctx);
    }

    async buildIndex(ctx: RequestContext): Promise<boolean> {
        const entityMetadatas = this.getIndexableEntities(ctx);
        let entitiesIndexed = 0;

        for (const entityType of entityMetadatas) {
            const entityMetadata = this.connection.rawConnection.getMetadata(entityType);

            await this.loopAvailableLanguages(ctx, async languageCode => {
                Logger.info(`Processing ${entityType} for language ${languageCode}`, loggerCtx);
                const languageAwareCtx = await this.requestContextService.create({
                    languageCode,
                    apiType: ctx.apiType,
                });

                const repository = this.connection.getRepository(
                    languageAwareCtx,
                    entityMetadata.target as typeof VendureEntity,
                );

                // Process entities in batches to avoid memory issues
                const pageSize = 100;
                let page = 0;
                let hasMore = true;
                const indexItems: GlobalSearchIndexItem[] = [];

                while (hasMore) {
                    // Get entities in batches
                    const entities = await repository.find({
                        skip: page * pageSize,
                        take: pageSize,
                    });

                    Logger.info(`Processing page ${page} of ${entityType}`, loggerCtx);
                    Logger.debug(`Found ${entities.length} for ${entityType} on page ${page}`, loggerCtx);

                    // If we got fewer entities than the page size, we've reached the end
                    if (entities.length < pageSize) {
                        hasMore = false;
                    }

                    // Create index items for each entity in this batch
                    const batchIndexItems = await Promise.all(
                        entities.map(async entity => {
                            if ('translations' in entity) {
                                entity = this.translator.translate(
                                    entity as Translatable & VendureEntity,
                                    languageAwareCtx,
                                );
                            }

                            return new GlobalSearchIndexItem({
                                entityType,
                                entityId: entity.id,
                                name: String(this.getEntityName(entity)),
                                data: JSON.stringify(this.getEntityData(entity)),
                                entityCreatedAt: entity.createdAt,
                                entityUpdatedAt: entity.updatedAt,
                                languageCode,
                                enabled: this.getEntityEnabled(entity),
                            });
                        }),
                    );

                    entitiesIndexed += batchIndexItems.length;

                    // Add to our collection
                    indexItems.push(...batchIndexItems);

                    // Move to next page
                    page++;
                }

                // Save all index items for this entity type
                if (indexItems.length > 0) {
                    await this.connection.getRepository(ctx, GlobalSearchIndexItem).save(indexItems);
                }
            });
        }

        Logger.info(`Indexed ${entitiesIndexed} entities`, loggerCtx);

        return true;
    }

    getIndexableEntities(ctx: RequestContext): string[] {
        const entityMetadatas = this.connection.rawConnection.entityMetadatas;
        return entityMetadatas
            .map(entityMetadata => entityMetadata.targetName)
            .filter(entityType => !notIndexableEntities.includes(entityType))
            .filter(entityType => !entityType.includes('Translation'))
            .filter(entityType => entityType !== '');
    }

    private getEntityName(entity: VendureEntity): string | number {
        if ('name' in entity && typeof entity.name === 'string') {
            return entity.name;
        }
        if ('title' in entity && typeof entity.title === 'string') {
            return entity.title;
        }
        if ('code' in entity && typeof entity.code === 'string') {
            return entity.code;
        }

        return entity.id;
    }

    private getEntityEnabled(entity: VendureEntity): boolean | null {
        if ('enabled' in entity && typeof entity.enabled === 'boolean') {
            return entity.enabled;
        }
        return null;
    }

    private getEntityData(entity: VendureEntity): Record<string, unknown> {
        const data: Record<string, unknown> = {};
        const entityAny = entity as any;
        const metadata = this.connection.rawConnection.getMetadata(entity.constructor);

        // Get all property names that are not relations
        const nonRelationProperties = metadata.columns.map(col => col.propertyName);

        for (const key of nonRelationProperties) {
            if (key === 'createdAt' || key === 'updatedAt') {
                continue;
            }
            if (typeof entityAny[key] !== 'function' && entityAny[key] !== undefined) {
                data[key] = entityAny[key];
            }
        }
        return data;
    }

    async loopAvailableLanguages(ctx: RequestContext, cb: (languageCode: LanguageCode) => Promise<void>) {
        const settings = await this.globalSettingsService.getSettings(ctx);
        for (const languageCode of settings.availableLanguages) {
            await cb(languageCode);
        }
    }
}
