import { AdjustmentArg, AdjustmentOperation } from 'shared/generated-types';

import { Order } from '../../entity/order/order.entity';

export type PromotionConditionArgType = 'int' | 'money' | 'string' | 'datetime' | 'boolean';
export type PromotionConditionArgs = {
    [name: string]: PromotionConditionArgType;
};
export type ArgumentValues<T extends PromotionConditionArgs> = {
    [K in keyof T]: T[K] extends 'int' | 'money'
        ? number
        : T[K] extends 'datetime' ? Date : T[K] extends 'boolean' ? boolean : string
};

export type CheckPromotionConditionFn<T extends PromotionConditionArgs> = (
    order: Order,
    args: ArgumentValues<T>,
) => boolean;

export class PromotionCondition<T extends PromotionConditionArgs = {}> {
    readonly code: string;
    readonly description: string;
    readonly args: PromotionConditionArgs;
    private readonly checkFn: CheckPromotionConditionFn<T>;

    constructor(config: { args: T; check: CheckPromotionConditionFn<T>; code: string; description: string }) {
        this.code = config.code;
        this.description = config.description;
        this.args = config.args;
        this.checkFn = config.check;
    }

    check(order: Order, args: AdjustmentArg[]) {
        return this.checkFn(order, this.argsArrayToHash(args));
    }

    private argsArrayToHash(args: AdjustmentArg[]): ArgumentValues<T> {
        const output: ArgumentValues<T> = {} as any;

        for (const arg of args) {
            if (arg.value != null) {
                output[arg.name] = this.coerceValueToType(arg);
            }
        }
        return output;
    }

    private coerceValueToType(arg: AdjustmentArg): ArgumentValues<T>[keyof T] {
        switch (arg.type as PromotionConditionArgType) {
            case 'int':
            case 'money':
                return Number.parseInt(arg.value || '', 10) as any;
            case 'datetime':
                return Date.parse(arg.value || '') as any;
            case 'boolean':
                return !!arg.value as any;
            default:
                return (arg.value as string) as any;
        }
    }
}
