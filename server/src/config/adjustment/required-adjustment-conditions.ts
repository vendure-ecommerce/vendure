import { AdjustmentType } from 'shared/generated-types';

import { Order } from '../../entity/order/order.entity';

import { AdjustmentConditionDefinition } from './adjustment-types';

export const taxCondition: AdjustmentConditionDefinition = {
    type: AdjustmentType.TAX,
    code: 'tax_condition',
    args: [],
    predicate(order: Order, args) {
        return true;
    },
    description: 'Apply tax to all orders',
};
