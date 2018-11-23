import { InjectConnection } from '@nestjs/typeorm';
import {
    CreateProductCategoryInput,
    CreateProductInput,
    UpdateProductCategoryInput,
    UpdateProductInput,
} from 'shared/generated-types';
import { ID, PaginatedList } from 'shared/shared-types';
import { Connection } from 'typeorm';

import { RequestContext } from '../../api/common/request-context';
import { ListQueryOptions } from '../../common/types/common-types';
import { Translated } from '../../common/types/locale-types';
import { assertFound } from '../../common/utils';
import { ProductCategoryTranslation } from '../../entity/product-category/product-category-translation.entity';
import { ProductCategory } from '../../entity/product-category/product-category.entity';
import { ListQueryBuilder } from '../helpers/list-query-builder/list-query-builder';
import { TranslatableSaver } from '../helpers/translatable-saver/translatable-saver';
import { translateDeep } from '../helpers/utils/translate-entity';

import { AssetService } from './asset.service';
import { ChannelService } from './channel.service';

export class ProductCategoryService {
    constructor(
        @InjectConnection() private connection: Connection,
        private channelService: ChannelService,
        private assetService: AssetService,
        private listQueryBuilder: ListQueryBuilder,
        private translatableSaver: TranslatableSaver,
    ) {}

    findAll(
        ctx: RequestContext,
        options?: ListQueryOptions<ProductCategory>,
    ): Promise<PaginatedList<Translated<ProductCategory>>> {
        const relations = ['featuredAsset', 'assets', 'facetValues', 'channels'];

        return this.listQueryBuilder
            .build(ProductCategory, options, relations, ctx.channelId)
            .getManyAndCount()
            .then(async ([productCategories, totalItems]) => {
                const items = productCategories.map(productCategory =>
                    translateDeep(productCategory, ctx.languageCode, ['facetValues']),
                );
                return {
                    items,
                    totalItems,
                };
            });
    }

    async findOne(ctx: RequestContext, productId: ID): Promise<Translated<ProductCategory> | undefined> {
        const relations = ['featuredAsset', 'assets', 'facetValues', 'channels'];
        const productCategory = await this.connection.manager.findOne(ProductCategory, productId, {
            relations,
        });
        if (!productCategory) {
            return;
        }
        return translateDeep(productCategory, ctx.languageCode, ['facetValues']);
    }

    async create(
        ctx: RequestContext,
        input: CreateProductCategoryInput,
    ): Promise<Translated<ProductCategory>> {
        const productCategory = await this.translatableSaver.create({
            input,
            entityType: ProductCategory,
            translationType: ProductCategoryTranslation,
            beforeSave: category => this.channelService.assignToChannels(category, ctx),
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
}
