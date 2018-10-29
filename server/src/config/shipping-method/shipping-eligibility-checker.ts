import { AdjustmentArg } from 'shared/generated-types';

import { Order } from '../../entity/order/order.entity';
import { AdjustmentArgs, argsArrayToHash, ArgumentValues } from '../common/adjustments';

export type ShippingEligibilityCheckerArgType = 'int' | 'money' | 'string' | 'boolean';
export type ShippingEligibilityCheckerArgs = AdjustmentArgs<ShippingEligibilityCheckerArgType>;
export type CheckShippingEligibilityCheckerFn<T extends ShippingEligibilityCheckerArgs> = (
    order: Order,
    args: ArgumentValues<T>,
) => boolean;

export class ShippingEligibilityChecker<T extends ShippingEligibilityCheckerArgs = {}> {
    readonly code: string;
    readonly description: string;
    readonly args: ShippingEligibilityCheckerArgs;
    private readonly checkFn: CheckShippingEligibilityCheckerFn<T>;

    constructor(config: {
        args: T;
        check: CheckShippingEligibilityCheckerFn<T>;
        code: string;
        description: string;
    }) {
        this.code = config.code;
        this.description = config.description;
        this.args = config.args;
        this.checkFn = config.check;
    }

    check(order: Order, args: AdjustmentArg[]) {
        return this.checkFn(order, argsArrayToHash(args));
    }
}
