import { Column, Entity, ManyToOne } from 'typeorm';

import { DeepPartial } from '../../../../../shared/shared-types';
import { VendureEntity } from '../base/base.entity';
import { Channel } from '../channel/channel.entity';

import { ProductVariant } from './product-variant.entity';

@Entity()
export class ProductVariantPrice extends VendureEntity {
    constructor(input?: DeepPartial<ProductVariantPrice>) {
        super(input);
    }

    @Column() price: number;

    @Column() channelId: number;

    @ManyToOne(type => ProductVariant, variant => variant.productVariantPrices)
    variant: ProductVariant;
}
