import { DeepPartial, ID } from '@vendure/common/lib/shared-types';
import { Column, Entity, ManyToOne } from 'typeorm';

import { idType } from '../../config/config-helpers';
import { VendureEntity } from '../base/base.entity';

import { ProductVariant } from './product-variant.entity';

@Entity()
export class ProductVariantPrice extends VendureEntity {
    constructor(input?: DeepPartial<ProductVariantPrice>) {
        super(input);
    }

    @Column() price: number;

    @Column({ type: idType() }) channelId: ID;

    @ManyToOne(type => ProductVariant, variant => variant.productVariantPrices)
    variant: ProductVariant;
}
