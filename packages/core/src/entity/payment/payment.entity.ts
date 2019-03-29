import { DeepPartial } from '@vendure/common/lib/shared-types';
import { Column, Entity, ManyToOne } from 'typeorm';

import { PaymentState } from '../../service/helpers/payment-state-machine/payment-state';
import { VendureEntity } from '../base/base.entity';
import { Order } from '../order/order.entity';

export type PaymentMetadata = { [key: string]: string | number | boolean };

/**
 * @description
 * A Payment represents a single payment transaction and exists in a well-defined state
 * defined by the {@link PaymentState} type.
 *
 * @docsCategory entities
 */
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
