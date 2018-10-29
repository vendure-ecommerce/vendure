import { AdjustmentArg } from 'shared/generated-types';

import { Order } from '../../entity/order/order.entity';
import { AdjustmentArgs, argsArrayToHash, ArgumentValues } from '../common/adjustments';

export type PromotionConditionArgType = 'int' | 'money' | 'string' | 'datetime' | 'boolean';
export type PromotionConditionArgs = AdjustmentArgs<PromotionConditionArgType>;
export type CheckPromotionConditionFn<T extends PromotionConditionArgs> = (
    order: Order,
    args: ArgumentValues<T>,
) => boolean;

export class PromotionCondition<T extends PromotionConditionArgs = {}> {
    readonly code: string;
    readonly description: string;
    readonly args: PromotionConditionArgs;
    readonly priorityValue: number;
    private readonly checkFn: CheckPromotionConditionFn<T>;

    constructor(config: {
        args: T;
        check: CheckPromotionConditionFn<T>;
        code: string;
        description: string;
        priorityValue?: number;
    }) {
        this.code = config.code;
        this.description = config.description;
        this.args = config.args;
        this.checkFn = config.check;
        this.priorityValue = config.priorityValue || 0;
    }

    check(order: Order, args: AdjustmentArg[]) {
        return this.checkFn(order, argsArrayToHash<T>(args));
    }
}
