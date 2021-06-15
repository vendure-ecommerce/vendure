import ms from 'ms';

import { RequestContext } from '../../api/common/request-context';
import { InjectableStrategy } from '../../common/types/injectable-strategy';
import { Order } from '../../entity/order/order.entity';

/**
 * @description
 * The OrderByCodeAccessStrategy determins how access to a placed Order via the
 * orderByCode query is granted.
 * With a custom strategy anonymous access could be made permanent or tied to specific
 * conditions like IP range or a specific Order status.
 *
 * @example
 * This example grants access to the requested Order to everyone – unless it's Monday.
 * ```TypeScript
 * export class NotMondayOrderByCodeAccessStrategy implements OrderByCodeAccessStrategy {
 *     canAccessOrder(ctx: RequestContext, order: Order): boolean {
 *         const MONDAY = 1;
 *         const today = (new Date()).getDay();
 *
 *         return today !== MONDAY;
 *     }
 * }
 * ```
 *
 * @docsCategory orders
 * @docsPage OrderByCodeAccessStrategy
 */
export interface OrderByCodeAccessStrategy extends InjectableStrategy {
    /**
     * @description
     * Gives or denies permission to access the requested Order
     */
    canAccessOrder(ctx: RequestContext, order: Order): boolean | Promise<boolean>;
}

/**
 * @description
 * The default OrderByCodeAccessStrategy used by Vendure. It permitts permanent access to
 * the Customer owning the Order and anyone within 2 hours after placing the Order.
 *
 * @docsCategory orders
 * @docsPage OrderByCodeAccessStrategy
 */
export class DefaultOrderByCodeAccessStrategy implements OrderByCodeAccessStrategy {
    canAccessOrder(ctx: RequestContext, order: Order): boolean {
        // Order owned by active user
        const activeUserMatches = !!(
            order &&
            order.customer &&
            order.customer.user &&
            order.customer.user.id === ctx.activeUserId
        );

        // For guest Customers, allow access to the Order for the following
        // time period
        const anonymousAccessPermitted = () => {
            const anonymousAccessLimit = ms('2h');
            const orderPlaced = order.orderPlacedAt ? +order.orderPlacedAt : 0;
            const now = Date.now();
            return now - orderPlaced < anonymousAccessLimit;
        };

        return (ctx.activeUserId && activeUserMatches) || (!ctx.activeUserId && anonymousAccessPermitted());
    }
}
