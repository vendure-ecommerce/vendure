import { ID } from '@vendure/common/lib/shared-types';

import { RequestContext } from '../../api/common/request-context';
import { InjectableStrategy } from '../../common/types/injectable-strategy';
import { OrderLine } from '../../entity';
import { Order } from '../../entity/order/order.entity';
import { ProductVariant } from '../../entity/product-variant/product-variant.entity';
import { OrderState } from '../../service/helpers/order-state-machine/order-state';

/**
 * @description
 * This strategy is responsible for selecting a specific Vendor when creating a multivendor Order.
 *
 * @docsCategory orders
 */
export interface VendorSelectionStrategy extends InjectableStrategy {
    /**
     * @description
     * Should return the ID of a Channel, or `undefined` if this OrderLine should not
     * be assigned to a Vendor.
     */
    selectChannelIdForVendorOrder(
        ctx: RequestContext,
        order: Order,
        orderLine: OrderLine,
    ): undefined | ID | Promise<undefined | ID>;
}
