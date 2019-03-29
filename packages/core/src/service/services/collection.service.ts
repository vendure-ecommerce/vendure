import { OnModuleInit } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import {
    CollectionBreadcrumb,
    ConfigurableOperation,
    CreateCollectionInput,
    MoveCollectionInput,
    UpdateCollectionInput,
} from '@vendure/common/lib/generated-types';
import { pick } from '@vendure/common/lib/pick';
import { ROOT_COLLECTION_NAME } from '@vendure/common/lib/shared-constants';
import { ID, PaginatedList } from '@vendure/common/lib/shared-types';
import { notNullOrUndefined } from '@vendure/common/lib/shared-utils';
import { Connection } from 'typeorm';

import { RequestContext } from '../../api/common/request-context';
import { configurableDefToOperation } from '../../common/configurable-operation';
import { DEFAULT_LANGUAGE_CODE } from '../../common/constants';
import { IllegalOperationError, UserInputError } from '../../common/error/errors';
import { ListQueryOptions } from '../../common/types/common-types';
import { Translated } from '../../common/types/locale-types';
import { assertFound, idsAreEqual } from '../../common/utils';
import { CollectionFilter } from '../../config/collection/collection-filter';
import { facetValueCollectionFilter } from '../../config/collection/default-collection-filters';
import { CollectionTranslation } from '../../entity/collection/collection-translation.entity';
import { Collection } from '../../entity/collection/collection.entity';
import { ProductVariant } from '../../entity/product-variant/product-variant.entity';
import { EventBus } from '../../event-bus/event-bus';
import { CatalogModificationEvent } from '../../event-bus/events/catalog-modification-event';
import { CollectionModificationEvent } from '../../event-bus/events/collection-modification-event';
import { AssetUpdater } from '../helpers/asset-updater/asset-updater';
import { ListQueryBuilder } from '../helpers/list-query-builder/list-query-builder';
import { TranslatableSaver } from '../helpers/translatable-saver/translatable-saver';
import { getEntityOrThrow } from '../helpers/utils/get-entity-or-throw';
import { translateDeep } from '../helpers/utils/translate-entity';

import { ChannelService } from './channel.service';
import { FacetValueService } from './facet-value.service';

export class CollectionService implements OnModuleInit {
    private rootCategories: { [channelCode: string]: Collection } = {};
    private availableFilters: Array<CollectionFilter<any>> = [facetValueCollectionFilter];

    constructor(
        @InjectConnection() private connection: Connection,
        private channelService: ChannelService,
        private assetUpdater: AssetUpdater,
        private facetValueService: FacetValueService,
        private listQueryBuilder: ListQueryBuilder,
        private translatableSaver: TranslatableSaver,
        private eventBus: EventBus,
    ) {}

    onModuleInit() {
        this.eventBus.subscribe(CatalogModificationEvent, async event => {
            const collections = await this.connection.getRepository(Collection).find({
                relations: ['productVariants'],
            });
            for (const collection of collections) {
                const affectedVariantIds = await this.applyCollectionFilters(collection);
                this.eventBus.publish(
                    new CollectionModificationEvent(event.ctx, collection, affectedVariantIds),
                );
            }
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
                const items = collections.map(collection =>
                    translateDeep(collection, ctx.languageCode, ['parent']),
                );
                return {
                    items,
                    totalItems,
                };
            });
    }

    async findOne(ctx: RequestContext, productId: ID): Promise<Translated<Collection> | undefined> {
        const relations = ['featuredAsset', 'assets', 'channels', 'parent'];
        const collection = await this.connection.getRepository(Collection).findOne(productId, {
            relations,
        });
        if (!collection) {
            return;
        }
        return translateDeep(collection, ctx.languageCode, ['parent']);
    }

    getAvailableFilters(): ConfigurableOperation[] {
        return this.availableFilters.map(configurableDefToOperation);
    }

