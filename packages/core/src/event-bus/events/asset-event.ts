import { RequestContext } from '../../api/common/request-context';
import { Asset } from '../../entity';
import { VendureEvent } from '../vendure-event';

/**
 * @description
 * This event is fired whenever aa {@link Asset} is added, updated
 * or deleted.
 *
 * @docsCategory events
 * @docsPage Event Types
 */
export class AssetEvent extends VendureEvent {
    constructor(
        public ctx: RequestContext,
        public asset: Asset,
        public type: 'created' | 'updated' | 'deleted',
    ) {
        super();
    }
}
