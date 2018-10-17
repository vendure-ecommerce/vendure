import { Adjustment, AdjustmentArg } from 'shared/generated-types';

import { OrderItem } from '../../entity/order-item/order-item.entity';
import { OrderLine } from '../../entity/order-line/order-line.entity';
import { Order } from '../../entity/order/order.entity';

export type PromotionActionArgType = 'percentage' | 'money';
export type PromotionActionArgs = {
    [name: string]: PromotionActionArgType;
};
export type ArgumentValues<T extends PromotionActionArgs> = { [K in keyof T]: number };
export type ExecutePromotionActionFn<T extends PromotionActionArgs> = (
    orderItem: OrderItem,
    orderLine: OrderLine,
    args: ArgumentValues<T>,
) => number;

export class PromotionAction<T extends PromotionActionArgs = {}> {
    readonly code: string;
    readonly args: PromotionActionArgs;
    readonly description: string;
    private readonly executeFn: ExecutePromotionActionFn<T>;

    constructor(config: {
        args: T;
        execute: ExecutePromotionActionFn<T>;
        code: string;
        description: string;
    }) {
        this.code = config.code;
        this.description = config.description;
        this.args = config.args;
        this.executeFn = config.execute;
    }

    execute(orderItem: OrderItem, orderLine: OrderLine, args: AdjustmentArg[]) {
        return this.executeFn(orderItem, orderLine, this.argsArrayToHash(args));
    }

    private argsArrayToHash(args: AdjustmentArg[]): ArgumentValues<T> {
        const output: ArgumentValues<T> = {} as any;
        for (const arg of args) {
            if (arg.value != null) {
                output[arg.name] = Number.parseInt(arg.value || '', 10);
            }
        }
        return output;
    }
}
