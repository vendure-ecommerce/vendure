import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import { CreateProductInput, UpdateProductInput } from '../../../../shared/generated-types';
import { ID, PaginatedList } from '../../../../shared/shared-types';
import { RequestContext } from '../../api/common/request-context';
import { EntityNotFoundError } from '../../common/error/errors';
import { ListQueryOptions } from '../../common/types/common-types';
import { Translated } from '../../common/types/locale-types';
import { assertFound } from '../../common/utils';
import { ProductOptionGroup } from '../../entity/product-option-group/product-option-group.entity';
import { ProductTranslation } from '../../entity/product/product-translation.entity';
import { Product } from '../../entity/product/product.entity';
import { AssetUpdater } from '../helpers/asset-updater/asset-updater';
import { ListQueryBuilder } from '../helpers/list-query-builder/list-query-builder';
import { TranslatableSaver } from '../helpers/translatable-saver/translatable-saver';
import { translateDeep } from '../helpers/utils/translate-entity';

import { ChannelService } from './channel.service';
import { ProductVariantService } from './product-variant.service';
import { TaxRateService } from './tax-rate.service';

@Injectable()
export class ProductService {
    constructor(
        @InjectConnection() private connection: Connection,
        private channelService: ChannelService,
        private assetUpdater: AssetUpdater,
        private productVariantService: ProductVariantService,
        private taxRateService: TaxRateService,
        private listQueryBuilder: ListQueryBuilder,
        private translatableSaver: TranslatableSaver,
    ) {}

    findAll(
        ctx: RequestContext,
        options?: ListQueryOptions<Product>,
    ): Promise<PaginatedList<Translated<Product>>> {
        const relations = ['featuredAsset', 'assets', 'optionGroups', 'channels'];

        return this.listQueryBuilder
            .build(Product, options, { relations, channelId: ctx.channelId })
            .getManyAndCount()
            .then(async ([products, totalItems]) => {
                const items = products.map(product =>
                    translateDeep(product, ctx.languageCode, ['optionGroups']),
                );
                return {
                    items,
                    totalItems,
                };
            });
    }

    async findOne(ctx: RequestContext, productId: ID): Promise<Translated<Product> | undefined> {
        const relations = ['featuredAsset', 'assets', 'optionGroups'];
        const product = await this.connection.manager.findOne(Product, productId, { relations });
        if (!product) {
            return;
        }
        return translateDeep(product, ctx.languageCode, ['optionGroups']);
    }

    async create(ctx: RequestContext, input: CreateProductInput): Promise<Translated<Product>> {
        const product = await this.translatableSaver.create({
            input,
            entityType: Product,
            translationType: ProductTranslation,
            beforeSave: async p => {
                this.channelService.assignToChannels(p, ctx);
                await this.assetUpdater.updateEntityAssets(p, input);
            },
        });
        return assertFound(this.findOne(ctx, product.id));
    }

    async update(ctx: RequestContext, input: UpdateProductInput): Promise<Translated<Product>> {
        const product = await this.translatableSaver.update({
            input,
            entityType: Product,
            translationType: ProductTranslation,
            beforeSave: async p => {
                await this.assetUpdater.updateEntityAssets(p, input);
            },
        });
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
            throw new EntityNotFoundError('ProductOptionGroup', optionGroupId);
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

    private async getProductWithOptionGroups(productId: ID): Promise<Product> {
        const product = await this.connection
            .getRepository(Product)
            .findOne(productId, { relations: ['optionGroups'] });
        if (!product) {
            throw new EntityNotFoundError('Product', productId);
        }
        return product;
    }
}
