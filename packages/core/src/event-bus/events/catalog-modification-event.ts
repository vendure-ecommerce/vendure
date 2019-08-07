import { RequestContext } from '../../api/common/request-context';
import { Product, ProductVariant } from '../../entity';
import { VendureEvent } from '../vendure-event';

/**
 * @description
 * This event is fired whenever the catalog is modified in some way, i.e. a
 * {@link Product} or {@link ProductVariant} is modified is created, updated, or
 * deleted.
 *
 * @docsCategory events
 * @docsPage Event Types
 */
export class CatalogModificationEvent extends VendureEvent {
    constructor(public ctx: RequestContext, public entity: Product | ProductVariant) {
        super();
    }
}
