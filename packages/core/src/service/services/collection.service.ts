import { Injectable, OnModuleInit } from '@nestjs/common';
import {
    AssignCollectionsToChannelInput,
    ConfigurableOperation,
    ConfigurableOperationDefinition,
    CreateCollectionInput,
    DeletionResponse,
    DeletionResult,
    MoveCollectionInput,
    Permission,
    PreviewCollectionVariantsInput,
    RemoveCollectionsFromChannelInput,
    UpdateCollectionInput,
} from '@vendure/common/lib/generated-types';
import { pick } from '@vendure/common/lib/pick';
import { ROOT_COLLECTION_NAME } from '@vendure/common/lib/shared-constants';
import { ID, PaginatedList } from '@vendure/common/lib/shared-types';
import { merge } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { In, IsNull } from 'typeorm';

import { RequestContext, SerializedRequestContext } from '../../api/common/request-context';
import { RelationPaths } from '../../api/index';
import { ForbiddenError, IllegalOperationError, UserInputError } from '../../common/error/errors';
import { ListQueryOptions } from '../../common/types/common-types';
import { Translated } from '../../common/types/locale-types';
import { assertFound, idsAreEqual } from '../../common/utils';
import { ConfigService } from '../../config/config.service';
import { Logger } from '../../config/logger/vendure-logger';
import { TransactionalConnection } from '../../connection/transactional-connection';
import { CollectionTranslation } from '../../entity/collection/collection-translation.entity';
import { Collection } from '../../entity/collection/collection.entity';
import { ProductVariant } from '../../entity/product-variant/product-variant.entity';
import { EventBus } from '../../event-bus/event-bus';
import { CollectionEvent } from '../../event-bus/events/collection-event';
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
import { TranslatorService } from '../helpers/translator/translator.service';
import { moveToIndex } from '../helpers/utils/move-to-index';

import { AssetService } from './asset.service';
import { ChannelService } from './channel.service';
import { RoleService } from './role.service';

export type ApplyCollectionFiltersJobData = {
    ctx: SerializedRequestContext;
    collectionIds: ID[];
    applyToChangedVariantsOnly?: boolean;
};

/**
 * @description
 * Contains methods relating to {@link Collection} entities.
 *
 * @docsCategory services
 */
@Injectable()
export class CollectionService implements OnModuleInit {
    private rootCollection: Translated<Collection> | undefined;
    private applyFiltersQueue: JobQueue<ApplyCollectionFiltersJobData>;

    constructor(
        private connection: TransactionalConnection,
        private channelService: ChannelService,
        private assetService: AssetService,
        private listQueryBuilder: ListQueryBuilder,
        private translatableSaver: TranslatableSaver,
        private eventBus: EventBus,
        private jobQueueService: JobQueueService,
        private configService: ConfigService,
        private slugValidator: SlugValidator,
        private configArgService: ConfigArgService,
        private customFieldRelationService: CustomFieldRelationService,
        private translator: TranslatorService,
        private roleService: RoleService,
    ) {}

