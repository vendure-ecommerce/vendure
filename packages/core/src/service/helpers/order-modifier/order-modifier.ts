import { Injectable } from '@nestjs/common';
import { ModifyOrderInput } from '@vendure/common/lib/generated-types';

import { RequestContext } from '../../../api/common/request-context';
import { Order } from '../../../entity/order/order.entity';
import { Promotion } from '../../../entity/promotion/promotion.entity';
import { TransactionalConnection } from '../../transaction/transactional-connection';
import { OrderCalculator } from '../order-calculator/order-calculator';

@Injectable()
export class OrderModifier {
    constructor(private connection: TransactionalConnection, private orderCalculator: OrderCalculator) {}

    noChangesSpecified(input: ModifyOrderInput): boolean {
        const noChanges =
            !input.adjustOrderLines?.length &&
            !input.addItems?.length &&
            !input.surcharges?.length &&
            !input.updateShippingAddress &&
            !input.updateBillingAddress;
        return noChanges;
    }
}
