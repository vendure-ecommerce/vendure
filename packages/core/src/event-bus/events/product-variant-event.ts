import { RequestContext } from '../../api/common/request-context';
import { ProductVariant } from '../../entity';
import { VendureEvent } from '../vendure-event';

/**
 * @description
 * This event is fired whenever a {@link ProductVariant} is added, updated
 * or deleted.
 *
 * @docsCategory events
 * @docsPage Event Types
 */
export class ProductVariantEvent extends VendureEvent {
    constructor(
        public ctx: RequestContext,
        public variants: ProductVariant[],
        public type: 'created' | 'updated' | 'deleted',
    ) {
        super();
    }
}
