import { ConfigArg } from '@vendure/common/lib/generated-types';

import {
    ConfigArgs,
    ConfigArgValues,
    ConfigurableOperationDef,
    ConfigurableOperationDefOptions,
} from '../../common/configurable-operation';
import { OrderItem } from '../../entity/order-item/order-item.entity';
import { OrderLine } from '../../entity/order-line/order-line.entity';
import { Order } from '../../entity/order/order.entity';

/**
 * @description
 * The function which is used by a PromotionItemAction to calculate the
 * discount on the OrderItem.
 *
 * @docsCategory promotions
 * @docsPage promotion-action
 */
export type ExecutePromotionItemActionFn<T extends ConfigArgs> = (
    orderItem: OrderItem,
    orderLine: OrderLine,
    args: ConfigArgValues<T>,
) => number | Promise<number>;

/**
 * @description
 * The function which is used by a PromotionOrderAction to calculate the
 * discount on the Order.
 *
 * @docsCategory promotions
 * @docsPage promotion-action
 */
export type ExecutePromotionOrderActionFn<T extends ConfigArgs> = (
    order: Order,
    args: ConfigArgValues<T>,
) => number | Promise<number>;

export interface PromotionActionConfig<T extends ConfigArgs> extends ConfigurableOperationDefOptions<T> {
    priorityValue?: number;
}

/**
 * @description
 *
 * @docsCategory promotions
 * @docsPage promotion-action
 */
export interface PromotionItemActionConfig<T extends ConfigArgs> extends PromotionActionConfig<T> {
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
export interface PromotionOrderActionConfig<T extends ConfigArgs> extends PromotionActionConfig<T> {
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
 * @docsWeight 0
 */
export abstract class PromotionAction<T extends ConfigArgs = {}> extends ConfigurableOperationDef<T> {
    /**
     * @description
     * Used to determine the order of application of multiple Promotions
     * on the same Order. See the {@link Promotion} `priorityScore` field for
     * more information.
     *
     * @default 0
     */
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
 * @docsWeight 1
 */
export class PromotionItemAction<T extends ConfigArgs = ConfigArgs> extends PromotionAction<T> {
    private readonly executeFn: ExecutePromotionItemActionFn<T>;
    constructor(config: PromotionItemActionConfig<T>) {
        super(config);
        this.executeFn = config.execute;
    }

    /** @internal */
    execute(orderItem: OrderItem, orderLine: OrderLine, args: ConfigArg[]) {
        return this.executeFn(orderItem, orderLine, this.argsArrayToHash(args));
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
 * @docsWeight 2
 */
export class PromotionOrderAction<T extends ConfigArgs = ConfigArgs> extends PromotionAction<T> {
    private readonly executeFn: ExecutePromotionOrderActionFn<T>;
    constructor(config: PromotionOrderActionConfig<T>) {
        super(config);
        this.executeFn = config.execute;
    }

    /** @internal */
    execute(order: Order, args: ConfigArg[]) {
        return this.executeFn(order, this.argsArrayToHash(args));
    }
}
