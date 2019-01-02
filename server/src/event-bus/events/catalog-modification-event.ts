import { RequestContext } from '../../api/common/request-context';
import { VendureEntity } from '../../entity';
import { VendureEvent } from '../vendure-event';

export class CatalogModificationEvent extends VendureEvent {
    constructor(public ctx: RequestContext, public entity: VendureEntity) {
        super();
    }
}
