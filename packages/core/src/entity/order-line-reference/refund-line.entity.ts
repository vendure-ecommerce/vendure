import { DeepPartial, ID } from '@vendure/common/lib/shared-types';
import { ChildEntity, Index, ManyToOne } from 'typeorm';

import { EntityId } from '../entity-id.decorator';
import { Refund } from '../refund/refund.entity';

import { OrderLineReference } from './order-line-reference.entity';

/**
 * @description
 * This entity represents a fulfillment of an Order or part of it, i.e. the {@link OrderItem}s have been
 * delivered to the Customer after successful payment.
 *
 * @docsCategory entities
 */
@ChildEntity()
export class RefundLine extends OrderLineReference {
    constructor(input?: DeepPartial<RefundLine>) {
        super(input);
    }

    @Index()
    @ManyToOne(type => Refund, refund => refund.lines)
    refund: Refund;

    @EntityId()
    refundId: ID;
}