    /**
     * @internal
     */
    async onModuleInit() {
        const productEvents$ = this.eventBus.ofType(ProductEvent);
        const variantEvents$ = this.eventBus.ofType(ProductVariantEvent);

        merge(productEvents$, variantEvents$)
            .pipe(debounceTime(50))
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            .subscribe(async event => {
                const collections = await this.connection.rawConnection
                    .getRepository(Collection)
                    .createQueryBuilder('collection')
                    .select('collection.id', 'id')
                    .getRawMany();
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
                    } catch (err: any) {
                        Logger.warn(`Could not find Collection with id ${collectionId}, skipping`);
                    }
                    completed++;
                    if (collection) {
                        let affectedVariantIds: ID[] = [];
                        try {
                            affectedVariantIds = await this.applyCollectionFiltersInternal(
                                collection,
                                job.data.applyToChangedVariantsOnly,
                            );
                        } catch (e: any) {
                            const translatedCollection = this.translator.translate(collection, ctx);
                            Logger.error(
                                'An error occurred when processing the filters for ' +
                                    `the collection "${translatedCollection.name}" (id: ${collection.id})`,
                            );
                            Logger.error(e.message);
                            continue;
                        }
                        job.setProgress(Math.ceil((completed / job.data.collectionIds.length) * 100));
                        if (affectedVariantIds.length) {
                            this.eventBus.publish(
                                new CollectionModificationEvent(ctx, collection, affectedVariantIds),
                            );
                        }
                    }
                }
            },
        });
    }

    async findAll(
        ctx: RequestContext,
        options?: ListQueryOptions<Collection> & { topLevelOnly?: boolean },
        relations?: RelationPaths<Collection>,
    ): Promise<PaginatedList<Translated<Collection>>> {
        const qb = this.listQueryBuilder.build(Collection, options, {
            relations: relations ?? ['featuredAsset', 'parent', 'channels'],
            channelId: ctx.channelId,
            where: { isRoot: false },
            orderBy: { position: 'ASC' },
            ctx,
        });

        if (options?.topLevelOnly === true) {
            qb.leftJoin('collection.parent', 'parent');
            qb.andWhere('parent.isRoot = :isRoot', { isRoot: true });
        }

        return qb.getManyAndCount().then(async ([collections, totalItems]) => {
            const items = collections.map(collection =>
                this.translator.translate(collection, ctx, ['parent']),
            );
            return {
                items,
                totalItems,
            };
        });
    }

    async findOne(
        ctx: RequestContext,
        collectionId: ID,
        relations?: RelationPaths<Collection>,
    ): Promise<Translated<Collection> | undefined> {
        const collection = await this.connection.findOneInChannel(
            ctx,
            Collection,
            collectionId,
            ctx.channelId,
            {
                relations: relations ?? ['featuredAsset', 'assets', 'channels', 'parent'],
                loadEagerRelations: true,
            },
        );
        if (!collection) {
            return;
        }
        return this.translator.translate(collection, ctx, ['parent']);
    }

    async findByIds(
        ctx: RequestContext,
        ids: ID[],
        relations?: RelationPaths<Collection>,
    ): Promise<Array<Translated<Collection>>> {
        const collections = this.connection.findByIdsInChannel(ctx, Collection, ids, ctx.channelId, {
            relations: relations ?? ['featuredAsset', 'assets', 'channels', 'parent'],
            loadEagerRelations: true,
        });
        return collections.then(values =>
            values.map(collection => this.translator.translate(collection, ctx, ['parent'])),
        );
    }

    async findOneBySlug(
        ctx: RequestContext,
        slug: string,
        relations?: RelationPaths<Collection>,
    ): Promise<Translated<Collection> | undefined> {
        const translations = await this.connection.getRepository(ctx, CollectionTranslation).find({
            relations: ['base'],
            where: { slug },
        });

        if (!translations?.length) {
            return;
        }

        let bestMatches = translations.filter(t => t.languageCode === ctx.languageCode);

        if (!(bestMatches.length > 0)) {
            bestMatches = translations.filter(t => t.languageCode === ctx.channel.defaultLanguageCode);
        }

        // In case there are better matches, we return the first found in the channel.
        let collection: Translated<Collection> | undefined;
        if (bestMatches.length > 0) {
            for (const bestMatch of bestMatches) {
                collection = await this.findOne(ctx, bestMatch.base.id, relations);
                if (collection) {
                    return collection;
                }
            }
            return collection;
        }

        return this.findOne(ctx, translations[0].base.id, relations);
    }

    /**
     * @description
     * Returns all configured CollectionFilters, as specified by the {@link CatalogOptions}.
     */
    getAvailableFilters(ctx: RequestContext): ConfigurableOperationDefinition[] {
        return this.configService.catalogOptions.collectionFilters.map(f => f.toGraphQlType(ctx));
    }

    async getParent(ctx: RequestContext, collectionId: ID): Promise<Collection | undefined> {
        const parent = await this.connection
            .getRepository(ctx, Collection)
            .createQueryBuilder('collection')
            .leftJoinAndSelect('collection.translations', 'translation')
            .where(
                qb =>
                    `collection.id = ${qb
                        .subQuery()
                        .select(`${qb.escape('child')}.${qb.escape('parentId')}`)
                        .from(Collection, 'child')
                        .where('child.id = :id', { id: collectionId })
                        .getQuery()}`,
            )
            .getOne();

        return (parent && this.translator.translate(parent, ctx)) ?? undefined;
    }

    /**
     * @description
     * Returns all child Collections of the Collection with the given id.
     */
    async getChildren(ctx: RequestContext, collectionId: ID): Promise<Collection[]> {
        return this.getDescendants(ctx, collectionId, 1);
    }

    /**
     * @description
     * Returns an array of name/id pairs representing all ancestor Collections up
     * to the Root Collection.
     */
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
        if (collection.name == null || collection.slug == null) {
            collection = this.translator.translate(
                await this.connection.getEntityOrThrow(ctx, Collection, collection.id),
                ctx,
            );
        }
        return [pickProps(rootCollection), ...ancestors.map(pickProps).reverse(), pickProps(collection)];
    }

    /**
     * @description
     * Returns all Collections which are associated with the given Product ID.
     */
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

        return result.map(collection => this.translator.translate(collection, ctx));
    }

    /**
     * @description
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
                .find({ where: { parent: { id } }, order: { position: 'ASC' } });
            for (const child of children) {
                _descendants.push(child);
                if (depth < maxDepth) {
                    await getChildren(child.id, _descendants, depth++);
                }
            }
            return _descendants;
        };

        const descendants = await getChildren(rootId);
        return descendants.map(c => this.translator.translate(c, ctx));
    }

    /**
     * @description
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
            .getRepository(ctx, Collection)
            .find({ where: { id: In(ancestors.map(c => c.id)) } })
            .then(categories => {
                const resultCategories: Array<Collection | Translated<Collection>> = [];
                ancestors.forEach(a => {
                    const category = categories.find(c => c.id === a.id);
                    if (category) {
                        resultCategories.push(ctx ? this.translator.translate(category, ctx) : category);
                    }
                });
                return resultCategories;
            });
    }

    async previewCollectionVariants(
        ctx: RequestContext,
        input: PreviewCollectionVariantsInput,
        options?: ListQueryOptions<ProductVariant>,
        relations?: RelationPaths<Collection>,
    ): Promise<PaginatedList<ProductVariant>> {
        const applicableFilters = this.getCollectionFiltersFromInput(input);
        if (input.parentId && input.inheritFilters) {
            const parentFilters = (await this.findOne(ctx, input.parentId, []))?.filters ?? [];
            const ancestorFilters = await this.getAncestors(input.parentId).then(ancestors =>
                ancestors.reduce(
                    (_filters, c) => [..._filters, ...(c.filters || [])],
                    [] as ConfigurableOperation[],
                ),
            );
            applicableFilters.push(...parentFilters, ...ancestorFilters);
        }
        let qb = this.listQueryBuilder.build(ProductVariant, options, {
            relations: relations ?? ['taxCategory'],
            channelId: ctx.channelId,
            where: { deletedAt: IsNull() },
            ctx,
            entityAlias: 'productVariant',
        });

        const { collectionFilters } = this.configService.catalogOptions;
        for (const filterType of collectionFilters) {
            const filtersOfType = applicableFilters.filter(f => f.code === filterType.code);
            if (filtersOfType.length) {
                for (const filter of filtersOfType) {
                    qb = filterType.apply(qb, filter.args);
                }
            }
        }
        return qb.getManyAndCount().then(([items, totalItems]) => ({
            items,
            totalItems,
        }));
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
        const collectionWithRelations = await this.customFieldRelationService.updateRelations(
            ctx,
            Collection,
            input,
            collection,
        );
        await this.applyFiltersQueue.add({
            ctx: ctx.serialize(),
            collectionIds: [collection.id],
        });
        this.eventBus.publish(new CollectionEvent(ctx, collectionWithRelations, 'created', input));
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
        this.eventBus.publish(new CollectionEvent(ctx, collection, 'updated', input));
        return assertFound(this.findOne(ctx, collection.id));
    }

    async delete(ctx: RequestContext, id: ID): Promise<DeletionResponse> {
        const collection = await this.connection.getEntityOrThrow(ctx, Collection, id, {
            channelId: ctx.channelId,
        });
        const deletedCollection = new Collection(collection);
        const descendants = await this.getDescendants(ctx, collection.id);
        for (const coll of [...descendants.reverse(), collection]) {
            const affectedVariantIds = await this.getCollectionProductVariantIds(coll);
            const deletedColl = new Collection(coll);
            // To avoid performance issues on huge collections, we first delete the links
            // between the product variants and the collection by chunks
            const chunkedDeleteIds = this.chunkArray(affectedVariantIds, 500);
            for (const chunkedDeleteId of chunkedDeleteIds) {
                await this.connection.rawConnection
                    .createQueryBuilder()
                    .relation(Collection, 'productVariants')
                    .of(collection)
                    .remove(chunkedDeleteId);
            }
            await this.connection.getRepository(ctx, Collection).remove(coll);
            this.eventBus.publish(new CollectionModificationEvent(ctx, deletedColl, affectedVariantIds));
        }
        this.eventBus.publish(new CollectionEvent(ctx, deletedCollection, 'deleted', id));
        return {
            result: DeletionResult.DELETED,
        };
    }

    /**
     * @description
     * Moves a Collection by specifying the parent Collection ID, and an index representing the order amongst
     * its siblings.
     */
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
            throw new IllegalOperationError('error.cannot-move-collection-into-self');
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
        input: CreateCollectionInput | UpdateCollectionInput | PreviewCollectionVariantsInput,
    ): ConfigurableOperation[] {
        const filters: ConfigurableOperation[] = [];
        if (input.filters) {
            for (const filter of input.filters) {
                filters.push(this.configArgService.parseInput('CollectionFilter', filter));
            }
        }
        return filters;
    }

    private chunkArray = <T>(array: T[], chunkSize: number): T[][] => {
        const results = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            results.push(array.slice(i, i + chunkSize));
        }

        return results;
    };

    /**
     * Applies the CollectionFilters
     *
     * If applyToChangedVariantsOnly (default: true) is true, then apply collection job will process only changed variants
     * If applyToChangedVariantsOnly (default: true) is false, then apply collection job will process all variants
     * This param is used when we update collection and collection filters are changed to update all
     * variants (because other attributes of collection can be changed https://github.com/vendure-ecommerce/vendure/issues/1015)
     */
    private async applyCollectionFiltersInternal(
        collection: Collection,
        applyToChangedVariantsOnly = true,
    ): Promise<ID[]> {
        const ancestorFilters = await this.getAncestorFilters(collection);
        const preIds = await this.getCollectionProductVariantIds(collection);
        const filteredVariantIds = await this.getFilteredProductVariantIds([
            ...ancestorFilters,
            ...(collection.filters || []),
        ]);
        const postIds = filteredVariantIds.map(v => v.id);
        const preIdsSet = new Set(preIds);
        const postIdsSet = new Set(postIds);

        const toDeleteIds = preIds.filter(id => !postIdsSet.has(id));
        const toAddIds = postIds.filter(id => !preIdsSet.has(id));

        try {
            // First we remove variants that are no longer in the collection
            const chunkedDeleteIds = this.chunkArray(toDeleteIds, 500);

            for (const chunkedDeleteId of chunkedDeleteIds) {
                await this.connection.rawConnection
                    .createQueryBuilder()
                    .relation(Collection, 'productVariants')
                    .of(collection)
                    .remove(chunkedDeleteId);
            }

            // Then we add variants have been added
            const chunkedAddIds = this.chunkArray(toAddIds, 500);

            for (const chunkedAddId of chunkedAddIds) {
                await this.connection.rawConnection
                    .createQueryBuilder()
                    .relation(Collection, 'productVariants')
                    .of(collection)
                    .add(chunkedAddId);
            }
        } catch (e: any) {
            Logger.error(e);
        }

        if (applyToChangedVariantsOnly) {
            return [...preIds.filter(id => !postIdsSet.has(id)), ...postIds.filter(id => !preIdsSet.has(id))];
        } else {
            return [...preIds.filter(id => !postIdsSet.has(id)), ...postIds];
        }
    }

    /**
     * Gets all filters of ancestor Collections while respecting the `inheritFilters` setting of each.
     * As soon as `inheritFilters === false` is encountered, the collected filters are returned.
     */
    private async getAncestorFilters(collection: Collection): Promise<ConfigurableOperation[]> {
        const ancestorFilters: ConfigurableOperation[] = [];
        if (collection.inheritFilters) {
            const ancestors = await this.getAncestors(collection.id);
            for (const ancestor of ancestors) {
                ancestorFilters.push(...ancestor.filters);
                if (ancestor.inheritFilters === false) {
                    return ancestorFilters;
                }
            }
        }
        return ancestorFilters;
    }

    /**
     * Applies the CollectionFilters and returns an array of ProductVariant entities which match.
     */
    private async getFilteredProductVariantIds(filters: ConfigurableOperation[]): Promise<Array<{ id: ID }>> {
        if (filters.length === 0) {
            return [];
        }
        const { collectionFilters } = this.configService.catalogOptions;
        let qb = this.connection.rawConnection
            .getRepository(ProductVariant)
            .createQueryBuilder('productVariant');

        for (const filterType of collectionFilters) {
            const filtersOfType = filters.filter(f => f.code === filterType.code);
            if (filtersOfType.length) {
                for (const filter of filtersOfType) {
                    qb = filterType.apply(qb, filter.args);
                }
            }
        }

        // This is the most performant (time & memory) way to get
        // just the variant IDs, which is all we need.
        return qb.select('productVariant.id', 'id').getRawMany();
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
        const index = result.index;
        return (typeof index === 'number' ? index : 0) + 1;
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
                .getOne()
                .then(result => result ?? undefined);
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
            this.rootCollection = this.translator.translate(existingRoot, ctx);
            return this.rootCollection;
        }

        // We purposefully do not use the ctx in saving the new root Collection
        // so that even if the outer transaction fails, the root collection will still
        // get persisted.
        const rootTranslation = await this.connection.rawConnection.getRepository(CollectionTranslation).save(
            new CollectionTranslation({
                languageCode: this.configService.defaultLanguageCode,
                name: ROOT_COLLECTION_NAME,
                description: 'The root of the Collection tree.',
                slug: ROOT_COLLECTION_NAME,
            }),
        );

        const newRoot = await this.connection.rawConnection.getRepository(Collection).save(
            new Collection({
                isRoot: true,
                position: 0,
                translations: [rootTranslation],
                channels: [ctx.channel],
                filters: [],
            }),
        );
        this.rootCollection = this.translator.translate(newRoot, ctx);
        return this.rootCollection;
    }

    /**
     * @description
     * Assigns Collections to the specified Channel
     */
    async assignCollectionsToChannel(
        ctx: RequestContext,
        input: AssignCollectionsToChannelInput,
    ): Promise<Array<Translated<Collection>>> {
        const hasPermission = await this.roleService.userHasAnyPermissionsOnChannel(ctx, input.channelId, [
            Permission.UpdateCollection,
            Permission.UpdateCatalog,
        ]);
        if (!hasPermission) {
            throw new ForbiddenError();
        }
        const collectionsToAssign = await this.connection
            .getRepository(ctx, Collection)
            .find({ where: { id: In(input.collectionIds) } });

        await Promise.all(
            collectionsToAssign.map(collection =>
                this.channelService.assignToChannels(ctx, Collection, collection.id, [input.channelId]),
            ),
        );

        await this.applyFiltersQueue.add({
            ctx: ctx.serialize(),
            collectionIds: collectionsToAssign.map(collection => collection.id),
        });

        return this.connection
            .findByIdsInChannel(
                ctx,
                Collection,
                collectionsToAssign.map(c => c.id),
                ctx.channelId,
                {},
            )
            .then(collections => collections.map(collection => this.translator.translate(collection, ctx)));
    }

    /**
     * @description
     * Remove Collections from the specified Channel
     */
    async removeCollectionsFromChannel(
        ctx: RequestContext,
        input: RemoveCollectionsFromChannelInput,
    ): Promise<Array<Translated<Collection>>> {
        const hasPermission = await this.roleService.userHasAnyPermissionsOnChannel(ctx, input.channelId, [
            Permission.DeleteCollection,
            Permission.DeleteCatalog,
        ]);
        if (!hasPermission) {
            throw new ForbiddenError();
        }
        const defaultChannel = await this.channelService.getDefaultChannel(ctx);
        if (idsAreEqual(input.channelId, defaultChannel.id)) {
            throw new UserInputError('error.items-cannot-be-removed-from-default-channel');
        }
        const collectionsToRemove = await this.connection
            .getRepository(ctx, Collection)
            .find({ where: { id: In(input.collectionIds) } });

        await Promise.all(
            collectionsToRemove.map(async collection => {
                const affectedVariantIds = await this.getCollectionProductVariantIds(collection);
                await this.channelService.removeFromChannels(ctx, Collection, collection.id, [
                    input.channelId,
                ]);
                this.eventBus.publish(new CollectionModificationEvent(ctx, collection, affectedVariantIds));
            }),
        );

        return this.connection
            .findByIdsInChannel(
                ctx,
                Collection,
                collectionsToRemove.map(c => c.id),
                ctx.channelId,
                {},
            )
            .then(collections => collections.map(collection => this.translator.translate(collection, ctx)));
    }
}
