import { ConfigArg } from '../../../../shared/generated-types';
import {
    argsArrayToHash,
    ConfigArgs,
    ConfigArgValues,
    ConfigurableOperationDef,
} from '../../common/types/configurable-operation';
import { OrderItem } from '../../entity/order-item/order-item.entity';
import { OrderLine } from '../../entity/order-line/order-line.entity';
import { Order } from '../../entity/order/order.entity';

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

/**
 * @description
 * An abstract class which is extended by {@link PromotionItemAction} and {@link PromotionOrderAction}.
 *
 * @docsCategory promotions
 */
export abstract class PromotionAction<T extends PromotionActionArgs = {}>
    implements ConfigurableOperationDef {
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
 * @description
 * Represents a PromotionAction which applies to individual {@link OrderItem}s.
 *
 * @example
 * ```ts
 * // Applies a percentage discount to each OrderItem
 * const itemPercentageDiscount = new PromotionItemAction({
 *     code: 'item_percentage_discount',
 *     args: { discount: 'percentage' },
 *     execute(orderItem, orderLine, args) {
 *         return -orderLine.unitPrice * (args.discount / 100);
 *     },
 *     description: 'Discount every item by { discount }%',
 * });
 * ```
 *
 * @docsCategory promotions
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
 * @description
 * Represents a PromotionAction which applies to the {@link Order} as a whole.
 *
 * @example
 * ```ts
 * // Applies a percentage discount to the entire Order
 * const orderPercentageDiscount = new PromotionOrderAction({
 *     code: 'order_percentage_discount',
 *     args: { discount: 'percentage' },
 *     execute(order, args) {
 *         return -order.subTotal * (args.discount / 100);
 *     },
 *     description: 'Discount order by { discount }%',
 * });
 * ```
 *
 * @docsCategory promotions
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
