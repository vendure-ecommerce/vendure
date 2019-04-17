import { ConfigArg, ConfigArgType } from '@vendure/common/lib/generated-types';

import { ConfigArgs, ConfigurableOperationDef } from '../../common/configurable-operation';
import { argsArrayToHash, ConfigArgValues } from '../../common/configurable-operation';
import { Order } from '../../entity/order/order.entity';

export type ShippingEligibilityCheckerArgType =
    | ConfigArgType.INT
    | ConfigArgType.MONEY
    | ConfigArgType.STRING
    | ConfigArgType.BOOLEAN;
export type ShippingEligibilityCheckerArgs = ConfigArgs<ShippingEligibilityCheckerArgType>;

/**
 * @description
 * A function which implements logic to determine whether a given {@link Order} is eligible for
 * a particular shipping method.
 *
 * @docsCategory shipping
 */
export type CheckShippingEligibilityCheckerFn<T extends ShippingEligibilityCheckerArgs> = (
    order: Order,
    args: ConfigArgValues<T>,
) => boolean | Promise<boolean>;

/**
 * @description
 * The ShippingEligibilityChecker class is used to check whether an order qualifies for a
 * given {@link ShippingMethod}.
 *
 * @example
 * ```ts
 * const minOrderTotalEligibilityChecker = new ShippingEligibilityChecker({
 *     code: 'min-order-total-eligibility-checker',
 *     description: 'Checks that the order total is above some minimum value',
 *     args: {
 *         orderMinimum: ConfigArgType.MONEY,
 *     },
 *     check: (order, args) => {
 *         return order.total >= args.orderMinimum;
 *     },
 * });
 * ```
 *
 * @docsCategory shipping
 */
export class ShippingEligibilityChecker<T extends ShippingEligibilityCheckerArgs = {}>
    implements ConfigurableOperationDef {
    /** @internal */
    readonly code: string;
    /** @internal */
    readonly description: string;
    /** @internal */
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

    /**
     * @description
     * Check the given Order to determine whether it is eligible.
     *
     * @internal
     */
    check(order: Order, args: ConfigArg[]): boolean | Promise<boolean> {
        return this.checkFn(order, argsArrayToHash(args));
    }
}
