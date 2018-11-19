import { RequestContext } from '../../api/common/request-context';
import { User } from '../../entity/user/user.entity';
import { VendureEvent } from '../vendure-event';

/**
 * This event is fired when a new user registers an account, either as a stand-alone signup or after
 * placing an order.
 */
export class AccountRegistrationEvent extends VendureEvent {
    constructor(public ctx: RequestContext, public user: User) {
        super();
    }
}
