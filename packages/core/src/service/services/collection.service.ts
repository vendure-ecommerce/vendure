import { Injectable, OnModuleInit } from '@nestjs/common';
import {
    ConfigurableOperation,
    ConfigurableOperationDefinition,
    CreateCollectionInput,
    DeletionResponse,
    DeletionResult,
    MoveCollectionInput,
    UpdateCollectionInput,
} from '@vendure/common/lib/generated-types';
import { pick } from '@vendure/common/lib/pick';
import { ROOT_COLLECTION_NAME } from '@vendure/common/lib/shared-constants';
import { ID, PaginatedList } from '@vendure/common/lib/shared-types';
import { merge } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { RequestContext, SerializedRequestContext } from '../../api/common/request-context';
import { IllegalOperationError } from '../../common/error/errors';
import { ListQueryOptions } from '../../common/types/common-types';
import { Translated } from '../../common/types/locale-types';
import { assertFound, idsAreEqual } from '../../common/utils';
import { ConfigService } from '../../config/config.service';
import { Logger } from '../../config/logger/vendure-logger';
import { FacetValue } from '../../entity';
import { CollectionTranslation } from '../../entity/collection/collection-translation.entity';
import { Collection } from '../../entity/collection/collection.entity';
import { ProductVariant } from '../../entity/product-variant/product-variant.entity';
import { EventBus } from '../../event-bus/event-bus';
import { CollectionModificationEvent } from '../../event-bus/events/collection-modification-event';
import { ProductEvent } from '../../event-bus/events/product-event';
import { ProductVariantEvent } from '../../event-bus/events/product-variant-event';
import { JobQueue } from '../../job-queue/job-queue';
import { JobQueueService } from '../../job-queue/job-queue.service';
import { ConfigArgService } from '../helpers/config-arg/config-arg.service';
import { CustomFieldRelationService } from '../helpers/custom-field-relation/custom-field-relation.service';
import { ListQueryBuilder } from '../helpers/list-query-builder/list-query-builder';
import { SlugValidator } from '../helpers/slug-validator/slug-validator';
import { TranslatableSaver } from '../helpers/translatable-saver/translatable-saver';
import { moveToIndex } from '../helpers/utils/move-to-index';
import { translateDeep } from '../helpers/utils/translate-entity';
import { TransactionalConnection } from '../transaction/transactional-connection';

import { AssetService } from './asset.service';
import { ChannelService } from './channel.service';
import { FacetValueService } from './facet-value.service';

type ApplyCollectionFiltersJobData = { ctx: SerializedRequestContext; collectionIds: ID[]; applyToChangedVariantsOnly?: boolean; };

@Injectable()
export class CollectionService implements OnModuleInit {
    private rootCollection: Translated<Collection> | undefined;
    private applyFiltersQueue: JobQueue<ApplyCollectionFiltersJobData>;

    constructor(
        private connection: TransactionalConnection,
        private channelService: ChannelService,
        private assetService: AssetService,
        private facetValueService: FacetValueService,
        private listQueryBuilder: ListQueryBuilder,
        private translatableSaver: TranslatableSaver,
        private eventBus: EventBus,
        private jobQueueService: JobQueueService,
        private configService: ConfigService,
        private slugValidator: SlugValidator,
        private configArgService: ConfigArgService,
        private customFieldRelationService: CustomFieldRelationService,
    ) {
    }

    async onModuleInit() {
        const productEvents$ = this.eventBus.ofType(ProductEvent);
        const variantEvents$ = this.eventBus.ofType(ProductVariantEvent);

        merge(productEvents$, variantEvents$)
            .pipe(debounceTime(50))
            .subscribe(async event => {
                const collections = await this.connection.getRepository(Collection).find();
                await this.applyFiltersQueue.add({
                    ctx: event.ctx.serialize(),
                    collectionIds: collections.map(c => c.id),
                });
            });

        this.applyFiltersQueue = await this.jobQueueService.createQueue({
            name: 'apply-collection-filters',
            process: async job => {
                const ctx = RequestContext.deserialize(job.data.ctx);

                Logger.verbose(`Processing ${job.data.collectionIds.length} Collections`);
                let completed = 0;
                for (const collectionId of job.data.collectionIds) {
                    let collection: Collection | undefined;
                    try {
                        collection = await this.connection.getEntityOrThrow(ctx, Collection, collectionId, {
                            retries: 5,
                            retryDelay: 50,
                        });
                    } catch (err) {
                        Logger.warn(`Could not find Collection with id ${collectionId}, skipping`);
                    }
                    completed++;
                    if (collection) {
                        const affectedVariantIds = await this.applyCollectionFiltersInternal(collection, job.data.applyToChangedVariantsOnly);
                        job.setProgress(Math.ceil((completed / job.data.collectionIds.length) * 100));
                        this.eventBus.publish(
                            new CollectionModificationEvent(ctx, collection, affectedVariantIds),
                        );
                    }
                }
            },
        });
    }

