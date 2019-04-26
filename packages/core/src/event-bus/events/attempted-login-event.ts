import { RequestContext } from '../../api/common/request-context';
import { User } from '../../entity/user/user.entity';
import { VendureEvent } from '../vendure-event';

/**
 * @description
 * This event is fired when an attempt is made to log in via the shop or admin API `login` mutation.
 *
 * @docsCategory events
 */
export class AttemptedLoginEvent extends VendureEvent {
    constructor(public ctx: RequestContext, public identifier: string) {
        super();
    }
}
