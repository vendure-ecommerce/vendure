import { DeepPartial } from 'shared/shared-types';
import { Column, Entity, ManyToOne } from 'typeorm';

import { PaymentState } from '../../service/helpers/payment-state-machine/payment-state';
import { VendureEntity } from '../base/base.entity';
import { Order } from '../order/order.entity';

export type PaymentMetadata = { [key: string]: string | number | boolean };

@Entity()
export class Payment extends VendureEntity {
    constructor(input?: DeepPartial<Payment>) {
        super(input);
    }

    @Column() method: string;

    @Column() amount: number;

    @Column('varchar') state: PaymentState;

    @Column({ nullable: true })
    transactionId: string;

    @Column('simple-json') metadata: PaymentMetadata;

    @ManyToOne(type => Order, order => order.payments)
    order: Order;
}
