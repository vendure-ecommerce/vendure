import { ConfigArg } from '../../../../shared/generated-types';

import { Order } from '../../entity/order/order.entity';
import { argsArrayToHash, ConfigArgs, ConfigArgValues } from '../common/config-args';

export type PromotionConditionArgType = 'int' | 'money' | 'string' | 'datetime' | 'boolean';
export type PromotionConditionArgs = ConfigArgs<PromotionConditionArgType>;
export type CheckPromotionConditionFn<T extends PromotionConditionArgs> = (
    order: Order,
    args: ConfigArgValues<T>,
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

    check(order: Order, args: ConfigArg[]) {
        return this.checkFn(order, argsArrayToHash<T>(args));
    }
}