    async findAll(
        ctx: RequestContext,
        options?: ListQueryOptions<Collection>,
    ): Promise<PaginatedList<Translated<Collection>>> {
        const relations = ['featuredAsset', 'parent', 'channels'];

        return this.listQueryBuilder
            .build(Collection, options, {
                relations,
                channelId: ctx.channelId,
                where: { isRoot: false },
                orderBy: { position: 'ASC' },
                ctx,
            })
            .getManyAndCount()
            .then(async ([collections, totalItems]) => {
                const items = collections.map(collection =>
                    translateDeep(collection, ctx.languageCode, ['parent']),
                );
                return {
                    items,
                    totalItems,
                };
            });
    }

    async findOne(ctx: RequestContext, collectionId: ID): Promise<Translated<Collection> | undefined> {
        const relations = ['featuredAsset', 'assets', 'channels', 'parent'];
        const collection = await this.connection.findOneInChannel(
            ctx,
            Collection,
            collectionId,
            ctx.channelId,
            {
                relations,
                loadEagerRelations: true,
            },
        );
        if (!collection) {
            return;
        }
        return translateDeep(collection, ctx.languageCode, ['parent']);
    }

    async findByIds(ctx: RequestContext, ids: ID[]): Promise<Array<Translated<Collection>>> {
        const relations = ['featuredAsset', 'assets', 'channels', 'parent'];
        const collections = this.connection.findByIdsInChannel(ctx, Collection, ids, ctx.channelId, {
            relations,
            loadEagerRelations: true,
        });
        return collections.then(values =>
            values.map(collection => translateDeep(collection, ctx.languageCode, ['parent'])),
        );
    }

    async findOneBySlug(ctx: RequestContext, slug: string): Promise<Translated<Collection> | undefined> {
        const translations = await this.connection.getRepository(ctx, CollectionTranslation).find({
            relations: ['base'],
            where: { slug },
        });

        if (!translations?.length) {
            return;
        }
        const bestMatch =
            translations.find(t => t.languageCode === ctx.languageCode) ??
            translations.find(t => t.languageCode === ctx.channel.defaultLanguageCode) ??
            translations[0];
        return this.findOne(ctx, bestMatch.base.id);
    }

    getAvailableFilters(ctx: RequestContext): ConfigurableOperationDefinition[] {
        return this.configService.catalogOptions.collectionFilters.map(f => f.toGraphQlType(ctx));
    }

    async getParent(ctx: RequestContext, collectionId: ID): Promise<Collection | undefined> {
        const parentIdSelect =
            this.connection.rawConnection.options.type === 'postgres'
                ? '"child"."parentId"'
                : 'child.parentId';
        const parent = await this.connection
            .getRepository(ctx, Collection)
            .createQueryBuilder('collection')
            .leftJoinAndSelect('collection.translations', 'translation')
            .where(
                qb =>
                    `collection.id = ${qb
                        .subQuery()
                        .select(parentIdSelect)
                        .from(Collection, 'child')
                        .where('child.id = :id', { id: collectionId })
                        .getQuery()}`,
            )
            .getOne();

        return parent && translateDeep(parent, ctx.languageCode);
    }

    async getChildren(ctx: RequestContext, collectionId: ID): Promise<Collection[]> {
        return this.getDescendants(ctx, collectionId, 1);
    }

    async getBreadcrumbs(
        ctx: RequestContext,
        collection: Collection,
    ): Promise<Array<{ name: string; id: ID }>> {
        const rootCollection = await this.getRootCollection(ctx);
        if (idsAreEqual(collection.id, rootCollection.id)) {
            return [pick(rootCollection, ['id', 'name', 'slug'])];
        }
        const pickProps = pick(['id', 'name', 'slug']);
        const ancestors = await this.getAncestors(collection.id, ctx);
        return [pickProps(rootCollection), ...ancestors.map(pickProps).reverse(), pickProps(collection)];
    }

