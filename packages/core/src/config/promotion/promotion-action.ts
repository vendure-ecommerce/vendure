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

import { PromotionCondition } from './promotion-condition';

/**
 * Unwrap a promise type
 */
type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T;

/**
 * Extract the (non-false) return value of the PromotionCondition "check" function.
 */
type ConditionCheckReturnType<T extends PromotionCondition<any>> = Exclude<
    Awaited<ReturnType<T['check']>>,
    false
>;

/**
 * Converts an array of PromotionCondition types into a tuple, thus preserving the
 * distinct type of each condition in the array.
 */
export type ConditionTuple<C extends Array<PromotionCondition<any>>> = [...C];

/**
 * Converts an array of PromotionConditions into a tuple of the type:
 * [<condition code>, <check function return value>]
 */
type CodesStateTuple<T extends ConditionTuple<Array<PromotionCondition<any>>>> = {
    [K in keyof T]: T[K] extends PromotionCondition<any>
        ? [T[K]['code'], ConditionCheckReturnType<T[K]>]
        : never;
};

/**
 * Convert a tuple into a union
 * [[string, number], [number, boolean]] => [string, number] | [number, boolean]
 */
type TupleToUnion<T extends any[]> = T[number];

/**
 * Converts an array of PromotionConditions into an object of the type:
 * {
 *     [PromotionCondition.code]: ReturnType<PromotionCondition.check()>
 * }
 */
export type ConditionState<
    U extends Array<PromotionCondition<any>>,
    T extends [string, any] = TupleToUnion<CodesStateTuple<ConditionTuple<U>>>
> = { [key in T[0]]: Extract<T, [key, any]>[1] };

/**
 * @description
 * The function which is used by a PromotionItemAction to calculate the
 * discount on the OrderItem.
 *
 * @docsCategory promotions
 * @docsPage promotion-action
 */
export type ExecutePromotionItemActionFn<T extends ConfigArgs, U extends Array<PromotionCondition<any>>> = (
    ctx: RequestContext,
    orderItem: OrderItem,
    orderLine: OrderLine,
    args: ConfigArgValues<T>,
    state: ConditionState<U>,
) => number | Promise<number>;

/**
 * @description
 * The function which is used by a PromotionOrderAction to calculate the
 * discount on the Order.
 *
 * @docsCategory promotions
 * @docsPage promotion-action
 */
export type ExecutePromotionOrderActionFn<T extends ConfigArgs, U extends Array<PromotionCondition<any>>> = (
    ctx: RequestContext,
    order: Order,
    args: ConfigArgValues<T>,
    state: ConditionState<U>,
) => number | Promise<number>;

/**
 * @description
 * The function which is used by a PromotionOrderAction to calculate the
 * discount on the Order.
 *
 * @docsCategory promotions
 * @docsPage promotion-action
 */
export type ExecutePromotionShippingActionFn<
    T extends ConfigArgs,
    U extends Array<PromotionCondition<any>>
> = (
    ctx: RequestContext,
    shippingLine: ShippingLine,
    order: Order,
    args: ConfigArgValues<T>,
    state: ConditionState<U>,
) => number | Promise<number>;

/**
 * @description
 * Configuration for all types of {@link PromotionAction}.
 *
 * @docsCategory promotions
 * @docsPage promotion-action
 */
export interface PromotionActionConfig<
    T extends ConfigArgs,
    U extends Array<PromotionCondition<any>> | undefined
> extends ConfigurableOperationDefOptions<T> {
    /**
     * @description
     * Used to determine the order of application of multiple Promotions
     * on the same Order. See the {@link Promotion} `priorityScore` field for
     * more information.
     *
     * @default 0
     */
    priorityValue?: number;
    /**
     * @description
     * Allows PromotionActions to define one or more PromotionConditions as dependencies. Having a PromotionCondition
     * as a dependency has the following consequences:
     * 1. A Promotion using this PromotionAction is only valid if it also contains all PromotionConditions
     * on which it depends.
     * 2. The `execute()` function will receive a statically-typed `state` argument which will contain
     * the return values of the PromotionConditions' `check()` function.
     */
    conditions?: U extends undefined ? undefined : ConditionTuple<Exclude<U, undefined>>;
}

/**
 * @description
 * Configuration for a {@link PromotionItemAction}
 *
 * @docsCategory promotions
 * @docsPage promotion-action
 */
export interface PromotionItemActionConfig<T extends ConfigArgs, U extends PromotionCondition[]>
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
export interface PromotionOrderActionConfig<T extends ConfigArgs, U extends PromotionCondition[]>
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
export interface PromotionShippingActionConfig<T extends ConfigArgs, U extends PromotionCondition[]>
    extends PromotionActionConfig<T, U> {
    /**
     * @description
     * The function which contains the promotion calculation logic.
     */
    execute: ExecutePromotionShippingActionFn<T, U>;
}

/**
 * @description
 * An abstract class which is extended by {@link PromotionItemAction}, {@link PromotionOrderAction},
 * and {@link PromotionShippingAction}.
 *
 * @docsCategory promotions
 * @docsPage promotion-action
 * @docsWeight 0
 */
export abstract class PromotionAction<
    T extends ConfigArgs = {},
    U extends PromotionCondition[] | undefined = any
> extends ConfigurableOperationDef<T> {
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
export class PromotionItemAction<
    T extends ConfigArgs = ConfigArgs,
    U extends Array<PromotionCondition<any>> = []
> extends PromotionAction<T, U> {
    private readonly executeFn: ExecutePromotionItemActionFn<T, U>;
    constructor(config: PromotionItemActionConfig<T, U>) {
        super(config);
        this.executeFn = config.execute;
    }

    /** @internal */
    execute(
        ctx: RequestContext,
        orderItem: OrderItem,
        orderLine: OrderLine,
        args: ConfigArg[],
        state: PromotionState,
    ) {
        const actionState = this.conditions
            ? pick(
                  state,
                  this.conditions.map(c => c.code),
              )
            : {};
        return this.executeFn(
            ctx,
            orderItem,
            orderLine,
            this.argsArrayToHash(args),
            actionState as ConditionState<U>,
        );
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
export class PromotionOrderAction<
    T extends ConfigArgs = ConfigArgs,
    U extends PromotionCondition[] = []
> extends PromotionAction<T, U> {
    private readonly executeFn: ExecutePromotionOrderActionFn<T, U>;
    constructor(config: PromotionOrderActionConfig<T, U>) {
        super(config);
        this.executeFn = config.execute;
    }

    /** @internal */
    execute(ctx: RequestContext, order: Order, args: ConfigArg[], state: PromotionState) {
        const actionState = this.conditions ? pick(state, Object.keys(this.conditions)) : {};
        return this.executeFn(ctx, order, this.argsArrayToHash(args), actionState as ConditionState<U>);
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
export class PromotionShippingAction<
    T extends ConfigArgs = ConfigArgs,
    U extends PromotionCondition[] = []
> extends PromotionAction<T, U> {
    private readonly executeFn: ExecutePromotionShippingActionFn<T, U>;
    constructor(config: PromotionShippingActionConfig<T, U>) {
        super(config);
        this.executeFn = config.execute;
    }

    /** @internal */
    execute(
        ctx: RequestContext,
        shippingLine: ShippingLine,
        order: Order,
        args: ConfigArg[],
        state: PromotionState,
    ) {
        const actionState = this.conditions ? pick(state, Object.keys(this.conditions)) : {};
        return this.executeFn(
            ctx,
            shippingLine,
            order,
            this.argsArrayToHash(args),
            actionState as ConditionState<U>,
        );
    }
}
