import { DeepPartial, ID } from '@vendure/common/lib/shared-types';
import { Column, Entity, JoinColumn, JoinTable, ManyToOne, OneToMany } from 'typeorm';

import { PaymentMetadata } from '../../common/types/common-types';
import { RefundState } from '../../service/helpers/refund-state-machine/refund-state';
import { VendureEntity } from '../base/base.entity';
import { EntityId } from '../entity-id.decorator';
import { OrderItem } from '../order-item/order-item.entity';
import { Payment } from '../payment/payment.entity';

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

    @Column({ nullable: true }) reason: string;

    @Column('varchar') state: RefundState;

    @Column({ nullable: true }) transactionId: string;

    @OneToMany(type => OrderItem, orderItem => orderItem.refund)
    @JoinTable()
    orderItems: OrderItem[];

    @ManyToOne(type => Payment)
    @JoinColumn()
    payment: Payment;

    @EntityId()
    paymentId: ID;

    @Column('simple-json') metadata: PaymentMetadata;
}
