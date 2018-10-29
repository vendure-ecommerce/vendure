import { AdjustmentArg } from 'shared/generated-types';

import { Order } from '../../entity/order/order.entity';
import { AdjustmentArgs, argsArrayToHash, ArgumentValues } from '../common/adjustments';

export type ShippingCalculatorArgType = 'int' | 'money' | 'string' | 'boolean';
export type ShippingCalculatorArgs = AdjustmentArgs<ShippingCalculatorArgType>;
export type CalculateShippingFn<T extends ShippingCalculatorArgs> = (
    order: Order,
    args: ArgumentValues<T>,
) => number;

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

    calculate(order: Order, args: AdjustmentArg[]): number {
        return this.calculateFn(order, argsArrayToHash(args));
    }
}
