import { ModifyOrderInput } from '@vendure/common/lib/generated-types';
import { ID } from '@vendure/common/lib/shared-types';

import { RequestContext } from '../../api';
import { Customer, Order } from '../../entity';
import { VendureEntityEvent } from '../vendure-entity-event';

type OrderInputTypes = Order | Customer | ModifyOrderInput | ID | { customFields: any };

/**
 * @description
 * This event is fired whenever an {@link Order} is added, updated
 * or deleted.
 *
 * @docsCategory events
 * @docsPage Event Types
 */
export class OrderEvent extends VendureEntityEvent<Order, OrderInputTypes> {
    constructor(
        ctx: RequestContext,
        order: Order,
        type: 'created' | 'updated' | 'deleted',
        input?: OrderInputTypes,
    ) {
        super(order, type, ctx, input);
    }
}
