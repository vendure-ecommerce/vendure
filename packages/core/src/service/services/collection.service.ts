import { OnModuleInit } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
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
import { Connection } from 'typeorm';

import { RequestContext, SerializedRequestContext } from '../../api/common/request-context';
import { configurableDefToOperation } from '../../common/configurable-operation';
import { DEFAULT_LANGUAGE_CODE } from '../../common/constants';
import { IllegalOperationError, UserInputError } from '../../common/error/errors';
import { ListQueryOptions } from '../../common/types/common-types';
import { Translated } from '../../common/types/locale-types';
import { assertFound, idsAreEqual } from '../../common/utils';
import { CollectionFilter } from '../../config/collection/collection-filter';
import {
    facetValueCollectionFilter,
    variantNameCollectionFilter,
} from '../../config/collection/default-collection-filters';
import { Logger } from '../../config/logger/vendure-logger';
import { CollectionTranslation } from '../../entity/collection/collection-translation.entity';
import { Collection } from '../../entity/collection/collection.entity';
import { ProductVariant } from '../../entity/product-variant/product-variant.entity';
import { EventBus } from '../../event-bus/event-bus';
import { CollectionModificationEvent } from '../../event-bus/events/collection-modification-event';
import { ProductEvent } from '../../event-bus/events/product-event';
import { ProductVariantEvent } from '../../event-bus/events/product-variant-event';
import { Job } from '../../job-queue/job';
import { JobQueue } from '../../job-queue/job-queue';
import { JobQueueService } from '../../job-queue/job-queue.service';
import { WorkerService } from '../../worker/worker.service';
import { ListQueryBuilder } from '../helpers/list-query-builder/list-query-builder';
import { TranslatableSaver } from '../helpers/translatable-saver/translatable-saver';
import { findOneInChannel } from '../helpers/utils/channel-aware-orm-utils';
import { getEntityOrThrow } from '../helpers/utils/get-entity-or-throw';
import { moveToIndex } from '../helpers/utils/move-to-index';
import { translateDeep } from '../helpers/utils/translate-entity';
import { ApplyCollectionFiletersJobData, ApplyCollectionFiltersMessage } from '../types/collection-messages';

import { AssetService } from './asset.service';
import { ChannelService } from './channel.service';
import { FacetValueService } from './facet-value.service';

export class CollectionService implements OnModuleInit {
    private rootCollection: Collection | undefined;
    private availableFilters: Array<CollectionFilter<any>> = [
        facetValueCollectionFilter,
        variantNameCollectionFilter,
    ];
    private applyFiltersQueue: JobQueue<ApplyCollectionFiletersJobData>;

    constructor(
        @InjectConnection() private connection: Connection,
        private channelService: ChannelService,
        private assetService: AssetService,
        private facetValueService: FacetValueService,
        private listQueryBuilder: ListQueryBuilder,
        private translatableSaver: TranslatableSaver,
        private eventBus: EventBus,
        private workerService: WorkerService,
        private jobQueueService: JobQueueService,
    ) {}

