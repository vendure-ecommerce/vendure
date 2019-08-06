import { ConfigArg } from '@vendure/common/lib/generated-types';
import { ConfigArgSubset } from '@vendure/common/lib/shared-types';

import {
    argsArrayToHash,
    ConfigArgs,
    ConfigArgValues,
    ConfigurableOperationDef,
    LocalizedStringArray,
} from '../../common/configurable-operation';
import { Order } from '../../entity/order/order.entity';

export type ShippingCalculatorArgType = ConfigArgSubset<'int' | 'string' | 'boolean'>;
export type ShippingCalculatorArgs = ConfigArgs<ShippingCalculatorArgType>;

export type ShippingPrice = {
    price: number;
    priceWithTax: number;
};

/**
 * @description
 * A function which implements the specific shipping calculation logic. It takes an {@link Order} and
 * an arguments object and should return the shipping price as an integer in cents.
 *
 * @docsCategory shipping
 */
export type CalculateShippingFn<T extends ShippingCalculatorArgs> = (
    order: Order,
    args: ConfigArgValues<T>,
) => ShippingPrice | Promise<ShippingPrice>;

/**
 * @description
 * The ShippingCalculator is used by a {@link ShippingMethod} to calculate the price of shipping on a given {@link Order}.
 *
 * @example
 * ```ts
 * const flatRateCalculator = new ShippingCalculator({
 *     code: 'flat-rate-calculator',
 *     description: 'Default Flat-Rate Shipping Calculator',
 *     args: {
 *         rate: ConfigArgType.MONEY,
 *     },
 *     calculate: (order, args) => {
 *         return args.rate;
 *     },
 * });
 * ```
 *
 * @docsCategory shipping
 */
export class ShippingCalculator<T extends ShippingCalculatorArgs = {}> implements ConfigurableOperationDef {
    /** @internal */
    readonly code: string;
    /** @internal */
    readonly description: LocalizedStringArray;
    /** @internal */
    readonly args: ShippingCalculatorArgs;
    private readonly calculateFn: CalculateShippingFn<T>;

    constructor(config: {
        args: T;
        calculate: CalculateShippingFn<T>;
        code: string;
        description: LocalizedStringArray;
    }) {
        this.code = config.code;
        this.description = config.description;
        this.args = config.args;
        this.calculateFn = config.calculate;
    }

    /**
     * @description
     * Calculates the price of shipping for the given Order.
     *
     * @internal
     */
    calculate(order: Order, args: ConfigArg[]): ShippingPrice | Promise<ShippingPrice> {
        return this.calculateFn(order, argsArrayToHash(args));
    }
}