    async getParent(ctx: RequestContext, collectionId: ID): Promise<Collection | undefined> {
        const parent = await this.connection
            .getRepository(Collection)
            .createQueryBuilder('collection')
            .leftJoinAndSelect('collection.translations', 'translation')
            .where(
                qb =>
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
    ): Promise<Array<Translated<Collection>>> {
        const result = await this.connection
            .getRepository(Collection)
            .createQueryBuilder('collection')
            .leftJoinAndSelect('collection.translations', 'translation')
            .leftJoin('collection.productVariants', 'variant')
            .where('variant.product = :productId', { productId })
            .groupBy('collection.id, translation.id')
            .orderBy('collection.id', 'ASC')
            .getMany();

        return result.map(collection => translateDeep(collection, ctx.languageCode));
    }

    /**
     * Returns the descendants of a Collection as a flat array.
     */
    async getDescendants(ctx: RequestContext, rootId: ID): Promise<Array<Translated<Collection>>> {
        const getChildren = async (id: ID, _descendants: Collection[] = []) => {
            const children = await this.connection
                .getRepository(Collection)
                .find({ where: { parent: { id } } });
            for (const child of children) {
                _descendants.push(child);
                await getChildren(child.id, _descendants);
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
            .findByIds(ancestors.map(c => c.id))
            .then(categories => {
                return ctx ? categories.map(c => translateDeep(c, ctx.languageCode)) : categories;
            });
    }

    async create(ctx: RequestContext, input: CreateCollectionInput): Promise<Translated<Collection>> {
        const collection = await this.translatableSaver.create({
            input,
            entityType: Collection,
            translationType: CollectionTranslation,
            beforeSave: async coll => {
                await this.channelService.assignToChannels(coll, ctx);
                const parent = await this.getParentCollection(ctx, input.parentId);
                if (parent) {
                    coll.parent = parent;
                }
                coll.position = await this.getNextPositionInParent(ctx, input.parentId || undefined);
                coll.filters = this.getCollectionFiltersFromInput(input);
                await this.assetUpdater.updateEntityAssets(coll, input);
            },
        });
        const affectedVariantIds = await this.applyCollectionFilters(collection);
        this.eventBus.publish(new CollectionModificationEvent(ctx, collection, affectedVariantIds));
        return assertFound(this.findOne(ctx, collection.id));
    }

    async update(ctx: RequestContext, input: UpdateCollectionInput): Promise<Translated<Collection>> {
        const collection = await this.translatableSaver.update({
            input,
            entityType: Collection,
            translationType: CollectionTranslation,
            beforeSave: async coll => {
                if (input.filters) {
                    coll.filters = this.getCollectionFiltersFromInput(input);
                }
                await this.assetUpdater.updateEntityAssets(coll, input);
            },
        });
        let affectedVariantIds: ID[] = [];
        if (input.filters) {
            affectedVariantIds = await this.applyCollectionFilters(collection);
        }
        this.eventBus.publish(new CollectionModificationEvent(ctx, collection, affectedVariantIds));
        return assertFound(this.findOne(ctx, collection.id));
    }

    async move(ctx: RequestContext, input: MoveCollectionInput): Promise<Translated<Collection>> {
        const target = await getEntityOrThrow(this.connection, Collection, input.collectionId, {
            relations: ['parent'],
        });
        const descendants = await this.getDescendants(ctx, input.collectionId);

        if (
            idsAreEqual(input.parentId, target.id) ||
            descendants.some(cat => idsAreEqual(input.parentId, cat.id))
        ) {
            throw new IllegalOperationError(`error.cannot-move-collection-into-self`);
        }

        const siblings = await this.connection
            .getRepository(Collection)
            .createQueryBuilder('collection')
            .leftJoin('collection.parent', 'parent')
            .where('parent.id = :id', { id: input.parentId })
            .orderBy('collection.position', 'ASC')
            .getMany();
        const normalizedIndex = Math.max(Math.min(input.index, siblings.length), 0);

        if (idsAreEqual(target.parent.id, input.parentId)) {
            const currentIndex = siblings.findIndex(cat => idsAreEqual(cat.id, input.collectionId));
            if (currentIndex !== normalizedIndex) {
                siblings.splice(normalizedIndex, 0, siblings.splice(currentIndex, 1)[0]);
                siblings.forEach((cat, index) => {
                    cat.position = index;
                });
            }
        } else {
            target.parent = new Collection({ id: input.parentId });
            siblings.splice(normalizedIndex, 0, target);
            siblings.forEach((cat, index) => {
                cat.position = index;
            });
        }

        await this.connection.getRepository(Collection).save(siblings);
        await this.applyCollectionFilters(target);
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
                            type: match.args[inputArg.name],
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
    private async applyCollectionFilters(collection: Collection): Promise<ID[]> {
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
        await this.connection.getRepository(Collection).save(collection);
        const postIds = collection.productVariants.map(v => v.id);

        const preIdsSet = new Set(preIds);
        const postIdsSet = new Set(postIds);
        const difference = [
            ...preIds.filter(id => !postIdsSet.has(id)),
            ...postIds.filter(id => !preIdsSet.has(id)),
        ];
        return difference;
    }

    /**
     * Returns the IDs of the Collection's ProductVariants.
     */
    private async getCollectionProductVariantIds(collection: Collection): Promise<ID[]> {
        if (collection.productVariants) {
            return collection.productVariants.map(v => v.id);
        } else {
            const productVariants = await this.connection
                .getRepository(ProductVariant)
                .createQueryBuilder('variant')
                .innerJoin('variant.collections', 'collection', 'collection.id = :id', { id: collection.id })
                .getMany();
            return productVariants.map(v => v.id);
        }
    }

    /**
     * Applies the CollectionFilters and returns an array of ProductVariant entities which match.
     */
    private async getFilteredProductVariants(filters: ConfigurableOperation[]): Promise<ProductVariant[]> {
        if (filters.length === 0) {
            return [];
        }
        const facetFilters = filters.filter(f => f.code === facetValueCollectionFilter.code);
        let qb = this.connection.getRepository(ProductVariant).createQueryBuilder('productVariant');
        if (facetFilters) {
            const mergedArgs = facetFilters
                .map(f => f.args[0].value)
                .filter(notNullOrUndefined)
                .map(value => JSON.parse(value))
                .reduce((all, ids) => [...all, ...ids]);
            qb = facetValueCollectionFilter.apply(qb, [
                {
                    name: facetFilters[0].args[0].name,
                    type: facetFilters[0].args[0].type,
                    value: JSON.stringify(Array.from(new Set(mergedArgs))),
                },
            ]);
        }
        return qb.getMany();
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
        const cachedRoot = this.rootCategories[ctx.channel.code];

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
            this.rootCategories[ctx.channel.code] = translateDeep(existingRoot, ctx.languageCode);
            return existingRoot;
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
        this.rootCategories[ctx.channel.code] = newRoot;
        return newRoot;
    }

    private getFilterByCode(code: string): CollectionFilter<any> {
        const match = this.availableFilters.find(a => a.code === code);
        if (!match) {
            throw new UserInputError(`error.adjustment-operation-with-code-not-found`, { code });
        }
        return match;
    }
}