    onModuleInit() {
        const productEvents$ = this.eventBus.ofType(ProductEvent);
        const variantEvents$ = this.eventBus.ofType(ProductVariantEvent);

        merge(productEvents$, variantEvents$)
            .pipe(debounceTime(50))
            .subscribe(async (event) => {
                const collections = await this.connection.getRepository(Collection).find();
                this.applyFiltersQueue.add({
                    ctx: event.ctx.serialize(),
                    collectionIds: collections.map((c) => c.id),
                });
            });

        this.applyFiltersQueue = this.jobQueueService.createQueue({
            name: 'apply-collection-filters',
            concurrency: 1,
            process: async (job) => {
                const collections = await this.connection
                    .getRepository(Collection)
                    .findByIds(job.data.collectionIds);
                this.applyCollectionFilters(job.data.ctx, collections, job);
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
            })
            .getManyAndCount()
            .then(async ([collections, totalItems]) => {
                const items = collections.map((collection) =>
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
        const collection = await findOneInChannel(this.connection, Collection, collectionId, ctx.channelId, {
            relations,
        });
        if (!collection) {
            return;
        }
        return translateDeep(collection, ctx.languageCode, ['parent']);
    }

    getAvailableFilters(ctx: RequestContext): ConfigurableOperationDefinition[] {
        return this.availableFilters.map((x) => configurableDefToOperation(ctx, x));
    }

    async getParent(ctx: RequestContext, collectionId: ID): Promise<Collection | undefined> {
        const parent = await this.connection
            .getRepository(Collection)
            .createQueryBuilder('collection')
            .leftJoinAndSelect('collection.translations', 'translation')
            .where(
                (qb) =>
                    `collection.id = ${qb
                        .subQuery()
                        .select('child.parentId')
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
            return [pick(rootCollection, ['id', 'name'])];
        }
        const pickProps = pick(['id', 'name']);
        const ancestors = await this.getAncestors(collection.id, ctx);
        return [pickProps(rootCollection), ...ancestors.map(pickProps), pickProps(collection)];
    }

    async getCollectionsByProductId(
        ctx: RequestContext,
        productId: ID,
        publicOnly: boolean,
    ): Promise<Array<Translated<Collection>>> {
        const qb = this.connection
            .getRepository(Collection)
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

        return result.map((collection) => translateDeep(collection, ctx.languageCode));
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
                .getRepository(Collection)
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
        return descendants.map((c) => translateDeep(c, ctx.languageCode));
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
                .getRepository(Collection)
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
            .findByIds(ancestors.map((c) => c.id))
            .then((categories) => {
                return ctx ? categories.map((c) => translateDeep(c, ctx.languageCode)) : categories;
            });
    }

    async create(ctx: RequestContext, input: CreateCollectionInput): Promise<Translated<Collection>> {
        const collection = await this.translatableSaver.create({
            input,
            entityType: Collection,
            translationType: CollectionTranslation,
            beforeSave: async (coll) => {
                await this.channelService.assignToCurrentChannel(coll, ctx);
                const parent = await this.getParentCollection(ctx, input.parentId);
                if (parent) {
                    coll.parent = parent;
                }
                coll.position = await this.getNextPositionInParent(ctx, input.parentId || undefined);
                coll.filters = this.getCollectionFiltersFromInput(input);
                await this.assetService.updateFeaturedAsset(coll, input);
            },
        });
        await this.assetService.updateEntityAssets(collection, input);
        this.applyFiltersQueue.add({
            ctx: ctx.serialize(),
            collectionIds: [collection.id],
        });
        return assertFound(this.findOne(ctx, collection.id));
    }

    async update(ctx: RequestContext, input: UpdateCollectionInput): Promise<Translated<Collection>> {
        const collection = await this.translatableSaver.update({
            input,
            entityType: Collection,
            translationType: CollectionTranslation,
            beforeSave: async (coll) => {
                if (input.filters) {
                    coll.filters = this.getCollectionFiltersFromInput(input);
                }
                await this.assetService.updateFeaturedAsset(coll, input);
                await this.assetService.updateEntityAssets(coll, input);
            },
        });
        if (input.filters) {
            this.applyFiltersQueue.add({
                ctx: ctx.serialize(),
                collectionIds: [collection.id],
            });
        }
        return assertFound(this.findOne(ctx, collection.id));
    }

    async delete(ctx: RequestContext, id: ID): Promise<DeletionResponse> {
        const collection = await getEntityOrThrow(this.connection, Collection, id, ctx.channelId);
        const descendants = await this.getDescendants(ctx, collection.id);
        for (const coll of [...descendants.reverse(), collection]) {
            const affectedVariantIds = await this.getCollectionProductVariantIds(coll);
            await this.connection.getRepository(Collection).remove(coll);
            this.eventBus.publish(new CollectionModificationEvent(ctx, coll, affectedVariantIds));
        }
        return {
            result: DeletionResult.DELETED,
        };
    }

    async move(ctx: RequestContext, input: MoveCollectionInput): Promise<Translated<Collection>> {
        const target = await getEntityOrThrow(
            this.connection,
            Collection,
            input.collectionId,
            ctx.channelId,
            {
                relations: ['parent'],
            },
        );
        const descendants = await this.getDescendants(ctx, input.collectionId);

        if (
            idsAreEqual(input.parentId, target.id) ||
            descendants.some((cat) => idsAreEqual(input.parentId, cat.id))
        ) {
            throw new IllegalOperationError(`error.cannot-move-collection-into-self`);
        }

        let siblings = await this.connection
            .getRepository(Collection)
            .createQueryBuilder('collection')
            .leftJoin('collection.parent', 'parent')
            .where('parent.id = :id', { id: input.parentId })
            .getMany();
        const normalizedIndex = Math.max(Math.min(input.index, siblings.length), 0);

        if (!idsAreEqual(target.parent.id, input.parentId)) {
            target.parent = new Collection({ id: input.parentId });
        }
        siblings = moveToIndex(input.index, target, siblings);

        await this.connection.getRepository(Collection).save(siblings);
        this.applyFiltersQueue.add({
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
                const match = this.getFilterByCode(filter.code);
                const output = {
                    code: filter.code,
                    description: match.description,
                    args: filter.arguments.map((inputArg, i) => {
                        return {
                            name: inputArg.name,
                            type: match.args[inputArg.name].type,
                            value: inputArg.value,
                        };
                    }),
                };
                filters.push(output);
            }
        }
        return filters;
    }

    /**
     * Applies the CollectionFilters and returns an array of all affected ProductVariant ids.
     */
    private async applyCollectionFilters(
        ctx: SerializedRequestContext,
        collections: Collection[],
        job: Job<ApplyCollectionFiletersJobData>,
    ): Promise<void> {
        const collectionIds = collections.map((c) => c.id);
        const requestContext = RequestContext.deserialize(ctx);

        this.workerService.send(new ApplyCollectionFiltersMessage({ collectionIds })).subscribe({
            next: ({ total, completed, duration, collectionId, affectedVariantIds }) => {
                const progress = Math.ceil((completed / total) * 100);
                const collection = collections.find((c) => idsAreEqual(c.id, collectionId));
                if (collection) {
                    this.eventBus.publish(
                        new CollectionModificationEvent(requestContext, collection, affectedVariantIds),
                    );
                }
                job.setProgress(progress);
            },
            complete: () => {
                job.complete();
            },
            error: (err) => {
                Logger.error(err);
                job.fail(err);
            },
        });
    }

    /**
     * Returns the IDs of the Collection's ProductVariants.
     */
    async getCollectionProductVariantIds(collection: Collection): Promise<ID[]> {
        if (collection.productVariants) {
            return collection.productVariants.map((v) => v.id);
        } else {
            const productVariants = await this.connection
                .getRepository(ProductVariant)
                .createQueryBuilder('variant')
                .innerJoin('variant.collections', 'collection', 'collection.id = :id', { id: collection.id })
                .getMany();
            return productVariants.map((v) => v.id);
        }
    }

    /**
     * Returns the next position value in the given parent collection.
     */
    private async getNextPositionInParent(ctx: RequestContext, maybeParentId?: ID): Promise<number> {
        const parentId = maybeParentId || (await this.getRootCollection(ctx)).id;
        const result = await this.connection
            .getRepository(Collection)
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
                .getRepository(Collection)
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
            .getRepository(Collection)
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

        const rootTranslation = await this.connection.getRepository(CollectionTranslation).save(
            new CollectionTranslation({
                languageCode: DEFAULT_LANGUAGE_CODE,
                name: ROOT_COLLECTION_NAME,
                description: 'The root of the Collection tree.',
            }),
        );

        const newRoot = new Collection({
            isRoot: true,
            position: 0,
            translations: [rootTranslation],
            channels: [ctx.channel],
            filters: [],
        });

        await this.connection.getRepository(Collection).save(newRoot);
        this.rootCollection = newRoot;
        return newRoot;
    }

    private getFilterByCode(code: string): CollectionFilter<any> {
        const match = this.availableFilters.find((a) => a.code === code);
        if (!match) {
            throw new UserInputError(`error.adjustment-operation-with-code-not-found`, { code });
        }
        return match;
    }
}
