import { AdjustmentOperation } from 'shared/generated-types';
import { ID } from 'shared/shared-types';

import { Order } from '../../entity/order/order.entity';

export type AdjustmentActionArgType = 'percentage' | 'money';
export type AdjustmentActionArg = { name: string; type: AdjustmentActionArgType; value?: string };
export type AdjustmentActionResult = {
    orderItemId?: ID;
    amount: number;
};
export type AdjustmentActionCalculation<Context = any> = (
    order: Order,
    args: { [argName: string]: any },
    context: Context,
) => AdjustmentActionResult[];

export interface AdjustmentActionDefinition extends AdjustmentOperation {
    args: AdjustmentActionArg[];
    calculate: AdjustmentActionCalculation;
}
export interface TaxActionDefinition extends AdjustmentActionDefinition {
    calculate: AdjustmentActionCalculation<{ taxCategoryId: ID }>;
}

export type AdjustmentConditionArgType = 'int' | 'money' | 'string' | 'datetime';
export type AdjustmentConditionArg = { name: string; type: AdjustmentConditionArgType };
export type AdjustmentConditionPredicate = (order: Order, args: { [argName: string]: any }) => boolean;

export interface AdjustmentConditionDefinition extends AdjustmentOperation {
    args: AdjustmentConditionArg[];
    predicate: AdjustmentConditionPredicate;
}
