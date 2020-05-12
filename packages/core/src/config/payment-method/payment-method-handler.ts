import { ConfigArg, RefundOrderInput } from '@vendure/common/lib/generated-types';
import { ConfigArgSubset } from '@vendure/common/lib/shared-types';

import {
    argsArrayToHash,
    ConfigArgs,
    ConfigArgValues,
    ConfigurableOperationDef,
    ConfigurableOperationDefOptions,
    LocalizedStringArray,
} from '../../common/configurable-operation';
import { StateMachineConfig } from '../../common/finite-state-machine';
import { Order } from '../../entity/order/order.entity';
import { Payment, PaymentMetadata } from '../../entity/payment/payment.entity';
import {
    PaymentState,
    PaymentTransitionData,
} from '../../service/helpers/payment-state-machine/payment-state';
import { RefundState } from '../../service/helpers/refund-state-machine/refund-state';

export type PaymentMethodArgType = ConfigArgSubset<'int' | 'string' | 'boolean'>;
export type PaymentMethodArgs = ConfigArgs<PaymentMethodArgType>;
export type OnTransitionStartReturnType = ReturnType<Required<StateMachineConfig<any>>['onTransitionStart']>;

/**
 * @description
 * The signature of the function defined by `onStateTransitionStart` in {@link PaymentMethodConfigOptions}.
 *
 * This function is called before the state of a Payment is transitioned. Its
 * return value used to determine whether the transition can occur.
 *
 * @docsCategory payment
 * @docsPage Payment Method Types
 */
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
 * @docsPage Payment Method Types
 */
export interface CreatePaymentResult {
    amount: number;
    state: Exclude<PaymentState, 'Refunded' | 'Error'>;
    transactionId?: string;
    errorMessage?: string;
    metadata?: PaymentMetadata;
}

/**
 * @description
 * This object is the return value of the {@link CreatePaymentFn} when there has been an error.
 *
 * @docsCategory payment
 * @docsPage Payment Method Types
 */
export interface CreatePaymentErrorResult {
    amount: number;
    state: 'Error';
    transactionId?: string;
    errorMessage: string;
    metadata?: PaymentMetadata;
}

/**
 * @description
 * This object is the return value of the {@link CreateRefundFn}.
 *
 * @docsCategory payment
 * @docsPage Payment Method Types
 */
export interface CreateRefundResult {
    state: RefundState;
    transactionId?: string;
    metadata?: PaymentMetadata;
}

/**
 * @description
 * This object is the return value of the {@link SettlePaymentFn}
 *
 * @docsCategory payment
 * @docsPage Payment Method Types
 */
export interface SettlePaymentResult {
    success: boolean;
    errorMessage?: string;
    metadata?: PaymentMetadata;
}

/**
 * @description
 * This function contains the logic for creating a payment. See {@link PaymentMethodHandler} for an example.
 *
 * @docsCategory payment
 * @docsPage Payment Method Types
 */
export type CreatePaymentFn<T extends PaymentMethodArgs> = (
    order: Order,
    args: ConfigArgValues<T>,
    metadata: PaymentMetadata,
) => CreatePaymentResult | CreatePaymentErrorResult | Promise<CreatePaymentResult | CreatePaymentErrorResult>;

/**
 * @description
 * This function contains the logic for settling a payment. See {@link PaymentMethodHandler} for an example.
 *
 * @docsCategory payment
 * @docsPage Payment Method Types
 */
export type SettlePaymentFn<T extends PaymentMethodArgs> = (
    order: Order,
    payment: Payment,
    args: ConfigArgValues<T>,
) => SettlePaymentResult | Promise<SettlePaymentResult>;

/**
 * @description
 * This function contains the logic for creating a refund. See {@link PaymentMethodHandler} for an example.
 *
 * @docsCategory payment
 * @docsPage Payment Method Types
 */
export type CreateRefundFn<T extends PaymentMethodArgs> = (
    input: RefundOrderInput,
    total: number,
    order: Order,
    payment: Payment,
    args: ConfigArgValues<T>,
) => CreateRefundResult | Promise<CreateRefundResult>;

/**
 * @description
 * Defines the object which is used to construct the {@link PaymentMethodHandler}.
 *
 * @docsCategory payment
 */
export interface PaymentMethodConfigOptions<T extends PaymentMethodArgs = PaymentMethodArgs>
    extends ConfigurableOperationDefOptions<T> {
    /**
     * @description
     * This function provides the logic for creating a payment. For example,
     * it may call out to a third-party service with the data and should return a
     * {@link CreatePaymentResult} object contains the details of the payment.
     */
    createPayment: CreatePaymentFn<T>;
    /**
     * @description
     * This function provides the logic for settling a payment, also known as "capturing".
     * For payment integrations that settle/capture the payment on creation (i.e. the
     * `createPayment()` method returns with a state of `'Settled'`) this method
     * need only return `{ success: true }`.
     */
    settlePayment: SettlePaymentFn<T>;
    /**
     * @description
     * This function provides the logic for refunding a payment created with this
     * payment method. Some payment providers may not provide the facility to
     * programmatically create a refund. In such a case, this method should be
     * omitted and any Refunds will have to be settled manually by an administrator.
     */
    createRefund?: CreateRefundFn<T>;
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
 *     description: [{
 *         languageCode: LanguageCode.en,
 *         value: 'Example Payment Provider',
 *     }],
 *     args: {
 *         apiKey: { type: 'string' },
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
 *     settlePayment: async (order, payment, args): Promise<SettlePaymentResult> {
 *         return { success: true };
 *     }
 * });
 * ```
 *
 * @docsCategory payment
 */
export class PaymentMethodHandler<
    T extends PaymentMethodArgs = PaymentMethodArgs
> extends ConfigurableOperationDef<T> {
    private readonly createPaymentFn: CreatePaymentFn<T>;
    private readonly settlePaymentFn: SettlePaymentFn<T>;
    private readonly createRefundFn?: CreateRefundFn<T>;
    private readonly onTransitionStartFn?: OnTransitionStartFn<T>;

    constructor(config: PaymentMethodConfigOptions<T>) {
        super(config);
        this.createPaymentFn = config.createPayment;
        this.settlePaymentFn = config.settlePayment;
        this.settlePaymentFn = config.settlePayment;
        this.createRefundFn = config.createRefund;
        this.onTransitionStartFn = config.onStateTransitionStart;
    }

    /**
     * @description
     * Called internally to create a new Payment
     *
     * @internal
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
     * Called internally to settle a payment
     *
     * @internal
     */
    async settlePayment(order: Order, payment: Payment, args: ConfigArg[]) {
        return this.settlePaymentFn(order, payment, argsArrayToHash(args));
    }

    /**
     * @description
     * Called internally to create a refund
     *
     * @internal
     */
    async createRefund(
        input: RefundOrderInput,
        total: number,
        order: Order,
        payment: Payment,
        args: ConfigArg[],
    ) {
        return this.createRefundFn
            ? this.createRefundFn(input, total, order, payment, argsArrayToHash(args))
            : false;
    }

    /**
     * @description
     * This function is called before the state of a Payment is transitioned. If the PaymentMethodHandler
     * was instantiated with a `onStateTransitionStart` function, that function will be invoked and its
     * return value used to determine whether the transition can occur.
     *
     * @internal
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
