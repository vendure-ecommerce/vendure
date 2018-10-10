import { ID } from 'shared/shared-types';
import { Connection, EntitySubscriberInterface, EventSubscriber, InsertEvent } from 'typeorm';

import { I18nError } from '../../i18n/i18n-error';
import { AdjustmentSource } from '../adjustment-source/adjustment-source.entity';

import { ProductVariantPrice } from './product-variant-price.entity';
import { ProductVariant } from './product-variant.entity';

/**
 * This subscriber listens for CRUD events on ProductVariants and transparently handles
 */
@EventSubscriber()
export class ProductVariantSubscriber implements EntitySubscriberInterface<ProductVariant> {
    listenTo() {
        return ProductVariant;
    }

    async afterInsert(event: InsertEvent<ProductVariant>) {
        const { channelId, taxCategoryId } = event.queryRunner.data;
        const price = event.entity.price || 0;
        if (channelId === undefined) {
            throw new I18nError(`error.channel-id-not-set`);
        }
        const taxCategory = await this.getTaxCategory(event.connection, taxCategoryId);
        const variantPrice = new ProductVariantPrice({ price, channelId });
        variantPrice.variant = event.entity;
        variantPrice.priceBeforeTax = this.getPriceBeforeTax(price, taxCategory.getTaxCategoryRate());
        variantPrice.taxCategory = taxCategory;
        await event.manager.save(variantPrice);
    }

    async afterUpdate(event: InsertEvent<ProductVariant>) {
        const variantPrice = await event.connection.getRepository(ProductVariantPrice).findOne({
            where: {
                variant: event.entity.id,
                channelId: event.queryRunner.data.channelId,
            },
        });
        if (!variantPrice) {
            throw new I18nError(`error.could-not-find-product-variant-price`);
        }
        let taxCategory = variantPrice.taxCategory;
        if (event.queryRunner.data.taxCategoryId !== undefined) {
            taxCategory = await this.getTaxCategory(event.connection, event.queryRunner.data.taxCategoryId);
            variantPrice.taxCategory = taxCategory;
        }

        variantPrice.price = event.entity.price || 0;
        variantPrice.priceBeforeTax = this.getPriceBeforeTax(
            variantPrice.price,
            taxCategory.getTaxCategoryRate(),
        );
        await event.manager.save(variantPrice);
    }

    private getPriceBeforeTax(priceAfterTax: number, taxRatePercentage: number): number {
        return Math.round(priceAfterTax / (1 + taxRatePercentage / 100));
    }

    private async getTaxCategory(connection: Connection, id: ID): Promise<AdjustmentSource> {
        const taxCategory = await connection.getRepository(AdjustmentSource).findOne(id);
        if (!taxCategory) {
            throw new I18nError(`error.tax-category-not-found`, { id });
        }
        return taxCategory;
    }
}
