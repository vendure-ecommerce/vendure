import { ConfigArg } from '../../../../shared/generated-types';

import { ConfigArgs, ConfigurableOperationDef } from '../../common/configurable-operation';
import { argsArrayToHash, ConfigArgValues } from '../../common/configurable-operation';
import { Order } from '../../entity/order/order.entity';

export type ShippingCalculatorArgType = 'int' | 'money' | 'string' | 'boolean';
export type ShippingCalculatorArgs = ConfigArgs<ShippingCalculatorArgType>;
export type CalculateShippingFn<T extends ShippingCalculatorArgs> = (
    order: Order,
    args: ConfigArgValues<T>,
) => number | Promise<number>;

/**
 * @description
 * The ShippingCalculator is used by a {@link ShippingMethod} to calculate the price of shipping on a given {@link Order}.
 *
 * @docsCategory shipping
 */
export class ShippingCalculator<T extends ShippingCalculatorArgs = {}> implements ConfigurableOperationDef {
    readonly code: string;
    readonly description: string;
    readonly args: ShippingCalculatorArgs;
    private readonly calculateFn: CalculateShippingFn<T>;

    constructor(config: { args: T; calculate: CalculateShippingFn<T>; code: string; description: string }) {
        this.code = config.code;
        this.description = config.description;
        this.args = config.args;
        this.calculateFn = config.calculate;
    }

    /**
     * @description
     * Calculates the price of shipping for the given Order.
     */
    calculate(order: Order, args: ConfigArg[]): number | Promise<number> {
        return this.calculateFn(order, argsArrayToHash(args));
    }
}
