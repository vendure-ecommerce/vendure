import { AdjustmentOperation, AdjustmentOperationTarget } from 'shared/generated-types';

import { OrderItem } from '../../entity/order-item/order-item.entity';
import { Order } from '../../entity/order/order.entity';

export type AdjustmentActionArgType = 'percentage' | 'money';
export type AdjustmentActionArg = { name: string; type: AdjustmentActionArgType; value?: string };
export type AdjustmentActionCalculation<T extends OrderItem | Order> = (
    target: T,
    args: { [argName: string]: any },
    context: any,
) => number;

export interface AdjustmentActionConfig<T extends OrderItem | Order> extends AdjustmentOperation {
    args: AdjustmentActionArg[];
    calculate: AdjustmentActionCalculation<T>;
}

export type AdjustmentConditionArgType = 'int' | 'money' | 'string' | 'datetime';
export type AdjustmentConditionArg = { name: string; type: AdjustmentConditionArgType };
export type AdjustmentConditionPredicate<T extends OrderItem | Order> = (
    target: T,
    args: { [argName: string]: any },
    context: any,
) => boolean;

export interface AdjustmentConditionConfig<T extends OrderItem | Order> extends AdjustmentOperation {
    target: T extends Order ? AdjustmentOperationTarget.ORDER : AdjustmentOperationTarget.ORDER_ITEM;
    args: AdjustmentConditionArg[];
    predicate: AdjustmentConditionPredicate<T>;
}
