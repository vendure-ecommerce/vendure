import { ConfigArg } from 'shared/generated-types';

import { Order } from '../../entity/order/order.entity';
import { argsArrayToHash, ConfigArgs, ConfigArgValues } from '../common/config-args';

export type ShippingCalculatorArgType = 'int' | 'money' | 'string' | 'boolean';
export type ShippingCalculatorArgs = ConfigArgs<ShippingCalculatorArgType>;
export type CalculateShippingFn<T extends ShippingCalculatorArgs> = (
    order: Order,
    args: ConfigArgValues<T>,
) => number | Promise<number>;

export class ShippingCalculator<T extends ShippingCalculatorArgs = {}> {
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

    calculate(order: Order, args: ConfigArg[]): number | Promise<number> {
        return this.calculateFn(order, argsArrayToHash(args));
    }
}
