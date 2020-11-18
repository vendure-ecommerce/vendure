import { Injectable } from '@nestjs/common';
import {
    CreateProductInput,
    CreateProductOptionGroupInput,
    CreateProductOptionInput,
    CreateProductVariantInput,
} from '@vendure/common/lib/generated-types';
import { ID } from '@vendure/common/lib/shared-types';

import { RequestContext } from '../../../api/common/request-context';
import { Channel } from '../../../entity/channel/channel.entity';
import { ProductOptionGroupTranslation } from '../../../entity/product-option-group/product-option-group-translation.entity';
import { ProductOptionGroup } from '../../../entity/product-option-group/product-option-group.entity';
import { ProductOptionTranslation } from '../../../entity/product-option/product-option-translation.entity';
import { ProductOption } from '../../../entity/product-option/product-option.entity';
import { ProductVariantAsset } from '../../../entity/product-variant/product-variant-asset.entity';
import { ProductVariantPrice } from '../../../entity/product-variant/product-variant-price.entity';
import { ProductVariantTranslation } from '../../../entity/product-variant/product-variant-translation.entity';
import { ProductVariant } from '../../../entity/product-variant/product-variant.entity';
import { ProductAsset } from '../../../entity/product/product-asset.entity';
import { ProductTranslation } from '../../../entity/product/product-translation.entity';
import { Product } from '../../../entity/product/product.entity';
import { TranslatableSaver } from '../../../service/helpers/translatable-saver/translatable-saver';
import { ChannelService } from '../../../service/services/channel.service';
import { StockMovementService } from '../../../service/services/stock-movement.service';
import { TransactionalConnection } from '../../../service/transaction/transactional-connection';

/**
 * A service to import entities into the database. This replaces the regular `create` methods of the service layer with faster
 * versions which skip much of the defensive checks and other DB calls which are not needed when running an import.
 *
 * In testing, the use of the FastImporterService approximately doubled the speed of bulk imports.
 */
@Injectable()
export class FastImporterService {
    private defaultChannel: Channel;
    constructor(
        private connection: TransactionalConnection,
        private channelService: ChannelService,
        private stockMovementService: StockMovementService,
        private translatableSaver: TranslatableSaver,
    ) {}

    async initialize() {
        this.defaultChannel = this.channelService.getDefaultChannel();
    }

    async createProduct(input: CreateProductInput): Promise<ID> {
        const product = await this.translatableSaver.create({
            ctx: RequestContext.empty(),
            input,
            entityType: Product,
            translationType: ProductTranslation,
            beforeSave: async p => {
                if (input.facetValueIds) {
                    p.facetValues = input.facetValueIds.map(id => ({ id } as any));
                }
                if (input.featuredAssetId) {
                    p.featuredAsset = { id: input.featuredAssetId } as any;
                }
            },
        });
        if (input.assetIds) {
            const productAssets = input.assetIds.map(
                (id, i) =>
                    new ProductAsset({
                        assetId: id,
                        productId: product.id,
                        position: i,
                    }),
            );
            await this.connection.getRepository(ProductAsset).save(productAssets, { reload: false });
        }
        return product.id;
    }

    async createProductOptionGroup(input: CreateProductOptionGroupInput): Promise<ID> {
        const group = await this.translatableSaver.create({
            ctx: RequestContext.empty(),
            input,
            entityType: ProductOptionGroup,
            translationType: ProductOptionGroupTranslation,
        });
        return group.id;
    }

    async createProductOption(input: CreateProductOptionInput): Promise<ID> {
        const option = await this.translatableSaver.create({
            ctx: RequestContext.empty(),
            input,
            entityType: ProductOption,
            translationType: ProductOptionTranslation,
            beforeSave: po => (po.group = { id: input.productOptionGroupId } as any),
        });
        return option.id;
    }

    async addOptionGroupToProduct(productId: ID, optionGroupId: ID) {
        await this.connection
            .getRepository(Product)
            .createQueryBuilder()
            .relation('optionGroups')
            .of(productId)
            .add(optionGroupId);
    }

    async createProductVariant(input: CreateProductVariantInput): Promise<ID> {
        if (!input.optionIds) {
            input.optionIds = [];
        }
        if (input.price == null) {
            input.price = 0;
        }

        const createdVariant = await this.translatableSaver.create({
            ctx: RequestContext.empty(),
            input,
            entityType: ProductVariant,
            translationType: ProductVariantTranslation,
            beforeSave: async variant => {
                variant.channels = [this.defaultChannel];
                const { optionIds } = input;
                if (optionIds && optionIds.length) {
                    variant.options = optionIds.map(id => ({ id } as any));
                }
                if (input.facetValueIds) {
                    variant.facetValues = input.facetValueIds.map(id => ({ id } as any));
                }
                variant.product = { id: input.productId } as any;
                variant.taxCategory = { id: input.taxCategoryId } as any;
                if (input.featuredAssetId) {
                    variant.featuredAsset = { id: input.featuredAssetId } as any;
                }
            },
        });
        if (input.assetIds) {
            const variantAssets = input.assetIds.map(
                (id, i) =>
                    new ProductVariantAsset({
                        assetId: id,
                        productVariantId: createdVariant.id,
                        position: i,
                    }),
            );
            await this.connection.getRepository(ProductVariantAsset).save(variantAssets, { reload: false });
        }
        if (input.stockOnHand != null && input.stockOnHand !== 0) {
            await this.stockMovementService.adjustProductVariantStock(
                RequestContext.empty(),
                createdVariant.id,
                0,
                input.stockOnHand,
            );
        }
        const variantPrice = new ProductVariantPrice({
            price: createdVariant.price,
            channelId: this.defaultChannel.id,
        });
        variantPrice.variant = createdVariant;
        await this.connection.getRepository(ProductVariantPrice).save(variantPrice, { reload: false });
        return createdVariant.id;
    }
}
