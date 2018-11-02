import { ConfigArg } from 'shared/generated-types';

import { Order } from '../../entity/order/order.entity';
import { argsArrayToHash, ConfigArgs, ConfigArgValues } from '../common/config-args';

export type ShippingEligibilityCheckerArgType = 'int' | 'money' | 'string' | 'boolean';
export type ShippingEligibilityCheckerArgs = ConfigArgs<ShippingEligibilityCheckerArgType>;
export type CheckShippingEligibilityCheckerFn<T extends ShippingEligibilityCheckerArgs> = (
    order: Order,
    args: ConfigArgValues<T>,
) => boolean | Promise<boolean>;

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

    check(order: Order, args: ConfigArg[]) {
        return this.checkFn(order, argsArrayToHash(args));
    }
}
