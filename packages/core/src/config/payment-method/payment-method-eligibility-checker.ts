import { ConfigArg } from '@vendure/common/lib/generated-types';

import { RequestContext } from '../../api/common/request-context';
import {
    ConfigArgs,
    ConfigArgValues,
    ConfigurableOperationDef,
    ConfigurableOperationDefOptions,
} from '../../common/configurable-operation';
import { Order } from '../../entity/order/order.entity';

/**
 * @description
 * Configuration passed into the constructor of a {@link PaymentMethodEligibilityChecker} to
 * configure its behavior.
 *
 * @docsCategory PaymentMethodEligibilityChecker
 */
export interface PaymentMethodEligibilityCheckerConfig<T extends ConfigArgs>
    extends ConfigurableOperationDefOptions<T> {
    check: CheckPaymentMethodEligibilityCheckerFn<T>;
}
/**
 * @description
 * The PaymentMethodEligibilityChecker class is used to check whether an order qualifies for a
 * given {@link PaymentMethod}.
 *
 * @example
 * ```ts
 * const ccPaymentEligibilityChecker = new PaymentMethodEligibilityChecker({
 *     code: 'order-total-payment-eligibility-checker',
 *     description: [{ languageCode: LanguageCode.en, value: 'Checks that the order total is above some minimum value' }],
 *     args: {
 *         orderMinimum: { type: 'int', ui: { component: 'currency-form-input' } },
 *     },
 *     check: (ctx, order, args) => {
 *         return order.totalWithTax >= args.orderMinimum;
 *     },
 * });
 * ```
 *
 * @docsCategory paymentMethod
 * @docsPage PaymentMethodEligibilityChecker
 */
export class PaymentMethodEligibilityChecker<
    T extends ConfigArgs = ConfigArgs
> extends ConfigurableOperationDef<T> {
    private readonly checkFn: CheckPaymentMethodEligibilityCheckerFn<T>;

    constructor(config: PaymentMethodEligibilityCheckerConfig<T>) {
        super(config);
        this.checkFn = config.check;
    }

    /**
     * @description
     * Check the given Order to determine whether it is eligible.
     *
     * @internal
     */
    async check(ctx: RequestContext, order: Order, args: ConfigArg[]): Promise<boolean | string> {
        return this.checkFn(ctx, order, this.argsArrayToHash(args));
    }
}

/**
 * @description
 * A function which implements logic to determine whether a given {@link Order} is eligible for
 * a particular payment method. If the function resolves to `false` or a string, the check is
 * considered to have failed. A string result can be used to provide information about the
 * reason for ineligibility, if desired.
 *
 * @docsCategory PaymentMethodEligibilityChecker
 */
export type CheckPaymentMethodEligibilityCheckerFn<T extends ConfigArgs> = (
    ctx: RequestContext,
    order: Order,
    args: ConfigArgValues<T>,
) => boolean | string | Promise<boolean | string>;
