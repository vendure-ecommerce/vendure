import { ConfigArg } from '@vendure/common/lib/generated-types';

import { RequestContext } from '../../api/common/request-context';
import {
    ConfigArgs,
    ConfigArgValues,
    ConfigurableOperationDef,
    ConfigurableOperationDefOptions,
} from '../../common/configurable-operation';
import { OnTransitionStartFn } from '../../common/finite-state-machine/types';
import { Fulfillment } from '../../entity/fulfillment/fulfillment.entity';
import { OrderItem } from '../../entity/order-item/order-item.entity';
import { Order } from '../../entity/order/order.entity';
import {
    FulfillmentState,
    FulfillmentTransitionData,
} from '../../service/helpers/fulfillment-state-machine/fulfillment-state';
import { CalculateShippingFnResult } from '../shipping-method/shipping-calculator';

export type CreateFulfillmentResult = Partial<Pick<Fulfillment, 'trackingCode' | 'method' | 'customFields'>>;

/**
 * @description
 * The function called when creating a new Fulfillment
 *
 * @docsCategory fulfillment
 * @docsPage FulfillmentHandler
 */
export type CreateFulfillmentFn<T extends ConfigArgs> = (
    ctx: RequestContext,
    orders: Order[],
    orderItems: OrderItem[],
    args: ConfigArgValues<T>,
) => CreateFulfillmentResult | Promise<CreateFulfillmentResult>;

/**
 * @description
 * The configuration object used to instantiate a {@link FulfillmentHandler}.
 *
 * @docsCategory fulfillment
 * @docsPage FulfillmentHandler
 */
export interface FulfillmentHandlerConfig<T extends ConfigArgs> extends ConfigurableOperationDefOptions<T> {
    createFulfillment: CreateFulfillmentFn<T>;
    onFulfillmentTransition?: OnTransitionStartFn<FulfillmentState, FulfillmentTransitionData>;
}

/**
 * @description
 * A FulfillmentHandler is used when creating a new {@link Fulfillment}. When the `addFulfillmentToOrder` mutation
 * is executed, the specified handler will be used and it's `createFulfillment` method is called. This method
 * may perform async tasks such as calling a 3rd-party shipping API to register a new shipment and receive
 * a tracking code. This data can then be returned and will be incorporated into the created Fulfillment.
 *
 * If the `args` property is defined, this means that arguments passed to the `addFulfillmentToOrder` mutation
 * will be passed through to the `createFulfillment` method as the last argument.
 *
 * @example
 * ```TypeScript
 * let shipomatic;
 *
 * export const shipomaticFulfillmentHandler = new FulfillmentHandler({
 *   code: 'ship-o-matic',
 *   description: [{
 *     languageCode: LanguageCode.en,
 *     value: 'Generate tracking codes via the Ship-o-matic API'
 *   }],
 *
 *   args: {
 *     preferredService: {
 *       type: 'string',
 *       config: {
 *         options: [
 *           { value: 'first_class' },
 *           { value: 'priority'},
 *           { value: 'standard' },
 *         ],
 *       },
 *     }
 *   },
 *
 *   init: () => {
 *     // some imaginary shipping service
 *     shipomatic = new ShipomaticClient(API_KEY);
 *   },
 *
 *   createFulfillment: async (ctx, orders, orderItems, args) => {
 *      const shipment = getShipmentFromOrders(orders, orderItems);
 *      try {
 *        const transaction = await shipomatic.transaction.create({
 *          shipment,
 *          service_level: args.preferredService,
 *          label_file_type: 'png',
 *        })
 *        return {
 *          method: args.method,
 *          trackingCode: args.trackingCode,
 *        };
 *      } catch (e) {
 *        // Errors thrown from within this function will
 *        // result in a CreateFulfillmentError being returned
 *        throw e;
 *      }
 *   },
 *
 *   onFulfillmentTransition: async (fromState, toState, { fulfillment }) => {
 *     if (toState === 'Cancelled') {
 *       await shipomatic.transaction.cancel({
 *         tracking_code: fulfillment.trackingCode,
 *       });
 *     }
 *   }
 * });
 * ```
 *
 * @docsCategory fulfillment
 * @docsPage FulfillmentHandler
 * @docsWeight 0
 */
export class FulfillmentHandler<T extends ConfigArgs = ConfigArgs> extends ConfigurableOperationDef<T> {
    private readonly createFulfillmentFn: CreateFulfillmentFn<T>;
    private readonly onFulfillmentTransitionFn:
        | OnTransitionStartFn<FulfillmentState, FulfillmentTransitionData>
        | undefined;

    constructor(config: FulfillmentHandlerConfig<T>) {
        super(config);
        this.createFulfillmentFn = config.createFulfillment;
        if (config.onFulfillmentTransition) {
            this.onFulfillmentTransitionFn = config.onFulfillmentTransition;
        }
    }

    /**
     * @internal
     */
    createFulfillment(
        ctx: RequestContext,
        orders: Order[],
        orderItems: OrderItem[],
        args: ConfigArg[],
    ): Partial<Fulfillment> | Promise<Partial<Fulfillment>> {
        return this.createFulfillmentFn(ctx, orders, orderItems, this.argsArrayToHash(args));
    }

    /**
     * @internal
     */
    onFulfillmentTransition(
        fromState: FulfillmentState,
        toState: FulfillmentState,
        data: FulfillmentTransitionData,
    ) {
        if (typeof this.onFulfillmentTransitionFn === 'function') {
            return this.onFulfillmentTransitionFn(fromState, toState, data);
        }
    }
}
