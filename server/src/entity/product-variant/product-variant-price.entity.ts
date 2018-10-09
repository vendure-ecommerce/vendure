import { DeepPartial } from 'shared/shared-types';
import { Column, Entity, ManyToOne } from 'typeorm';

import { AdjustmentSource } from '../adjustment-source/adjustment-source.entity';
import { VendureEntity } from '../base/base.entity';
import { Channel } from '../channel/channel.entity';

import { ProductVariant } from './product-variant.entity';

@Entity()
export class ProductVariantPrice extends VendureEntity {
    constructor(input?: DeepPartial<ProductVariantPrice>) {
        super(input);
    }

    @Column() price: number;

    @Column() priceBeforeTax: number;

    @ManyToOne(type => AdjustmentSource, { eager: true })
    taxCategory: AdjustmentSource;

    @Column() channelId: number;

    @ManyToOne(type => ProductVariant, variant => variant.productVariantPrices)
    variant: ProductVariant;
}
