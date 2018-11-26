import { InjectConnection } from '@nestjs/typeorm';
import { CreateProductCategoryInput, UpdateProductCategoryInput } from 'shared/generated-types';
import { ID, PaginatedList } from 'shared/shared-types';
import { Connection } from 'typeorm';

import { RequestContext } from '../../api/common/request-context';
import { DEFAULT_LANGUAGE_CODE } from '../../common/constants';
import { ListQueryOptions } from '../../common/types/common-types';
import { Translated } from '../../common/types/locale-types';
import { assertFound } from '../../common/utils';
import { ProductCategoryTranslation } from '../../entity/product-category/product-category-translation.entity';
import { ProductCategory } from '../../entity/product-category/product-category.entity';
import { ListQueryBuilder } from '../helpers/list-query-builder/list-query-builder';
import { TranslatableSaver } from '../helpers/translatable-saver/translatable-saver';
import { translateDeep, translateTree } from '../helpers/utils/translate-entity';

import { AssetService } from './asset.service';
import { ChannelService } from './channel.service';

export class ProductCategoryService {
    private rootCategories: { [channelCode: string]: ProductCategory } = {};

    constructor(
        @InjectConnection() private connection: Connection,
        private channelService: ChannelService,
        private assetService: AssetService,
        private listQueryBuilder: ListQueryBuilder,
        private translatableSaver: TranslatableSaver,
    ) {}

    async findAll(
        ctx: RequestContext,
        options?: ListQueryOptions<ProductCategory>,
    ): Promise<PaginatedList<Translated<ProductCategory>>> {
        const relations = ['featuredAsset', 'facetValues', 'parent', 'channels'];

        return this.listQueryBuilder
            .build(ProductCategory, options, relations, ctx.channelId, { isRoot: false })
            .getManyAndCount()
            .then(async ([productCategories, totalItems]) => {
                const items = productCategories.map(productCategory =>
                    translateDeep(productCategory, ctx.languageCode, ['facetValues', 'parent']),
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
            },
        });
        await this.saveAssetInputs(productCategory, input);
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
        });
        await this.saveAssetInputs(productCategory, input);
        return assertFound(this.findOne(ctx, productCategory.id));
    }

    private async saveAssetInputs(productCategory: ProductCategory, input: any) {
        if (input.assetIds || input.featuredAssetId) {
            if (input.assetIds) {
                const assets = await this.assetService.findByIds(input.assetIds);
                productCategory.assets = assets;
            }
            if (input.featuredAssetId) {
                const featuredAsset = await this.assetService.findOne(input.featuredAssetId);
                if (featuredAsset) {
                    productCategory.featuredAsset = featuredAsset;
                }
            }
            await this.connection.manager.save(productCategory);
        }
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
                name: '__root_category__',
                description: 'The root of the ProductCategory tree.',
            }),
        );

        const newRoot = new ProductCategory({
            isRoot: true,
            translations: [rootTranslation],
            channels: [ctx.channel],
        });

        await this.connection.getRepository(ProductCategory).save(newRoot);
        this.rootCategories[ctx.channel.code] = newRoot;
        return newRoot;
    }
}
