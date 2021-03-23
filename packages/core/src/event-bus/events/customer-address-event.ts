import { RequestContext } from '../../api/common/request-context';
import { Address } from '../../entity/address/address.entity';
import { VendureEvent } from '../vendure-event';

/**
 * @description
 * This event is fired whenever a {@link Customer} is added, updated
 * or deleted.
 *
 * @docsCategory events
 * @docsPage Event Types
 */
export class CustomerAddressEvent extends VendureEvent {
    constructor(
        public ctx: RequestContext,
        public address: Address,
        public type: 'created' | 'updated' | 'deleted',
    ) {
        super();
    }
}
