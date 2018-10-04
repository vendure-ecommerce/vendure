import { DeepPartial } from 'shared/shared-types';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { Adjustment } from '../adjustment-source/adjustment-source.entity';
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

    @Column('simple-json') adjustments: Adjustment[];

    @Column() totalPriceBeforeAdjustment: number;

    @Column() totalPrice: number;
}
