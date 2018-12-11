import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import {
    CreateProductCategoryInput,
    MoveProductCategoryInput,
    UpdateProductCategoryInput,
} from '../../../../shared/generated-types';
import { ROOT_CATEGORY_NAME } from '../../../../shared/shared-constants';
import { ID, PaginatedList } from '../../../../shared/shared-types';
import { RequestContext } from '../../api/common/request-context';
import { DEFAULT_LANGUAGE_CODE } from '../../common/constants';
import { IllegalOperationError } from '../../common/error/errors';
import { ListQueryOptions } from '../../common/types/common-types';
import { Translated } from '../../common/types/locale-types';
import { assertFound, idsAreEqual } from '../../common/utils';
import { ProductCategoryTranslation } from '../../entity/product-category/product-category-translation.entity';
import { ProductCategory } from '../../entity/product-category/product-category.entity';
import { AssetUpdater } from '../helpers/asset-updater/asset-updater';
import { ListQueryBuilder } from '../helpers/list-query-builder/list-query-builder';
import { TranslatableSaver } from '../helpers/translatable-saver/translatable-saver';
import { getEntityOrThrow } from '../helpers/utils/get-entity-or-throw';
import { translateDeep, translateTree } from '../helpers/utils/translate-entity';

import { ChannelService } from './channel.service';
import { FacetValueService } from './facet-value.service';

export class ProductCategoryService {
    private rootCategories: { [channelCode: string]: ProductCategory } = {};

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
        options?: ListQueryOptions<ProductCategory>,
    ): Promise<PaginatedList<Translated<ProductCategory>>> {
        const relations = ['featuredAsset', 'facetValues', 'facetValues.facet', 'parent', 'channels'];

        return this.listQueryBuilder
            .build(ProductCategory, options, {
                relations,
                channelId: ctx.channelId,
                where: { isRoot: false },
                orderBy: { position: 'ASC' },
            })
            .getManyAndCount()
            .then(async ([productCategories, totalItems]) => {
                const items = productCategories.map(productCategory =>
                    translateDeep(productCategory, ctx.languageCode, [
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

    async findOne(ctx: RequestContext, productId: ID): Promise<Translated<ProductCategory> | undefined> {
        const relations = ['featuredAsset', 'assets', 'facetValues', 'channels', 'parent'];
        const productCategory = await this.connection.getRepository(ProductCategory).findOne(productId, {
            relations,
        });
        if (!productCategory) {
            return;
        }
        return translateDeep(productCategory, ctx.languageCode, ['facetValues', 'parent']);
    }

    async getTree(ctx: RequestContext, rootId?: ID): Promise<Translated<ProductCategory> | undefined> {
        const root = await this.getParentCategory(ctx, rootId);
        if (root) {
            const tree = await this.connection.getTreeRepository(ProductCategory).findDescendantsTree(root);
            return translateTree(tree, ctx.languageCode);
        }
    }

    /**
     * Returns the descendants of a ProductCategory as a flat array.
     */
    async getDescendants(ctx: RequestContext, rootId: ID): Promise<Array<Translated<ProductCategory>>> {
        const descendants = await this.connection
            .getTreeRepository(ProductCategory)
            .findDescendants(new ProductCategory({ id: rootId }));
        // Note: the result includes the root category itself, so we filter this out.
        return descendants.filter(d => d.id !== rootId).map(d => translateDeep(d, ctx.languageCode));
    }

    async create(
        ctx: RequestContext,
        input: CreateProductCategoryInput,
    ): Promise<Translated<ProductCategory>> {
        const productCategory = await this.translatableSaver.create({
            input,
            entityType: ProductCategory,
            translationType: ProductCategoryTranslation,
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
        return assertFound(this.findOne(ctx, productCategory.id));
    }

    async update(
        ctx: RequestContext,
        input: UpdateProductCategoryInput,
    ): Promise<Translated<ProductCategory>> {
        const productCategory = await this.translatableSaver.update({
            input,
            entityType: ProductCategory,
            translationType: ProductCategoryTranslation,
            beforeSave: async category => {
                if (input.facetValueIds) {
                    category.facetValues = await this.facetValueService.findByIds(input.facetValueIds);
                }
                await this.assetUpdater.updateEntityAssets(category, input);
            },
        });
        return assertFound(this.findOne(ctx, productCategory.id));
    }

    async move(ctx: RequestContext, input: MoveProductCategoryInput): Promise<Translated<ProductCategory>> {
        const target = await getEntityOrThrow(this.connection, ProductCategory, input.categoryId, {
            relations: ['parent'],
        });
        const descendants = await this.connection.getTreeRepository(ProductCategory).findDescendants(target);

        if (
            idsAreEqual(input.parentId, target.id) ||
            descendants.some(cat => idsAreEqual(input.parentId, cat.id))
        ) {
            throw new IllegalOperationError(`error.cannot-move-product-category-into-self`);
        }

        const siblings = await this.connection
            .getRepository(ProductCategory)
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
            target.parent = new ProductCategory({ id: input.parentId });
            siblings.splice(normalizedIndex, 0, target);
            siblings.forEach((cat, index) => {
                cat.position = index;
            });
        }

        await this.connection.getRepository(ProductCategory).save(siblings);
        return assertFound(this.findOne(ctx, input.categoryId));
    }

    /**
     * Returns the next position value in the given parent category.
     */
    async getNextPositionInParent(ctx: RequestContext, maybeParentId?: ID): Promise<number> {
        const parentId = maybeParentId || (await this.getRootCategory(ctx)).id;
        const result = await this.connection
            .getRepository(ProductCategory)
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
    ): Promise<ProductCategory | undefined> {
        if (parentId) {
            return this.connection
                .getRepository(ProductCategory)
                .createQueryBuilder('category')
                .leftJoin('category.channels', 'channel')
                .where('category.id = :id', { id: parentId })
                .andWhere('channel.id = :channelId', { channelId: ctx.channelId })
                .getOne();
        } else {
            return this.getRootCategory(ctx);
        }
    }

    private async getRootCategory(ctx: RequestContext): Promise<ProductCategory> {
        const cachedRoot = this.rootCategories[ctx.channel.code];

        if (cachedRoot) {
            return cachedRoot;
        }

        const existingRoot = await this.connection
            .getRepository(ProductCategory)
            .createQueryBuilder('category')
            .leftJoin('category.channels', 'channel')
            .where('category.isRoot = :isRoot', { isRoot: true })
            .andWhere('channel.id = :channelId', { channelId: ctx.channelId })
            .getOne();

        if (existingRoot) {
            this.rootCategories[ctx.channel.code] = existingRoot;
            return existingRoot;
        }

        const rootTranslation = await this.connection.getRepository(ProductCategoryTranslation).save(
            new ProductCategoryTranslation({
                languageCode: DEFAULT_LANGUAGE_CODE,
                name: ROOT_CATEGORY_NAME,
                description: 'The root of the ProductCategory tree.',
            }),
        );

        const newRoot = new ProductCategory({
            isRoot: true,
            position: 0,
            translations: [rootTranslation],
            channels: [ctx.channel],
        });

        await this.connection.getRepository(ProductCategory).save(newRoot);
        this.rootCategories[ctx.channel.code] = newRoot;
        return newRoot;
    }
}
