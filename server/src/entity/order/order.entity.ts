import { AdjustmentType } from 'shared/generated-types';
import { DeepPartial } from 'shared/shared-types';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { VendureEntity } from '../base/base.entity';
import { Customer } from '../customer/customer.entity';
import { OrderItem } from '../order-item/order-item.entity';
import { OrderLine } from '../order-line/order-line.entity';

@Entity()
export class Order extends VendureEntity {
    constructor(input?: DeepPartial<Order>) {
        super(input);
    }

    @Column() code: string;

    @ManyToOne(type => Customer)
    customer: Customer;

    @OneToMany(type => OrderLine, line => line.order)
    lines: OrderLine[];

    @Column() totalPriceBeforeTax: number;

    @Column() totalPrice: number;

    /**
     * Clears Adjustments from all OrderItems of the given type. If no type
     * is specified, then all adjustments are removed.
     */
    clearAdjustments(type?: AdjustmentType) {
        this.lines.forEach(line => line.clearAdjustments(type));
    }

    getOrderItems(): OrderItem[] {
        return this.lines.reduce(
            (items, line) => {
                return [...items, ...line.items];
            },
            [] as OrderItem[],
        );
    }
}
