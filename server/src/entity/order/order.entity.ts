import { DeepPartial } from 'shared/shared-types';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { OrderAdjustment } from '../adjustment/order-adjustment.entity';
import { VendureEntity } from '../base/base.entity';
import { Customer } from '../customer/customer.entity';
import { OrderItem } from '../order-item/order-item.entity';

@Entity()
export class Order extends VendureEntity {
    constructor(input?: DeepPartial<Order>) {
        super(input);
    }

    @Column() code: string;

    @ManyToOne(type => Customer)
    customer: Customer;

    @OneToMany(type => OrderItem, item => item.order)
    items: OrderItem[];

    @OneToMany(type => OrderAdjustment, adjustment => adjustment.target)
    adjustments: OrderAdjustment[];

    price: number;
}
