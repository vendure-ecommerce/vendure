import { EntitySubscriberInterface, EventSubscriber, InsertEvent } from 'typeorm';

import { InternalServerError } from '../../common/error/errors';

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
            throw new InternalServerError(`error.channel-id-not-set`);
        }
        const variantPrice = new ProductVariantPrice({ price, channelId });
        variantPrice.variant = event.entity;
        await event.manager.save(variantPrice);
    }

    async afterUpdate(event: InsertEvent<ProductVariant>) {
        if (event.entity.price !== undefined) {
            const variantPrice = await event.connection.getRepository(ProductVariantPrice).findOne({
                where: {
                    variant: event.entity.id,
                    channelId: event.queryRunner.data.channelId,
                },
            });
            if (!variantPrice) {
                throw new InternalServerError(`error.could-not-find-product-variant-price`);
            }

            variantPrice.price = event.entity.price || 0;
            await event.manager.save(variantPrice);
        }
    }
}
