import { RequestContext } from '../../api/common/request-context';
import { Product, ProductVariant } from '../../entity';
import { VendureEvent } from '../vendure-event';

export class CatalogModificationEvent extends VendureEvent {
    constructor(public ctx: RequestContext, public entity: Product | ProductVariant) {
        super();
    }
}
