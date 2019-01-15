import { ConfigArg } from '../../../../shared/generated-types';
import { OrderItem } from '../../entity/order-item/order-item.entity';
import { OrderLine } from '../../entity/order-line/order-line.entity';
import { Order } from '../../entity/order/order.entity';
import { argsArrayToHash, ConfigArgs, ConfigArgValues } from '../common/config-args';

import { PromotionUtils } from './promotion-condition';

export type PromotionActionArgType = 'percentage' | 'money' | 'int' | 'facetValueIds';
export type PromotionActionArgs = ConfigArgs<PromotionActionArgType>;

export type ExecutePromotionItemActionFn<T extends PromotionActionArgs> = (
    orderItem: OrderItem,
    orderLine: OrderLine,
    args: ConfigArgValues<T>,
    utils: PromotionUtils,
) => number | Promise<number>;
export type ExecutePromotionOrderActionFn<T extends PromotionActionArgs> = (
    order: Order,
    args: ConfigArgValues<T>,
    utils: PromotionUtils,
) => number | Promise<number>;

export interface PromotionActionConfig<T extends PromotionActionArgs> {
    args: T;
    code: string;
    description: string;
    priorityValue?: number;
}
export interface PromotionItemActionConfig<T extends PromotionActionArgs> extends PromotionActionConfig<T> {
    execute: ExecutePromotionItemActionFn<T>;
}
export interface PromotionOrderActionConfig<T extends PromotionActionArgs> extends PromotionActionConfig<T> {
    execute: ExecutePromotionOrderActionFn<T>;
}

export abstract class PromotionAction<T extends PromotionActionArgs = {}> {
    readonly code: string;
    readonly args: PromotionActionArgs;
    readonly description: string;
    readonly priorityValue: number;

    protected constructor(config: PromotionActionConfig<T>) {
        this.code = config.code;
        this.description = config.description;
        this.args = config.args;
        this.priorityValue = config.priorityValue || 0;
    }
}

/**
 * Represents a PromotionAction which applies to individual OrderItems.
 */
export class PromotionItemAction<T extends PromotionActionArgs = {}> extends PromotionAction<T> {
    private readonly executeFn: ExecutePromotionItemActionFn<T>;
    constructor(config: PromotionItemActionConfig<T>) {
        super(config);
        this.executeFn = config.execute;
    }

    execute(orderItem: OrderItem, orderLine: OrderLine, args: ConfigArg[], utils: PromotionUtils) {
        return this.executeFn(orderItem, orderLine, argsArrayToHash(args), utils);
    }
}

/**
 * Represents a PromotionAction which applies to the Order as a whole.
 */
export class PromotionOrderAction<T extends PromotionActionArgs = {}> extends PromotionAction<T> {
    private readonly executeFn: ExecutePromotionOrderActionFn<T>;
    constructor(config: PromotionOrderActionConfig<T>) {
        super(config);
        this.executeFn = config.execute;
    }

    execute(order: Order, args: ConfigArg[], utils: PromotionUtils) {
        return this.executeFn(order, argsArrayToHash(args), utils);
    }
}