    async getCollectionsByProductId(
        ctx: RequestContext,
        productId: ID,
        publicOnly: boolean,
    ): Promise<Array<Translated<Collection>>> {
        const qb = this.connection
            .getRepository(ctx, Collection)
            .createQueryBuilder('collection')
            .leftJoinAndSelect('collection.translations', 'translation')
            .leftJoin('collection.productVariants', 'variant')
            .where('variant.product = :productId', { productId })
            .groupBy('collection.id, translation.id')
            .orderBy('collection.id', 'ASC');

        if (publicOnly) {
            qb.andWhere('collection.isPrivate = :isPrivate', { isPrivate: false });
        }
        const result = await qb.getMany();

        return result.map(collection => translateDeep(collection, ctx.languageCode));
    }

    /**
     * Returns the descendants of a Collection as a flat array. The depth of the traversal can be limited
     * with the maxDepth argument. So to get only the immediate children, set maxDepth = 1.
     */
    async getDescendants(
        ctx: RequestContext,
        rootId: ID,
        maxDepth: number = Number.MAX_SAFE_INTEGER,
    ): Promise<Array<Translated<Collection>>> {
        const getChildren = async (id: ID, _descendants: Collection[] = [], depth = 1) => {
            const children = await this.connection
                .getRepository(ctx, Collection)
                .find({ where: { parent: { id } } });
            for (const child of children) {
                _descendants.push(child);
                if (depth < maxDepth) {
                    await getChildren(child.id, _descendants, depth++);
                }
            }
            return _descendants;
        };

        const descendants = await getChildren(rootId);
        return descendants.map(c => translateDeep(c, ctx.languageCode));
    }

    /**
     * Gets the ancestors of a given collection. Note that since ProductCategories are implemented as an adjacency list, this method
     * will produce more queries the deeper the collection is in the tree.
     */
    getAncestors(collectionId: ID): Promise<Collection[]>;
    getAncestors(collectionId: ID, ctx: RequestContext): Promise<Array<Translated<Collection>>>;
    async getAncestors(
        collectionId: ID,
        ctx?: RequestContext,
    ): Promise<Array<Translated<Collection> | Collection>> {
        const getParent = async (id: ID, _ancestors: Collection[] = []): Promise<Collection[]> => {
            const parent = await this.connection
                .getRepository(ctx, Collection)
                .createQueryBuilder()
                .relation(Collection, 'parent')
                .of(id)
                .loadOne();
            if (parent) {
                if (!parent.isRoot) {
                    _ancestors.push(parent);
                    return getParent(parent.id, _ancestors);
                }
            }
            return _ancestors;
        };
        const ancestors = await getParent(collectionId);

        return this.connection
            .getRepository(Collection)
            .findByIds(ancestors.map(c => c.id))
            .then(categories => {
                const resultCategories: Array<Collection | Translated<Collection>> = [];
                ancestors.forEach(a => {
                    const category = categories.find(c => c.id === a.id);
                    if (category) {
                        resultCategories.push(ctx ? translateDeep(category, ctx.languageCode) : category);
                    }
                });
                return resultCategories;
            });
    }

    async create(ctx: RequestContext, input: CreateCollectionInput): Promise<Translated<Collection>> {
        await this.slugValidator.validateSlugs(ctx, input, CollectionTranslation);
        const collection = await this.translatableSaver.create({
            ctx,
            input,
            entityType: Collection,
            translationType: CollectionTranslation,
            beforeSave: async coll => {
                await this.channelService.assignToCurrentChannel(coll, ctx);
                const parent = await this.getParentCollection(ctx, input.parentId);
                if (parent) {
                    coll.parent = parent;
                }
                coll.position = await this.getNextPositionInParent(ctx, input.parentId || undefined);
                coll.filters = this.getCollectionFiltersFromInput(input);
                await this.assetService.updateFeaturedAsset(ctx, coll, input);
            },
        });
        await this.assetService.updateEntityAssets(ctx, collection, input);
        await this.customFieldRelationService.updateRelations(ctx, Collection, input, collection);
        await this.applyFiltersQueue.add({
            ctx: ctx.serialize(),
            collectionIds: [collection.id],
        });
        return assertFound(this.findOne(ctx, collection.id));
    }

