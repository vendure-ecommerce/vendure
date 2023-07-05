import { DeepPartial, ID } from '@vendure/common/lib/shared-types';
import { Column, Entity, Index, JoinColumn, JoinTable, ManyToOne, OneToMany } from 'typeorm';

import { PaymentMetadata } from '../../common/types/common-types';
import { RefundState } from '../../service/helpers/refund-state-machine/refund-state';
import { VendureEntity } from '../base/base.entity';
import { EntityId } from '../entity-id.decorator';
import { Money } from '../money.decorator';
import { RefundLine } from '../order-line-reference/refund-line.entity';
import { Payment } from '../payment/payment.entity';

@Entity()
export class Refund extends VendureEntity {
    constructor(input?: DeepPartial<Refund>) {
        super(input);
    }

    @Money() items: number;

    @Money() shipping: number;

    @Money() adjustment: number;

    @Money() total: number;

    @Column() method: string;

    @Column({ nullable: true }) reason: string;

    @Column('varchar') state: RefundState;

    @Column({ nullable: true }) transactionId: string;

    @OneToMany(type => RefundLine, line => line.refund)
    @JoinTable()
    lines: RefundLine[];

    @Index()
    @ManyToOne(type => Payment)
    @JoinColumn()
    payment: Payment;

    @EntityId()
    paymentId: ID;

    @Column('simple-json') metadata: PaymentMetadata;
}
