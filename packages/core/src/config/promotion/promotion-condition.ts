import { ConfigArg } from '@vendure/common/lib/generated-types';

import { RequestContext } from '../../api/common/request-context';
import {
    ConfigArgs,
    ConfigArgValues,
    ConfigurableOperationDef,
    ConfigurableOperationDefOptions,
} from '../../common/configurable-operation';
import { Order } from '../../entity/order/order.entity';

export type CheckPromotionConditionResult = boolean | PromotionConditionState;

/**
 * @description
 * A function which checks whether or not a given {@link Order} satisfies the {@link PromotionCondition}.
 *
 * @docsCategory promotions
 * @docsPage promotion-condition
 */
export type CheckPromotionConditionFn<T extends ConfigArgs> = (
    ctx: RequestContext,
    order: Order,
    args: ConfigArgValues<T>,
) => CheckPromotionConditionResult | Promise<CheckPromotionConditionResult>;

/**
 * @description
 * This object is used to configure a PromotionCondition.
 *
 * @docsCategory promotions
 * @docsPage promotion-condition
 * @docsWeight 1
 */
export interface PromotionConditionConfig<T extends ConfigArgs> extends ConfigurableOperationDefOptions<T> {
    check: CheckPromotionConditionFn<T>;
    priorityValue?: number;
}

export type PromotionConditionState = Record<string, unknown>;

/**
 * @description
 * PromotionConditions are used to create {@link Promotion}s. The purpose of a PromotionCondition
 * is to check the order against a particular predicate function (the `check` function) and to return
 * `true` if the Order satisfies the condition, or `false` if it does not.
 *
 * @docsCategory promotions
 * @docsPage promotion-condition
 * @docsWeight 0
 */
export class PromotionCondition<T extends ConfigArgs = ConfigArgs> extends ConfigurableOperationDef<T> {
    /**
     * @description
     * Used to determine the order of application of multiple Promotions
     * on the same Order. See the {@link Promotion} `priorityScore` field for
     * more information.
     *
     * @default 0
     */
    readonly priorityValue: number;
    private readonly checkFn: CheckPromotionConditionFn<T>;

    constructor(config: PromotionConditionConfig<T>) {
        super(config);
        this.checkFn = config.check;
        this.priorityValue = config.priorityValue || 0;
    }

    async check(ctx: RequestContext, order: Order, args: ConfigArg[]): Promise<CheckPromotionConditionResult> {
        return this.checkFn(ctx, order, this.argsArrayToHash(args));
    }
}
