import { RequestContext } from '../../api';
import { VendureEvent } from '../vendure-event';

/**
 * @description
 * This event is fired whenever you want to run pending search updates
 *
 * @docsCategory events
 * @docsPage Event Types
 */
export class JobBufferEvent extends VendureEvent {
    constructor(public ctx: RequestContext) {
        super();
    }
}
