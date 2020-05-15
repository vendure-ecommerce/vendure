import { ConfigArg } from '@vendure/common/lib/generated-types';
import { ConfigArgSubset, ID } from '@vendure/common/lib/shared-types';

import {
    argsArrayToHash,
    ConfigArgs,
    ConfigArgValues,
    ConfigurableOperationDef,
    ConfigurableOperationDefOptions,
    LocalizedStringArray,
} from '../../common/configurable-operation';
import { OrderLine } from '../../entity';
import { Order } from '../../entity/order/order.entity';

export type PromotionConditionArgType = ConfigArgSubset<
    'int' | 'string' | 'datetime' | 'boolean' | 'facetValueIds'
>;
export type PromotionConditionArgs = ConfigArgs<PromotionConditionArgType>;

/**
 * @description
 * An object containing utility methods which may be used in promotion `check` functions
 * in order to determine whether a promotion should be applied.
 *
 * TODO: Remove this and use the new init() method to inject providers where needed.
 *
 * @docsCategory promotions
 * @docsPage promotion-condition
 */
export interface PromotionUtils {
    /**
     * @description
     * Checks a given {@link OrderLine} against the facetValueIds and returns
     * `true` if the associated {@link ProductVariant} & {@link Product} together
     * have *all* the specified {@link FacetValue}s.
     */
    hasFacetValues: (orderLine: OrderLine, facetValueIds: ID[]) => Promise<boolean>;
}

/**
 * @description
 * A function which checks whether or not a given {@link Order} satisfies the {@link PromotionCondition}.
 *
 * @docsCategory promotions
 * @docsPage promotion-condition
 */
export type CheckPromotionConditionFn<T extends PromotionConditionArgs> = (
    order: Order,
    args: ConfigArgValues<T>,
    utils: PromotionUtils,
) => boolean | Promise<boolean>;

export interface PromotionConditionConfig<T extends PromotionConditionArgs>
    extends ConfigurableOperationDefOptions<T> {
    check: CheckPromotionConditionFn<T>;
    priorityValue?: number;
}

/**
 * @description
 * PromotionConditions are used to create {@link Promotion}s. The purpose of a PromotionCondition
 * is to check the order against a particular predicate function (the `check` function) and to return
 * `true` if the Order satisfies the condition, or `false` if it does not.
 *
 * @docsCategory promotions
 * @docsPage promotion-condition
 */
export class PromotionCondition<T extends PromotionConditionArgs = {}> extends ConfigurableOperationDef<T> {
    readonly priorityValue: number;
    private readonly checkFn: CheckPromotionConditionFn<T>;

    constructor(config: PromotionConditionConfig<T>) {
        super(config);
        this.checkFn = config.check;
        this.priorityValue = config.priorityValue || 0;
    }

    async check(order: Order, args: ConfigArg[], utils: PromotionUtils): Promise<boolean> {
        return this.checkFn(order, argsArrayToHash<T>(args), utils);
    }
}
