import { ConfigArg } from '@vendure/common/lib/generated-types';
import { pick } from '@vendure/common/lib/pick';

import { RequestContext } from '../../api/common/request-context';
import {
    ConfigArgs,
    ConfigArgValues,
    ConfigurableOperationDef,
    ConfigurableOperationDefOptions,
} from '../../common/configurable-operation';
import { PromotionState } from '../../entity';
import { OrderItem } from '../../entity/order-item/order-item.entity';
import { OrderLine } from '../../entity/order-line/order-line.entity';
import { Order } from '../../entity/order/order.entity';
import { ShippingLine } from '../../entity/shipping-line/shipping-line.entity';

import { PromotionConditionState } from './promotion-condition';


export type ConditionConfig = {
    [name: string]: { required?: boolean };
}

export type ConditionalState<U extends ConditionConfig> = {
    [K in keyof U]: U[K]['required'] extends true ? PromotionConditionState : PromotionConditionState | undefined;
}

/**
 * @description
 * The function which is used by a PromotionItemAction to calculate the
 * discount on the OrderItem.
 *
 * @docsCategory promotions
 * @docsPage promotion-action
 */
export type ExecutePromotionItemActionFn<T extends ConfigArgs, U extends ConditionConfig> = (
    ctx: RequestContext,
    orderItem: OrderItem,
    orderLine: OrderLine,
    args: ConfigArgValues<T>,
    state: ConditionalState<U>,
) => number | Promise<number>;

/**
 * @description
 * The function which is used by a PromotionOrderAction to calculate the
 * discount on the Order.
 *
 * @docsCategory promotions
 * @docsPage promotion-action
 */
export type ExecutePromotionOrderActionFn<T extends ConfigArgs, U extends ConditionConfig> = (
    ctx: RequestContext,
    order: Order,
    args: ConfigArgValues<T>,
    state: ConditionalState<U>,
) => number | Promise<number>;

/**
 * @description
 * The function which is used by a PromotionOrderAction to calculate the
 * discount on the Order.
 *
 * @docsCategory promotions
 * @docsPage promotion-action
 */
export type ExecutePromotionShippingActionFn<T extends ConfigArgs, U extends ConditionConfig> = (
    ctx: RequestContext,
    shippingLine: ShippingLine,
    order: Order,
    args: ConfigArgValues<T>,
    state: ConditionalState<U>,
) => number | Promise<number>;


export interface PromotionActionConfig<T extends ConfigArgs, U extends ConditionConfig>
    extends ConfigurableOperationDefOptions<T> {
    priorityValue?: number;
    conditions?: U;
}

/**
 * @description
 * Configuration for a {@link PromotionItemAction}
 *
 * @docsCategory promotions
 * @docsPage promotion-action
 */
export interface PromotionItemActionConfig<T extends ConfigArgs, U extends ConditionConfig>
    extends PromotionActionConfig<T, U> {
    /**
     * @description
     * The function which contains the promotion calculation logic.
     */
    execute: ExecutePromotionItemActionFn<T, U>;
}

/**
 * @description
 *
 * @docsCategory promotions
 * @docsPage promotion-action
 */
export interface PromotionOrderActionConfig<T extends ConfigArgs, U extends ConditionConfig>
    extends PromotionActionConfig<T, U> {
    /**
     * @description
     * The function which contains the promotion calculation logic.
     */
    execute: ExecutePromotionOrderActionFn<T, U>;
}

/**
 * @description
 *
 * @docsCategory promotions
 * @docsPage promotion-action
 */
export interface PromotionShippingActionConfig<T extends ConfigArgs, U extends ConditionConfig>
    extends PromotionActionConfig<T, U> {
    /**
     * @description
     * The function which contains the promotion calculation logic.
     */
    execute: ExecutePromotionShippingActionFn<T, U>;
}

/**
 * @description
 * An abstract class which is extended by {@link PromotionItemAction} and {@link PromotionOrderAction}.
 *
 * @docsCategory promotions
 * @docsPage promotion-action
 * @docsWeight 0
 */
export abstract class PromotionAction<T extends ConfigArgs = {}, U extends ConditionConfig = {}> extends ConfigurableOperationDef<T> {
    /**
     * @description
     * Used to determine the order of application of multiple Promotions
     * on the same Order. See the {@link Promotion} `priorityScore` field for
     * more information.
     *
     * @default 0
     */
    readonly priorityValue: number;
    readonly conditions?: U;

    protected constructor(config: PromotionActionConfig<T, U>) {
        super(config);
        this.priorityValue = config.priorityValue || 0;
        this.conditions = config.conditions;
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
 *     execute(ctx, orderItem, orderLine, args) {
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
export class PromotionItemAction<T extends ConfigArgs = ConfigArgs, U extends ConditionConfig = {}>
    extends PromotionAction<T, U> {
    private readonly executeFn: ExecutePromotionItemActionFn<T, U>;
    constructor(config: PromotionItemActionConfig<T, U>) {
        super(config);
        this.executeFn = config.execute;
    }

    /** @internal */
    execute(ctx: RequestContext, orderItem: OrderItem, orderLine: OrderLine, args: ConfigArg[], state: PromotionState) {
        const actionState = this.conditions ? pick(state, Object.keys(this.conditions)) : {};
        return this.executeFn(ctx, orderItem, orderLine, this.argsArrayToHash(args), actionState as ConditionalState<U>);
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
 *     execute(ctx, order, args) {
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
export class PromotionOrderAction<T extends ConfigArgs = ConfigArgs, U extends ConditionConfig = {}> extends PromotionAction<T, U> {
    private readonly executeFn: ExecutePromotionOrderActionFn<T, U>;
    constructor(config: PromotionOrderActionConfig<T, U>) {
        super(config);
        this.executeFn = config.execute;
    }

    /** @internal */
    execute(ctx: RequestContext, order: Order, args: ConfigArg[], state: PromotionState) {
        const actionState = this.conditions ? pick(state, Object.keys(this.conditions)) : {};
        return this.executeFn(ctx, order, this.argsArrayToHash(args), actionState as ConditionalState<U>);
    }
}

/**
 * @description
 * Represents a PromotionAction which applies to the shipping cost of an Order.
 *
 * @docsCategory promotions
 * @docsPage promotion-action
 * @docsWeight 3
 */
export class PromotionShippingAction<T extends ConfigArgs = ConfigArgs, U extends ConditionConfig = {}> extends PromotionAction<T, U> {
    private readonly executeFn: ExecutePromotionShippingActionFn<T, U>;
    constructor(config: PromotionShippingActionConfig<T, U>) {
        super(config);
        this.executeFn = config.execute;
    }

    /** @internal */
    execute(ctx: RequestContext, shippingLine: ShippingLine, order: Order, args: ConfigArg[], state: PromotionState) {
        const actionState = this.conditions ? pick(state, Object.keys(this.conditions)) : {};
        return this.executeFn(ctx, shippingLine, order, this.argsArrayToHash(args), actionState as ConditionalState<U>);
    }
}
