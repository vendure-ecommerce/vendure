import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import { ROOT_CATEGORY_NAME } from '../../../../shared/shared-constants';
import { ID, PaginatedList } from '../../../../shared/shared-types';
import { RequestContext } from '../../api/common/request-context';
import { DEFAULT_LANGUAGE_CODE } from '../../common/constants';
import { IllegalOperationError } from '../../common/error/errors';
import { ListQueryOptions } from '../../common/types/common-types';
import { Translated } from '../../common/types/locale-types';
import { assertFound, idsAreEqual } from '../../common/utils';
import { CollectionTranslation } from '../../entity/collection/collection-translation.entity';
import { Collection } from '../../entity/collection/collection.entity';
import { AssetUpdater } from '../helpers/asset-updater/asset-updater';
import { ListQueryBuilder } from '../helpers/list-query-builder/list-query-builder';
import { TranslatableSaver } from '../helpers/translatable-saver/translatable-saver';
import { getEntityOrThrow } from '../helpers/utils/get-entity-or-throw';
import { translateDeep } from '../helpers/utils/translate-entity';

import { ChannelService } from './channel.service';
import { FacetValueService } from './facet-value.service';

export class CollectionService {
    private rootCategories: { [channelCode: string]: Collection } = {};

    constructor(
        @InjectConnection() private connection: Connection,
        private channelService: ChannelService,
        private assetUpdater: AssetUpdater,
        private facetValueService: FacetValueService,
        private listQueryBuilder: ListQueryBuilder,
        private translatableSaver: TranslatableSaver,
    ) {}