    async update(ctx: RequestContext, input: UpdateCollectionInput): Promise<Translated<Collection>> {
        await this.slugValidator.validateSlugs(ctx, input, CollectionTranslation);
        const collection = await this.translatableSaver.update({
            ctx,
            input,
            entityType: Collection,
            translationType: CollectionTranslation,
            beforeSave: async coll => {
                if (input.filters) {
                    coll.filters = this.getCollectionFiltersFromInput(input);
                }
                await this.assetService.updateFeaturedAsset(ctx, coll, input);
                await this.assetService.updateEntityAssets(ctx, coll, input);
            },
        });
        await this.customFieldRelationService.updateRelations(ctx, Collection, input, collection);
        if (input.filters) {
            await this.applyFiltersQueue.add({
                ctx: ctx.serialize(),
                collectionIds: [collection.id],
                applyToChangedVariantsOnly: false,
            });
        } else {
            const affectedVariantIds = await this.getCollectionProductVariantIds(collection);
            this.eventBus.publish(new CollectionModificationEvent(ctx, collection, affectedVariantIds));
        }
        return assertFound(this.findOne(ctx, collection.id));
    }

    async delete(ctx: RequestContext, id: ID): Promise<DeletionResponse> {
        const collection = await this.connection.getEntityOrThrow(ctx, Collection, id, {
            channelId: ctx.channelId,
        });
        const descendants = await this.getDescendants(ctx, collection.id);
        for (const coll of [...descendants.reverse(), collection]) {
            const affectedVariantIds = await this.getCollectionProductVariantIds(coll);
            await this.connection.getRepository(ctx, Collection).remove(coll);
            this.eventBus.publish(new CollectionModificationEvent(ctx, coll, affectedVariantIds));
        }
        return {
            result: DeletionResult.DELETED,
        };
    }

    async move(ctx: RequestContext, input: MoveCollectionInput): Promise<Translated<Collection>> {
        const target = await this.connection.getEntityOrThrow(ctx, Collection, input.collectionId, {
            channelId: ctx.channelId,
            relations: ['parent'],
        });
        const descendants = await this.getDescendants(ctx, input.collectionId);

        if (
            idsAreEqual(input.parentId, target.id) ||
            descendants.some(cat => idsAreEqual(input.parentId, cat.id))
        ) {
            throw new IllegalOperationError(`error.cannot-move-collection-into-self`);
        }

        let siblings = await this.connection
            .getRepository(ctx, Collection)
            .createQueryBuilder('collection')
            .leftJoin('collection.parent', 'parent')
            .where('parent.id = :id', { id: input.parentId })
            .getMany();

        if (!idsAreEqual(target.parent.id, input.parentId)) {
            target.parent = new Collection({ id: input.parentId });
        }
        siblings = moveToIndex(input.index, target, siblings);

        await this.connection.getRepository(ctx, Collection).save(siblings);
        await this.applyFiltersQueue.add({
            ctx: ctx.serialize(),
            collectionIds: [target.id],
        });
        return assertFound(this.findOne(ctx, input.collectionId));
    }

    private getCollectionFiltersFromInput(
        input: CreateCollectionInput | UpdateCollectionInput,
    ): ConfigurableOperation[] {
        const filters: ConfigurableOperation[] = [];
        if (input.filters) {
            for (const filter of input.filters) {
                filters.push(this.configArgService.parseInput('CollectionFilter', filter));
            }
        }
        return filters;
    }

    /**
     * Applies the CollectionFilters
     *
     * If applyToChangedVariantsOnly (default: true) is true, than apply collection job will process only changed variants
     * If applyToChangedVariantsOnly (default: true) is false, than apply collection job will process all variants
     * This param is used when we update collection and collection filters are changed to update all
     * variants (because other attributes of collection can be changed https://github.com/vendure-ecommerce/vendure/issues/1015)
     */
    private async applyCollectionFiltersInternal(collection: Collection, applyToChangedVariantsOnly = true): Promise<ID[]> {
        const ancestorFilters = await this.getAncestors(collection.id).then(ancestors =>
            ancestors.reduce(
                (filters, c) => [...filters, ...(c.filters || [])],
                [] as ConfigurableOperation[],
            ),
        );
        const preIds = await this.getCollectionProductVariantIds(collection);
        collection.productVariants = await this.getFilteredProductVariants([
            ...ancestorFilters,
            ...(collection.filters || []),
        ]);
        const postIds = collection.productVariants.map(v => v.id);
        try {
            await this.connection
                .getRepository(Collection)
                // Only update the exact changed properties, to avoid VERY hard-to-debug
                // non-deterministic race conditions e.g. when the "position" is changed
                // by moving a Collection and then this save operation clobbers it back
                // to the old value.
                .save(pick(collection, ['id', 'productVariants']), {
                    chunk: Math.ceil(collection.productVariants.length / 500),
                    reload: false,
                });
        } catch (e) {
            Logger.error(e);
        }
        const preIdsSet = new Set(preIds);
        const postIdsSet = new Set(postIds);

        if (applyToChangedVariantsOnly) {
            return [
                ...preIds.filter(id => !postIdsSet.has(id)),
                ...postIds.filter(id => !preIdsSet.has(id)),
            ];
        } else {
            return [
                ...preIds.filter(id => !postIdsSet.has(id)),
                ...postIds,
            ];
        }

    }

