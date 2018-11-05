import { ConfigArg } from 'shared/generated-types';

import { StateMachineConfig } from '../../common/finite-state-machine';
import { Order } from '../../entity/order/order.entity';
import { PaymentMetadata } from '../../entity/payment/payment.entity';
import {
    PaymentState,
    PaymentTransitionData,
} from '../../service/helpers/payment-state-machine/payment-state';
import { argsArrayToHash, ConfigArgs, ConfigArgValues } from '../common/config-args';

export type PaymentMethodArgType = 'int' | 'string' | 'boolean';
export type PaymentMethodArgs = ConfigArgs<PaymentMethodArgType>;
export type OnTransitionStartReturnType = ReturnType<Required<StateMachineConfig<any>>['onTransitionStart']>;

export type OnTransitionStartFn<T extends PaymentMethodArgs> = (
    fromState: PaymentState,
    toState: PaymentState,
    args: ConfigArgValues<T>,
    data: PaymentTransitionData,
) => OnTransitionStartReturnType;

export interface PaymentConfig {
    amount: number;
    state: PaymentState;
    transactionId?: string;
    metadata?: PaymentMetadata;
}

export type CreatePaymentFn<T extends PaymentMethodArgs> = (
    order: Order,
    args: ConfigArgValues<T>,
    metadata: PaymentMetadata,
) => PaymentConfig | Promise<PaymentConfig>;

export interface PaymentMethodConfigOptions<T extends PaymentMethodArgs = {}> {
    code: string;
    name: string;
    createPayment: CreatePaymentFn<T>;
    args: T;
    onStateTransitionStart?: OnTransitionStartFn<T>;
}

/**
 * A PaymentMethodHandler contains the code which is used to generate a Payment when a call to the
 * `addPaymentToOrder` mutation is made. If contains any necessary steps of interfacing with a
 * third-party payment gateway before the Payment is created and can also define actions to fire
 * when the state of the payment is changed.
 */
export class PaymentMethodHandler<T extends PaymentMethodArgs = {}> {
    readonly code: string;
    readonly name: string;
    readonly args: T;
    private readonly createPaymentFn: CreatePaymentFn<T>;
    private readonly onTransitionStartFn?: OnTransitionStartFn<T>;

    constructor(config: PaymentMethodConfigOptions<T>) {
        this.code = config.code;
        this.name = config.name;
        this.args = config.args;
        this.createPaymentFn = config.createPayment;
        this.onTransitionStartFn = config.onStateTransitionStart;
    }

    async createPayment(order: Order, args: ConfigArg[], metadata: PaymentMetadata) {
        const paymentConfig = await this.createPaymentFn(order, argsArrayToHash(args), metadata);
        return {
            method: this.code,
            ...paymentConfig,
        };
    }

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
