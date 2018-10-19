import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { CreateProductInput, UpdateProductInput } from 'shared/generated-types';
import { ID, PaginatedList } from 'shared/shared-types';
import { Connection } from 'typeorm';

import { RequestContext } from '../../api/common/request-context';
import { ListQueryOptions } from '../../common/types/common-types';
import { Translated } from '../../common/types/locale-types';
import { assertFound } from '../../common/utils';
import { ProductOptionGroup } from '../../entity/product-option-group/product-option-group.entity';
import { ProductTranslation } from '../../entity/product/product-translation.entity';
import { Product } from '../../entity/product/product.entity';
import { I18nError } from '../../i18n/i18n-error';
import { createTranslatable } from '../helpers/create-translatable';
import { ListQueryBuilder } from '../helpers/list-query-builder/list-query-builder';
import { translateDeep } from '../helpers/translate-entity';
import { TranslationUpdaterService } from '../helpers/translation-updater.service';
import { updateTranslatable } from '../helpers/update-translatable';

import { AssetService } from './asset.service';
import { ChannelService } from './channel.service';
import { ProductVariantService } from './product-variant.service';
import { TaxRateService } from './tax-rate.service';

@Injectable()
export class ProductService {
    constructor(
        @InjectConnection() private connection: Connection,
        private translationUpdaterService: TranslationUpdaterService,
        private channelService: ChannelService,
        private assetService: AssetService,
        private productVariantService: ProductVariantService,
        private taxRateService: TaxRateService,
        private listQueryBuilder: ListQueryBuilder,
    ) {}

    findAll(
        ctx: RequestContext,
        options?: ListQueryOptions<Product>,
    ): Promise<PaginatedList<Translated<Product>>> {
        const relations = [
            'featuredAsset',
            'assets',
            'variants',
            'optionGroups',
            'variants.options',
            'variants.facetValues',
            'variants.taxCategory',
            'channels',
        ];

        return this.listQueryBuilder
            .build(Product, options, relations, ctx.channelId)
            .getManyAndCount()
            .then(async ([products, totalItems]) => {
                const items = products
                    .map(product =>
                        translateDeep(product, ctx.languageCode, [
                            'optionGroups',
                            'variants',
                            ['variants', 'options'],
                            ['variants', 'facetValues'],
                        ]),
                    )
                    .map(product => this.applyPriceAndTaxToVariants(product, ctx));
                return {
                    items,
                    totalItems,
                };
            });
    }

    async findOne(ctx: RequestContext, productId: ID): Promise<Translated<Product> | undefined> {
        const relations = [
            'featuredAsset',
            'assets',
            'variants',
            'optionGroups',
            'variants.options',
            'variants.facetValues',
            'variants.taxCategory',
        ];
        const product = await this.connection.manager.findOne(Product, productId, { relations });
        if (!product) {
            return;
        }
        const translated = translateDeep(product, ctx.languageCode, [
            'optionGroups',
            'variants',
            ['variants', 'options'],
            ['variants', 'facetValues'],
        ]);
        return this.applyPriceAndTaxToVariants(translated, ctx);
    }

    async create(ctx: RequestContext, input: CreateProductInput): Promise<Translated<Product>> {
        const save = createTranslatable(Product, ProductTranslation, async p => {
            this.channelService.assignToChannels(p, ctx);
        });
        const product = await save(this.connection, input);
        await this.saveAssetInputs(product, input);
        return assertFound(this.findOne(ctx, product.id));
    }

    async update(ctx: RequestContext, input: UpdateProductInput): Promise<Translated<Product>> {
        const save = updateTranslatable(Product, ProductTranslation, this.translationUpdaterService);
        const product = await save(this.connection, input);
        await this.saveAssetInputs(product, input);
        return assertFound(this.findOne(ctx, product.id));
    }

    async addOptionGroupToProduct(
        ctx: RequestContext,
        productId: ID,
        optionGroupId: ID,
    ): Promise<Translated<Product>> {
        const product = await this.getProductWithOptionGroups(productId);
        const optionGroup = await this.connection.getRepository(ProductOptionGroup).findOne(optionGroupId);
        if (!optionGroup) {
            throw new I18nError('error.entity-with-id-not-found', {
                entityName: 'OptionGroup',
                id: optionGroupId,
            });
        }

        if (Array.isArray(product.optionGroups)) {
            product.optionGroups.push(optionGroup);
        } else {
            product.optionGroups = [optionGroup];
        }

        await this.connection.manager.save(product);
        return assertFound(this.findOne(ctx, productId));
    }

    async removeOptionGroupFromProduct(
        ctx: RequestContext,
        productId: ID,
        optionGroupId: ID,
    ): Promise<Translated<Product>> {
        const product = await this.getProductWithOptionGroups(productId);
        product.optionGroups = product.optionGroups.filter(g => g.id !== optionGroupId);

        await this.connection.manager.save(product);
        return assertFound(this.findOne(ctx, productId));
    }

    private async saveAssetInputs(product: Product, input: CreateProductInput | UpdateProductInput) {
        if (input.assetIds || input.featuredAssetId) {
            if (input.assetIds) {
                const assets = await this.assetService.findByIds(input.assetIds);
                product.assets = assets;
            }
            if (input.featuredAssetId) {
                const featuredAsset = await this.assetService.findOne(input.featuredAssetId);
                if (featuredAsset) {
                    product.featuredAsset = featuredAsset;
                }
            }
            await this.connection.manager.save(product);
        }
    }

    /**
     * The price of a ProductVariant depends on the current channel and the priceWithTax further
     * depends on the currently-active zone and applicable TaxRates.
     * This method uses the RequestContext to determine these values and apply them to each
     * ProductVariant of the given Product.
     */
    private applyPriceAndTaxToVariants<T extends Product>(product: T, ctx: RequestContext): T {
        product.variants = product.variants.map(variant => {
            return this.productVariantService.applyChannelPriceAndTax(variant, ctx);
        });
        return product;
    }

    private async getProductWithOptionGroups(productId: ID): Promise<Product> {
        const product = await this.connection
            .getRepository(Product)
            .findOne(productId, { relations: ['optionGroups'] });
        if (!product) {
            throw new I18nError('error.entity-with-id-not-found', { entityName: 'Product', id: productId });
        }
        return product;
    }
}