    async findAll(
        ctx: RequestContext,
        options?: ListQueryOptions<Collection>,
    ): Promise<PaginatedList<Translated<Collection>>> {
        const relations = ['featuredAsset', 'facetValues', 'facetValues.facet', 'parent', 'channels'];

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
                    translateDeep(collection, ctx.languageCode, [
                        'facetValues',
                        'parent',
                        ['facetValues', 'facet'],
                    ]),
                );
                return {
                    items,
                    totalItems,
                };
            });
    }

    async findOne(ctx: RequestContext, productId: ID): Promise<Translated<Collection> | undefined> {
        const relations = ['featuredAsset', 'assets', 'facetValues', 'channels', 'parent'];
        const collection = await this.connection.getRepository(Collection).findOne(productId, {
            relations,
        });
        if (!collection) {
            return;
        }
        return translateDeep(collection, ctx.languageCode, ['facetValues', 'parent']);
    }

    /**
     * Given a categoryId, returns an array of all the facetValueIds assigned to that
     * category and its ancestors. A Product is considered to be "in" a category when it has *all*
     * of these facetValues assigned to it.
     */
    async getFacetValueIdsForCategory(categoryId: ID): Promise<ID[]> {
        const category = await this.connection
            .getRepository(Collection)
            .findOne(categoryId, { relations: ['facetValues'] });
        if (!category) {
            return [];
        }
        const ancestors = await this.getAncestors(categoryId);
        const facetValueIds = [category, ...ancestors].reduce(
            (flat, c) => [...flat, ...c.facetValues.map(fv => fv.id)],
            [] as ID[],
        );
        return facetValueIds;
    }

    /**
     * Returns the descendants of a Collection as a flat array.
     */
    async getDescendants(ctx: RequestContext, rootId: ID): Promise<Array<Translated<Collection>>> {
        const getChildren = async (id, _descendants: Collection[] = []) => {
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
     * Gets the ancestors of a given category. Note that since ProductCategories are implemented as an adjacency list, this method
     * will produce more queries the deeper the category is in the tree.
     * @param categoryId
     */
    getAncestors(categoryId: ID): Promise<Collection[]>;
    getAncestors(categoryId: ID, ctx: RequestContext): Promise<Array<Translated<Collection>>>;
    async getAncestors(
        categoryId: ID,
        ctx?: RequestContext,
    ): Promise<Array<Translated<Collection> | Collection>> {
        const getParent = async (id, _ancestors: Collection[] = []): Promise<Collection[]> => {
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
        const ancestors = await getParent(categoryId);

        return this.connection
            .getRepository(Collection)
            .findByIds(ancestors.map(c => c.id), {
                relations: ['facetValues'],
            })
            .then(categories => {
                return ctx ? categories.map(c => translateDeep(c, ctx.languageCode)) : categories;
            });
    }

    async create(ctx: RequestContext, input: any): Promise<Translated<Collection>> {
        const collection = await this.translatableSaver.create({
            input,
            entityType: Collection,
            translationType: CollectionTranslation,
            beforeSave: async category => {
                await this.channelService.assignToChannels(category, ctx);
                const parent = await this.getParentCategory(ctx, input.parentId);
                if (parent) {
                    category.parent = parent;
                }
                category.position = await this.getNextPositionInParent(ctx, input.parentId || undefined);
                if (input.facetValueIds) {
                    category.facetValues = await this.facetValueService.findByIds(input.facetValueIds);
                }
                await this.assetUpdater.updateEntityAssets(category, input);
            },
        });
        return assertFound(this.findOne(ctx, collection.id));
    }

    async update(ctx: RequestContext, input: any): Promise<Translated<Collection>> {
        const collection = await this.translatableSaver.update({
            input,
            entityType: Collection,
            translationType: CollectionTranslation,
            beforeSave: async category => {
                if (input.facetValueIds) {
                    category.facetValues = await this.facetValueService.findByIds(input.facetValueIds);
                }
                await this.assetUpdater.updateEntityAssets(category, input);
            },
        });
        return assertFound(this.findOne(ctx, collection.id));
    }

    async move(ctx: RequestContext, input: any): Promise<Translated<Collection>> {
        const target = await getEntityOrThrow(this.connection, Collection, input.categoryId, {
            relations: ['parent'],
        });
        const descendants = await this.getDescendants(ctx, input.categoryId);

        if (
            idsAreEqual(input.parentId, target.id) ||
            descendants.some(cat => idsAreEqual(input.parentId, cat.id))
        ) {
            throw new IllegalOperationError(`error.cannot-move-collection-into-self`);
        }

        const siblings = await this.connection
            .getRepository(Collection)
            .createQueryBuilder('category')
            .leftJoin('category.parent', 'parent')
            .where('parent.id = :id', { id: input.parentId })
            .orderBy('category.position', 'ASC')
            .getMany();
        const normalizedIndex = Math.max(Math.min(input.index, siblings.length), 0);

        if (idsAreEqual(target.parent.id, input.parentId)) {
            const currentIndex = siblings.findIndex(cat => idsAreEqual(cat.id, input.categoryId));
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
        return assertFound(this.findOne(ctx, input.categoryId));
    }

    /**
     * Returns the next position value in the given parent category.
     */
    async getNextPositionInParent(ctx: RequestContext, maybeParentId?: ID): Promise<number> {
        const parentId = maybeParentId || (await this.getRootCategory(ctx)).id;
        const result = await this.connection
            .getRepository(Collection)
            .createQueryBuilder('category')
            .leftJoin('category.parent', 'parent')
            .select('MAX(category.position)', 'index')
            .where('parent.id = :id', { id: parentId })
            .getRawOne();
        return (result.index || 0) + 1;
    }

    private async getParentCategory(
        ctx: RequestContext,
        parentId?: ID | null,
    ): Promise<Collection | undefined> {
        if (parentId) {
            return this.connection
                .getRepository(Collection)
                .createQueryBuilder('category')
                .leftJoin('category.channels', 'channel')
                .where('category.id = :id', { id: parentId })
                .andWhere('channel.id = :channelId', { channelId: ctx.channelId })
                .getOne();
        } else {
            return this.getRootCategory(ctx);
        }
    }

    private async getRootCategory(ctx: RequestContext): Promise<Collection> {
        const cachedRoot = this.rootCategories[ctx.channel.code];

        if (cachedRoot) {
            return cachedRoot;
        }

        const existingRoot = await this.connection
            .getRepository(Collection)
            .createQueryBuilder('category')
            .leftJoin('category.channels', 'channel')
            .where('category.isRoot = :isRoot', { isRoot: true })
            .andWhere('channel.id = :channelId', { channelId: ctx.channelId })
            .getOne();

        if (existingRoot) {
            this.rootCategories[ctx.channel.code] = existingRoot;
            return existingRoot;
        }

        const rootTranslation = await this.connection.getRepository(CollectionTranslation).save(
            new CollectionTranslation({
                languageCode: DEFAULT_LANGUAGE_CODE,
                name: ROOT_CATEGORY_NAME,
                description: 'The root of the Collection tree.',
            }),
        );

        const newRoot = new Collection({
            isRoot: true,
            position: 0,
            translations: [rootTranslation],
            channels: [ctx.channel],
        });

        await this.connection.getRepository(Collection).save(newRoot);
        this.rootCategories[ctx.channel.code] = newRoot;
        return newRoot;
    }
}
