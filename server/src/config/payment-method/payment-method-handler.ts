import { ConfigArg, ConfigArgType } from '../../../../shared/generated-types';

import {
    argsArrayToHash,
    ConfigArgs,
    ConfigArgValues,
    ConfigurableOperationDef,
} from '../../common/configurable-operation';
import { StateMachineConfig } from '../../common/finite-state-machine';
import { Order } from '../../entity/order/order.entity';
import { PaymentMetadata } from '../../entity/payment/payment.entity';
import {
    PaymentState,
    PaymentTransitionData,
} from '../../service/helpers/payment-state-machine/payment-state';

export type PaymentMethodArgType = ConfigArgType.INT | ConfigArgType.STRING | ConfigArgType.BOOLEAN;
export type PaymentMethodArgs = ConfigArgs<PaymentMethodArgType>;
export type OnTransitionStartReturnType = ReturnType<Required<StateMachineConfig<any>>['onTransitionStart']>;

export type OnTransitionStartFn<T extends PaymentMethodArgs> = (
    fromState: PaymentState,
    toState: PaymentState,
    args: ConfigArgValues<T>,
    data: PaymentTransitionData,
) => OnTransitionStartReturnType;

/**
 * @description
 * This object is the return value of the {@link CreatePaymentFn}.
 *
 * @docsCategory payment
 */
export interface PaymentConfig {
    amount: number;
    state: PaymentState;
    transactionId?: string;
    metadata?: PaymentMetadata;
}

/**
 * @description
 * This function contains the logic for creating a payment. See {@link PaymentMethodHandler} for an example.
 *
 * @docsCategory payment
 */
export type CreatePaymentFn<T extends PaymentMethodArgs> = (
    order: Order,
    args: ConfigArgValues<T>,
    metadata: PaymentMetadata,
) => PaymentConfig | Promise<PaymentConfig>;

/**
 * @description
 * Defines the object which is used to construct the {@link PaymentMethodHandler}.
 *
 * @docsCategory payment
 */
export interface PaymentMethodConfigOptions<T extends PaymentMethodArgs = PaymentMethodArgs> {
    /**
     * @description
     * A unique code used to identify this handler.
     */
    code: string;
    /**
     * @description
     * A human-readable description for the payment method.
     */
    description: string;
    /**
     * @description
     * This function provides the actual logic for creating a payment. For example,
     * it may call out to a third-party service with the data and should return a
     * {@link PaymentConfig} object contains the details of the payment.
     */
    createPayment: CreatePaymentFn<T>;
    /**
     * @description
     * Optional provider-specific arguments which, when specified, are
     * editable in the admin-ui. Typically args could be used to store an API key
     * for a payment provider service.
     *
     * @example
     * ```ts
     * args: {
     *   apiKey: 'string',
     * }
     * ```
     */
    args: T;
    /**
     * @description
     * This function, when specified, will be invoked before any transition from one {@link PaymentState} to another.
     * The return value (a sync / async `boolean`) is used to determine whether the transition is permitted.
     */
    onStateTransitionStart?: OnTransitionStartFn<T>;
}

/**
 * @description
 * A PaymentMethodHandler contains the code which is used to generate a Payment when a call to the
 * `addPaymentToOrder` mutation is made. If contains any necessary steps of interfacing with a
 * third-party payment gateway before the Payment is created and can also define actions to fire
 * when the state of the payment is changed.
 *
 * @example
 * ```ts
 * // A mock 3rd-party payment SDK
 * import gripeSDK from 'gripe';
 *
 * export const examplePaymentHandler = new PaymentMethodHandler({
 *     code: 'example-payment-provider',
 *     description: 'Example Payment Provider',
 *     args: {
 *         apiKey: 'string',
 *     },
 *     createPayment: async (order, args, metadata): Promise<PaymentConfig> => {
 *         try {
 *             const result = await gripeSDK.charges.create({
 *                 apiKey: args.apiKey,
 *                 amount: order.total,
 *                 source: metadata.authToken,
 *             });
 *             return {
 *                 amount: order.total,
 *                 state: 'Settled' as 'Settled',
 *                 transactionId: result.id.toString(),
 *                 metadata: result.outcome,
 *             };
 *         } catch (err) {
 *             return {
 *                 amount: order.total,
 *                 state: 'Declined' as 'Declined',
 *                 metadata: {
 *                     errorMessage: err.message,
 *                 },
 *             };
 *         }
 *     },
 * });
 * ```
 *
 * @docsCategory payment
 */
export class PaymentMethodHandler<T extends PaymentMethodArgs = PaymentMethodArgs>
    implements ConfigurableOperationDef {
    readonly code: string;
    readonly description: string;
    readonly args: T;
    private readonly createPaymentFn: CreatePaymentFn<T>;
    private readonly onTransitionStartFn?: OnTransitionStartFn<T>;

    constructor(config: PaymentMethodConfigOptions<T>) {
        this.code = config.code;
        this.description = config.description;
        this.args = config.args;
        this.createPaymentFn = config.createPayment;
        this.onTransitionStartFn = config.onStateTransitionStart;
    }

    /**
     * @description
     * Called internally to create a new Payment
     */
    async createPayment(order: Order, args: ConfigArg[], metadata: PaymentMetadata) {
        const paymentConfig = await this.createPaymentFn(order, argsArrayToHash(args), metadata);
        return {
            method: this.code,
            ...paymentConfig,
        };
    }

    /**
     * @description
     * This function is called before the state of a Payment is transitioned. If the PaymentMethodHandler
     * was instantiated with a `onStateTransitionStart` function, that function will be invoked and its
     * return value used to determine whether the transition can occur.
     *
     * @docsCategory payment
     */
    onStateTransitionStart(
        fromState: PaymentState,
        toState: PaymentState,
        args: ConfigArg[],
        data: PaymentTransitionData,
    ): OnTransitionStartReturnType {
        if (typeof this.onTransitionStartFn === 'function') {
            return this.onTransitionStartFn(fromState, toState, argsArrayToHash(args), data);
        } else {
            return true;
        }
    }
}
