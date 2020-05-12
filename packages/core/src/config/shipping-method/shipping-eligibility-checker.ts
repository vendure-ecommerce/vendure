import { ConfigArg } from '@vendure/common/lib/generated-types';
import { ConfigArgSubset } from '@vendure/common/lib/shared-types';

import {
    ConfigArgs,
    ConfigurableOperationDef,
    ConfigurableOperationDefOptions,
    LocalizedStringArray,
} from '../../common/configurable-operation';
import { argsArrayToHash, ConfigArgValues } from '../../common/configurable-operation';
import { Order } from '../../entity/order/order.entity';

export type ShippingEligibilityCheckerArgType = ConfigArgSubset<'int' | 'float' | 'string' | 'boolean'>;
export type ShippingEligibilityCheckerArgs = ConfigArgs<ShippingEligibilityCheckerArgType>;

export interface ShippingEligibilityCheckerConfig<T extends ShippingEligibilityCheckerArgs>
    extends ConfigurableOperationDefOptions<T> {
    check: CheckShippingEligibilityCheckerFn<T>;
}
/**
 * @description
 * The ShippingEligibilityChecker class is used to check whether an order qualifies for a
 * given {@link ShippingMethod}.
 *
 * @example
 * ```ts
 * const minOrderTotalEligibilityChecker = new ShippingEligibilityChecker({
 *     code: 'min-order-total-eligibility-checker',
 *     description: [{ languageCode: LanguageCode.en, value: 'Checks that the order total is above some minimum value' }],
 *     args: {
 *         orderMinimum: { type: 'int', config: { inputType: 'money' } },
 *     },
 *     check: (order, args) => {
 *         return order.total >= args.orderMinimum;
 *     },
 * });
 * ```
 *
 * @docsCategory shipping
 * @docsPage ShippingEligibilityChecker
 */
export class ShippingEligibilityChecker<
    T extends ShippingEligibilityCheckerArgs = {}
> extends ConfigurableOperationDef<T> {
    private readonly checkFn: CheckShippingEligibilityCheckerFn<T>;

    constructor(config: ShippingEligibilityCheckerConfig<T>) {
        super(config);
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

/**
 * @description
 * A function which implements logic to determine whether a given {@link Order} is eligible for
 * a particular shipping method.
 *
 * @docsCategory shipping
 * @docsPage ShippingEligibilityChecker
 */
export type CheckShippingEligibilityCheckerFn<T extends ShippingEligibilityCheckerArgs> = (
    order: Order,
    args: ConfigArgValues<T>,
) => boolean | Promise<boolean>;
