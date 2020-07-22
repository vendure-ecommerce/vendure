import { ConfigArg } from '@vendure/common/lib/generated-types';
import { ConfigArgSubset } from '@vendure/common/lib/shared-types';

import {
    ConfigArgs,
    ConfigArgValues,
    ConfigurableOperationDef,
    ConfigurableOperationDefOptions,
} from '../../common/configurable-operation';
import { OrderItem } from '../../entity/order-item/order-item.entity';
import { OrderLine } from '../../entity/order-line/order-line.entity';
import { Order } from '../../entity/order/order.entity';

import { PromotionUtils } from './promotion-condition';

export type PromotionActionArgType = ConfigArgSubset<'int' | 'ID'>;
export type PromotionActionArgs = ConfigArgs<PromotionActionArgType>;

/**
 * @description
 * The function which is used by a PromotionItemAction to calculate the
 * discount on the OrderItem.
 *
 * @docsCategory promotions
 * @docsPage promotion-action
 */
export type ExecutePromotionItemActionFn<T extends PromotionActionArgs> = (
    orderItem: OrderItem,
    orderLine: OrderLine,
    args: ConfigArgValues<T>,
    utils: PromotionUtils,
) => number | Promise<number>;

/**
 * @description
 * The function which is used by a PromotionOrderAction to calculate the
 * discount on the Order.
 *
 * @docsCategory promotions
 * @docsPage promotion-action
 */
export type ExecutePromotionOrderActionFn<T extends PromotionActionArgs> = (
    order: Order,
    args: ConfigArgValues<T>,
    utils: PromotionUtils,
) => number | Promise<number>;

export interface PromotionActionConfig<T extends PromotionActionArgs>
    extends ConfigurableOperationDefOptions<T> {
    priorityValue?: number;
}

/**
 * @description
 *
 * @docsCategory promotions
 * @docsPage promotion-action
 */
export interface PromotionItemActionConfig<T extends PromotionActionArgs> extends PromotionActionConfig<T> {
    /**
     * @description
     * The function which contains the promotion calculation logic.
     */
    execute: ExecutePromotionItemActionFn<T>;
}

/**
 * @description
 *
 * @docsCategory promotions
 * @docsPage promotion-action
 */
export interface PromotionOrderActionConfig<T extends PromotionActionArgs> extends PromotionActionConfig<T> {
    /**
     * @description
     * The function which contains the promotion calculation logic.
     */
    execute: ExecutePromotionOrderActionFn<T>;
}

/**
 * @description
 * An abstract class which is extended by {@link PromotionItemAction} and {@link PromotionOrderAction}.
 *
 * @docsCategory promotions
 * @docsPage promotion-action
 */
export abstract class PromotionAction<T extends PromotionActionArgs = {}> extends ConfigurableOperationDef<
    T
> {
    readonly priorityValue: number;

    protected constructor(config: PromotionActionConfig<T>) {
        super(config);
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
 * @docsPage promotion-action
 */
export class PromotionItemAction<T extends PromotionActionArgs = {}> extends PromotionAction<T> {
    private readonly executeFn: ExecutePromotionItemActionFn<T>;
    constructor(config: PromotionItemActionConfig<T>) {
        super(config);
        this.executeFn = config.execute;
    }

    /** @internal */
    execute(orderItem: OrderItem, orderLine: OrderLine, args: ConfigArg[], utils: PromotionUtils) {
        return this.executeFn(orderItem, orderLine, this.argsArrayToHash(args), utils);
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
 * @docsPage promotion-action
 */
export class PromotionOrderAction<T extends PromotionActionArgs = {}> extends PromotionAction<T> {
    private readonly executeFn: ExecutePromotionOrderActionFn<T>;
    constructor(config: PromotionOrderActionConfig<T>) {
        super(config);
        this.executeFn = config.execute;
    }

    /** @internal */
    execute(order: Order, args: ConfigArg[], utils: PromotionUtils) {
        return this.executeFn(order, this.argsArrayToHash(args), utils);
    }
}
