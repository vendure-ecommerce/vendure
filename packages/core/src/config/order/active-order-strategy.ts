import { DocumentNode } from 'graphql';

import { RequestContext } from '../../api/index';
import { InjectableStrategy } from '../../common/index';
import { Order } from '../../entity/index';

export const ACTIVE_ORDER_INPUT_FIELD_NAME = 'activeOrderInput';

/**
 * @description
 * This strategy is used to determine the active Order for all order-related operations in
 * the Shop API. By default, all the Shop API operations that relate to the active Order (e.g.
 * `activeOrder`, `addItemToOrder`, `applyCouponCode` etc.) will implicitly create a new Order
 * and set it on the current Session, and then read the session to obtain the active Order.
 * This behaviour is defined by the {@link DefaultActiveOrderStrategy}.
 *
 * @since 1.9.0
 */
export interface ActiveOrderStrategy extends InjectableStrategy {
    /**
     * @description
     * The name of the strategy, e.g. "orderByToken", which will also be used as the
     * field name in the ActiveOrderInput type.
     */
    readonly name: string;

    /**
     * @description
     * Defines the type of the GraphQL Input object expected by the `authenticate`
     * mutation. The final input object will be a map, with the key being the name
     * of the strategy. The shape of the input object should match the generic `Data`
     * type argument.
     *
     * @example
     * For example, given the following:
     *
     * ```TypeScript
     * defineInputType() {
     *   return gql`
     *      input OrderTokenInput {
     *        token: String!
     *      }
     *   `;
     * }
     * ```
     *
     * assuming the strategy name is "my_auth", then the resulting call to `authenticate`
     * would look like:
     *
     * ```GraphQL
     * activeOrder(activeOrderInput: {
     *   orderByToken: {
     *     token: "foo"
     *   }
     * }) {
     *   # ...
     * }
     * ```
     *
     * **Note:** if more than one graphql `input` type is being defined (as in a nested input type), then
     * the _first_ input will be assumed to be the top-level input.
     */
    defineInputType?: () => DocumentNode;

    /**
     * @description
     * Certain mutations such as `addItemToOrder` can automatically create a new Order if one does not exist.
     * In these cases, this method will be called to create the new Order.
     *
     * If automatic creation of an Order does not make sense in your strategy, then leave this method
     * undefined. You'll then need to take care of creating an order manually by defining a custom mutation.
     */
    createActiveOrder?: (ctx: RequestContext, inputs: any) => Promise<Order>;

    /**
     * @description
     * This method is used to determine the active Order based on the current RequestContext in addition to any
     * input values provided, as defined by the `defineInputType` method of this strategy.
     *
     * Note that this method is invoked frequently so you should aim to keep it efficient. The returned Order,
     * for example, does not need to have its various relations joined.
     */
    determineActiveOrder(ctx: RequestContext, inputs: any): Promise<Order | undefined>;
}
