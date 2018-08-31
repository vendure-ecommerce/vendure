import { EntitySubscriberInterface, EventSubscriber, InsertEvent } from 'typeorm';

import { I18nError } from '../../i18n/i18n-error';

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
        const channelId = event.queryRunner.data.channelId;
        const price = event.entity.price || 0;
        if (channelId === undefined) {
            throw new I18nError(`error.channel-id-not-set`);
        }
        const variantPrice = new ProductVariantPrice({ price, channelId });
        variantPrice.variant = event.entity;
        await event.manager.save(variantPrice);
    }

    async afterUpdate(event: InsertEvent<ProductVariant>) {
        const prices = await event.connection.getRepository(ProductVariantPrice).find({
            where: {
                variant: event.entity.id,
            },
        });
        prices[0].price = event.entity.price || 0;
        await event.manager.save(prices[0]);
    }
}
