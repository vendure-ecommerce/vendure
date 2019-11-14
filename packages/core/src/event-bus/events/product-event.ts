import { RequestContext } from '../../api/common/request-context';
import { Product } from '../../entity';
import { VendureEvent } from '../vendure-event';

/**
 * @description
 * This event is fired whenever a {@link Product} is added, updated
 * or deleted.
 *
 * @docsCategory events
 * @docsPage Event Types
 */
export class ProductEvent extends VendureEvent {
    constructor(
        public ctx: RequestContext,
        public product: Product,
        public type: 'created' | 'updated' | 'deleted',
    ) {
        super();
    }
}
