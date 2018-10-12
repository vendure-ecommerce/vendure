import { DeepPartial, ID } from 'shared/shared-types';
import { Column, Entity, ManyToOne } from 'typeorm';

import { Adjustment } from '../../common/types/adjustment-source';
import { Asset } from '../asset/asset.entity';
import { VendureEntity } from '../base/base.entity';
import { Order } from '../order/order.entity';
import { ProductVariant } from '../product-variant/product-variant.entity';

@Entity()
export class OrderItem extends VendureEntity {
    constructor(input?: DeepPartial<OrderItem>) {
        super(input);
    }

    @ManyToOne(type => ProductVariant)
    productVariant: ProductVariant;

    @Column('varchar') taxCategoryId: ID;

    @ManyToOne(type => Asset)
    featuredAsset: Asset;

    /**
     * Corresponds to the priceBeforeTax value of the associated ProductVariant.
     */
    @Column() unitPriceBeforeTax: number;

    /**
     * Corresponds to the price value of the associated ProductVariant.
     */
    @Column() unitPrice: number;

    @Column() quantity: number;

    @Column() totalPriceBeforeAdjustment: number;

    @Column() totalPrice: number;

    @Column('simple-json') adjustments: Adjustment[];

    @ManyToOne(type => Order, order => order.items)
    order: Order;
}
