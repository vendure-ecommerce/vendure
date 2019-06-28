import { DeepPartial, ID } from '@vendure/common/lib/shared-types';
import { Column, Entity, JoinColumn, JoinTable, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { idType } from '../../config/config-helpers';

import { RefundState } from '../../service/helpers/refund-state-machine/refund-state';
import { VendureEntity } from '../base/base.entity';
import { OrderItem } from '../order-item/order-item.entity';
import { Order } from '../order/order.entity';
import { Payment, PaymentMetadata } from '../payment/payment.entity';

@Entity()
export class Refund extends VendureEntity {
    constructor(input?: DeepPartial<Refund>) {
        super(input);
    }

    @Column() items: number;

    @Column() shipping: number;

    @Column() adjustment: number;

    @Column() total: number;

    @Column() method: string;

    @Column('varchar') state: RefundState;

    @Column({ nullable: true }) transactionId: string;

    @OneToMany(type => OrderItem, orderItem => orderItem.refund)
    @JoinTable()
    orderItems: OrderItem[];

    @ManyToOne(type => Order)
    @JoinTable()
    order: Order;

    @ManyToOne(type => Payment)
    @JoinColumn()
    payment: Payment;

    @Column({ type: idType() })
    paymentId: ID;

    @Column('simple-json') metadata: PaymentMetadata;
}
