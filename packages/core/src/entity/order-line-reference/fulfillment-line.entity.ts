import { DeepPartial, ID } from '@vendure/common/lib/shared-types';
import { ChildEntity, Index, ManyToOne } from 'typeorm';

import { EntityId } from '../entity-id.decorator';
import { Fulfillment } from '../fulfillment/fulfillment.entity';

import { OrderLineReference } from './order-line-reference.entity';

/**
 * @description
 * This entity represents a fulfillment of an Order or part of it, i.e. the {@link OrderItem}s have been
 * delivered to the Customer after successful payment.
 *
 * @docsCategory entities
 */
@ChildEntity()
export class FulfillmentLine extends OrderLineReference {
    constructor(input?: DeepPartial<FulfillmentLine>) {
        super(input);
    }

    @Index()
    @ManyToOne(type => Fulfillment, fulfillment => fulfillment.lines)
    fulfillment: Fulfillment;

    @EntityId()
    fulfillmentId: ID;
}
