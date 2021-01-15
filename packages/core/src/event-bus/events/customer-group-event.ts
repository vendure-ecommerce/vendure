import { RequestContext } from '../../api/common/request-context';
import { CustomerGroup } from '../../entity/customer-group/customer-group.entity';
import { Customer } from '../../entity/customer/customer.entity';
import { VendureEvent } from '../vendure-event';

/**
 * @description
 * This event is fired whenever one or more {@link Customer} is assigned to or removed from a
 * {@link CustomerGroup}.
 *
 * @docsCategory events
 * @docsPage Event Types
 */
export class CustomerGroupEvent extends VendureEvent {
    constructor(
        public ctx: RequestContext,
        public customers: Customer[],
        public customGroup: CustomerGroup,
        public type: 'assigned' | 'removed',
    ) {
        super();
    }
}