    /**
     * Applies the CollectionFilters and returns an array of ProductVariant entities which match.
     */
    private async getFilteredProductVariants(filters: ConfigurableOperation[]): Promise<ProductVariant[]> {
        if (filters.length === 0) {
            return [];
        }
        const { collectionFilters } = this.configService.catalogOptions;
        let qb = this.connection.getRepository(ProductVariant).createQueryBuilder('productVariant');

        for (const filterType of collectionFilters) {
            const filtersOfType = filters.filter(f => f.code === filterType.code);
            if (filtersOfType.length) {
                for (const filter of filtersOfType) {
                    qb = filterType.apply(qb, filter.args);
                }
            }
        }

        return qb.getMany();
    }

    /**
     * Returns the IDs of the Collection's ProductVariants.
     */
    async getCollectionProductVariantIds(collection: Collection, ctx?: RequestContext): Promise<ID[]> {
        if (collection.productVariants) {
            return collection.productVariants.map(v => v.id);
        } else {
            const productVariants = await this.connection
                .getRepository(ctx, ProductVariant)
                .createQueryBuilder('variant')
                .select('variant.id', 'id')
                .innerJoin('variant.collections', 'collection', 'collection.id = :id', { id: collection.id })
                .getRawMany();

            return productVariants.map(v => v.id);
        }
    }

    /**
     * Returns the next position value in the given parent collection.
     */
    private async getNextPositionInParent(ctx: RequestContext, maybeParentId?: ID): Promise<number> {
        const parentId = maybeParentId || (await this.getRootCollection(ctx)).id;
        const result = await this.connection
            .getRepository(ctx, Collection)
            .createQueryBuilder('collection')
            .leftJoin('collection.parent', 'parent')
            .select('MAX(collection.position)', 'index')
            .where('parent.id = :id', { id: parentId })
            .getRawOne();
        return (result.index || 0) + 1;
    }

    private async getParentCollection(
        ctx: RequestContext,
        parentId?: ID | null,
    ): Promise<Collection | undefined> {
        if (parentId) {
            return this.connection
                .getRepository(ctx, Collection)
                .createQueryBuilder('collection')
                .leftJoin('collection.channels', 'channel')
                .where('collection.id = :id', { id: parentId })
                .andWhere('channel.id = :channelId', { channelId: ctx.channelId })
                .getOne();
        } else {
            return this.getRootCollection(ctx);
        }
    }

    private async getRootCollection(ctx: RequestContext): Promise<Collection> {
        const cachedRoot = this.rootCollection;

        if (cachedRoot) {
            return cachedRoot;
        }

        const existingRoot = await this.connection
            .getRepository(ctx, Collection)
            .createQueryBuilder('collection')
            .leftJoin('collection.channels', 'channel')
            .leftJoinAndSelect('collection.translations', 'translation')
            .where('collection.isRoot = :isRoot', { isRoot: true })
            .andWhere('channel.id = :channelId', { channelId: ctx.channelId })
            .getOne();

        if (existingRoot) {
            this.rootCollection = translateDeep(existingRoot, ctx.languageCode);
            return this.rootCollection;
        }

        const rootTranslation = await this.connection.getRepository(ctx, CollectionTranslation).save(
            new CollectionTranslation({
                languageCode: this.configService.defaultLanguageCode,
                name: ROOT_COLLECTION_NAME,
                description: 'The root of the Collection tree.',
                slug: ROOT_COLLECTION_NAME,
            }),
        );

        const newRoot = await this.connection.getRepository(ctx, Collection).save(
            new Collection({
                isRoot: true,
                position: 0,
                translations: [rootTranslation],
                channels: [ctx.channel],
                filters: [],
            }),
        );
        this.rootCollection = translateDeep(newRoot, ctx.languageCode);
        return this.rootCollection;
    }
}
