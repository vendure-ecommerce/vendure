import { DeepPartial } from 'shared/shared-types';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { OrderItemAdjustment } from '../adjustment/order-item-adjustment.entity';
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

    @OneToMany(type => OrderItemAdjustment, adjustment => adjustment.target)
    adjustments: OrderItemAdjustment[];

    @ManyToOne(type => Order, order => order.items)
    order: Order;
}
