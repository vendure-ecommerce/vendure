---
title: "PaymentService"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## PaymentService

<GenerationInfo sourceFile="packages/core/src/service/services/payment.service.ts" sourceLine="43" packageName="@vendure/core" />

Contains methods relating to <a href='/reference/typescript-api/entities/payment#payment'>Payment</a> entities.

```ts title="Signature"
class PaymentService {
    constructor(connection: TransactionalConnection, paymentStateMachine: PaymentStateMachine, refundStateMachine: RefundStateMachine, paymentMethodService: PaymentMethodService, eventBus: EventBus)
    create(ctx: RequestContext, input: DeepPartial<Payment>) => Promise<Payment>;
    findOneOrThrow(ctx: RequestContext, id: ID, relations: string[] = ['order']) => Promise<Payment>;
    transitionToState(ctx: RequestContext, paymentId: ID, state: PaymentState) => Promise<Payment | PaymentStateTransitionError>;
    getNextStates(payment: Payment) => readonly PaymentState[];
    createPayment(ctx: RequestContext, order: Order, amount: number, method: string, metadata: any) => Promise<Payment | IneligiblePaymentMethodError>;
    settlePayment(ctx: RequestContext, paymentId: ID) => Promise<PaymentStateTransitionError | Payment>;
    cancelPayment(ctx: RequestContext, paymentId: ID) => Promise<PaymentStateTransitionError | Payment>;
    createManualPayment(ctx: RequestContext, order: Order, amount: number, input: ManualPaymentInput) => ;
    createRefund(ctx: RequestContext, input: RefundOrderInput, order: Order, selectedPayment: Payment) => Promise<Refund | RefundStateTransitionError | RefundAmountError>;
}
```

<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(connection: <a href='/reference/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>, paymentStateMachine: PaymentStateMachine, refundStateMachine: RefundStateMachine, paymentMethodService: <a href='/reference/typescript-api/services/payment-method-service#paymentmethodservice'>PaymentMethodService</a>, eventBus: <a href='/reference/typescript-api/events/event-bus#eventbus'>EventBus</a>) => PaymentService`}   />


### create

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: DeepPartial&#60;<a href='/reference/typescript-api/entities/payment#payment'>Payment</a>&#62;) => Promise&#60;<a href='/reference/typescript-api/entities/payment#payment'>Payment</a>&#62;`}   />


### findOneOrThrow

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, id: <a href='/reference/typescript-api/common/id#id'>ID</a>, relations: string[] = ['order']) => Promise&#60;<a href='/reference/typescript-api/entities/payment#payment'>Payment</a>&#62;`}   />


### transitionToState

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, paymentId: <a href='/reference/typescript-api/common/id#id'>ID</a>, state: <a href='/reference/typescript-api/payment/payment-state#paymentstate'>PaymentState</a>) => Promise&#60;<a href='/reference/typescript-api/entities/payment#payment'>Payment</a> | PaymentStateTransitionError&#62;`}   />

Transitions a Payment to the given state.

When updating a Payment in the context of an Order, it is
preferable to use the <a href='/reference/typescript-api/services/order-service#orderservice'>OrderService</a> `transitionPaymentToState()` method, which will also handle
updating the Order state too.
### getNextStates

<MemberInfo kind="method" type={`(payment: <a href='/reference/typescript-api/entities/payment#payment'>Payment</a>) => readonly <a href='/reference/typescript-api/payment/payment-state#paymentstate'>PaymentState</a>[]`}   />


### createPayment

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, order: <a href='/reference/typescript-api/entities/order#order'>Order</a>, amount: number, method: string, metadata: any) => Promise&#60;<a href='/reference/typescript-api/entities/payment#payment'>Payment</a> | IneligiblePaymentMethodError&#62;`}   />

Creates a new Payment.

When creating a Payment in the context of an Order, it is
preferable to use the <a href='/reference/typescript-api/services/order-service#orderservice'>OrderService</a> `addPaymentToOrder()` method, which will also handle
updating the Order state too.
### settlePayment

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, paymentId: <a href='/reference/typescript-api/common/id#id'>ID</a>) => Promise&#60;PaymentStateTransitionError | <a href='/reference/typescript-api/entities/payment#payment'>Payment</a>&#62;`}   />

Settles a Payment.

When settling a Payment in the context of an Order, it is
preferable to use the <a href='/reference/typescript-api/services/order-service#orderservice'>OrderService</a> `settlePayment()` method, which will also handle
updating the Order state too.
### cancelPayment

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, paymentId: <a href='/reference/typescript-api/common/id#id'>ID</a>) => Promise&#60;PaymentStateTransitionError | <a href='/reference/typescript-api/entities/payment#payment'>Payment</a>&#62;`}   />


### createManualPayment

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, order: <a href='/reference/typescript-api/entities/order#order'>Order</a>, amount: number, input: ManualPaymentInput) => `}   />

Creates a Payment from the manual payment mutation in the Admin API

When creating a manual Payment in the context of an Order, it is
preferable to use the <a href='/reference/typescript-api/services/order-service#orderservice'>OrderService</a> `addManualPaymentToOrder()` method, which will also handle
updating the Order state too.
### createRefund

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: RefundOrderInput, order: <a href='/reference/typescript-api/entities/order#order'>Order</a>, selectedPayment: <a href='/reference/typescript-api/entities/payment#payment'>Payment</a>) => Promise&#60;<a href='/reference/typescript-api/entities/refund#refund'>Refund</a> | RefundStateTransitionError | RefundAmountError&#62;`}   />

Creates a Refund against the specified Payment. If the amount to be refunded exceeds the value of the
specified Payment (in the case of multiple payments on a single Order), then the remaining outstanding
refund amount will be refunded against the next available Payment from the Order.

When creating a Refund in the context of an Order, it is
preferable to use the <a href='/reference/typescript-api/services/order-service#orderservice'>OrderService</a> `refundOrder()` method, which performs additional
validation.


</div>
