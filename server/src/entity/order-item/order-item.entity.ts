import { DeepPartial } from 'shared/shared-types';
import { Column, Entity, ManyToOne } from 'typeorm';

import { Adjustment } from '../adjustment-source/adjustment-source.entity';
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

    @Column() unitPrice: number;

    @Column() quantity: number;

    @Column() totalPriceBeforeAdjustment: number;

    @Column() totalPrice: number;

    @Column('simple-json') adjustments: Adjustment[];

    @ManyToOne(type => Order, order => order.items)
    order: Order;
}
