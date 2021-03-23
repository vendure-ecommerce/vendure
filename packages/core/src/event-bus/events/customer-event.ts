import { RequestContext } from '../../api/common/request-context';
import { Customer } from '../../entity/customer/customer.entity';
import { VendureEvent } from '../vendure-event';

/**
 * @description
 * This event is fired whenever a {@link Customer} is added, updated
 * or deleted.
 *
 * @docsCategory events
 * @docsPage Event Types
 */
export class CustomerEvent extends VendureEvent {
    constructor(
        public ctx: RequestContext,
        public customer: Customer,
        public type: 'created' | 'updated' | 'deleted',
    ) {
        super();
    }
}
