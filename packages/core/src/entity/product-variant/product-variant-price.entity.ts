import { DeepPartial, ID } from '@vendure/common/lib/shared-types';
import { Column, Entity, ManyToOne } from 'typeorm';

import { VendureEntity } from '../base/base.entity';
import { EntityId } from '../entity-id.decorator';

import { ProductVariant } from './product-variant.entity';

@Entity()
export class ProductVariantPrice extends VendureEntity {
    constructor(input?: DeepPartial<ProductVariantPrice>) {
        super(input);
    }

    @Column() price: number;

    @EntityId() channelId: ID;

    @ManyToOne(type => ProductVariant, variant => variant.productVariantPrices)
    variant: ProductVariant;
}
