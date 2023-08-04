---
title: "PaymentService"
weight: 10
date: 2023-07-14T16:57:50.477Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# PaymentService
<div class="symbol">


# PaymentService

{{< generation-info sourceFile="packages/core/src/service/services/payment.service.ts" sourceLine="42" packageName="@vendure/core">}}

Contains methods relating to <a href='/typescript-api/entities/payment#payment'>Payment</a> entities.

## Signature

```TypeScript
class PaymentService {
  constructor(connection: TransactionalConnection, paymentStateMachine: PaymentStateMachine, refundStateMachine: RefundStateMachine, paymentMethodService: PaymentMethodService, eventBus: EventBus)
  async create(ctx: RequestContext, input: DeepPartial<Payment>) => Promise<Payment>;
  async findOneOrThrow(ctx: RequestContext, id: ID, relations: string[] = ['order']) => Promise<Payment>;
  async transitionToState(ctx: RequestContext, paymentId: ID, state: PaymentState) => Promise<Payment | PaymentStateTransitionError>;
  getNextStates(payment: Payment) => readonly PaymentState[];
  async createPayment(ctx: RequestContext, order: Order, amount: number, method: string, metadata: any) => Promise<Payment | IneligiblePaymentMethodError>;
  async settlePayment(ctx: RequestContext, paymentId: ID) => Promise<PaymentStateTransitionError | Payment>;
  async cancelPayment(ctx: RequestContext, paymentId: ID) => Promise<PaymentStateTransitionError | Payment>;
  async createManualPayment(ctx: RequestContext, order: Order, amount: number, input: ManualPaymentInput) => ;
  async createRefund(ctx: RequestContext, input: RefundOrderInput, order: Order, selectedPayment: Payment) => Promise<Refund | RefundStateTransitionError>;
}
```
## Members

### constructor

{{< member-info kind="method" type="(connection: <a href='/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>, paymentStateMachine: PaymentStateMachine, refundStateMachine: RefundStateMachine, paymentMethodService: <a href='/typescript-api/services/payment-method-service#paymentmethodservice'>PaymentMethodService</a>, eventBus: <a href='/typescript-api/events/event-bus#eventbus'>EventBus</a>) => PaymentService"  >}}

{{< member-description >}}{{< /member-description >}}

### create

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: DeepPartial&#60;<a href='/typescript-api/entities/payment#payment'>Payment</a>&#62;) => Promise&#60;<a href='/typescript-api/entities/payment#payment'>Payment</a>&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### findOneOrThrow

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, id: <a href='/typescript-api/common/id#id'>ID</a>, relations: string[] = ['order']) => Promise&#60;<a href='/typescript-api/entities/payment#payment'>Payment</a>&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### transitionToState

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, paymentId: <a href='/typescript-api/common/id#id'>ID</a>, state: <a href='/typescript-api/payment/payment-state#paymentstate'>PaymentState</a>) => Promise&#60;<a href='/typescript-api/entities/payment#payment'>Payment</a> | PaymentStateTransitionError&#62;"  >}}

{{< member-description >}}Transitions a Payment to the given state.

When updating a Payment in the context of an Order, it is
preferable to use the <a href='/typescript-api/services/order-service#orderservice'>OrderService</a> `transitionPaymentToState()` method, which will also handle
updating the Order state too.{{< /member-description >}}

### getNextStates

{{< member-info kind="method" type="(payment: <a href='/typescript-api/entities/payment#payment'>Payment</a>) => readonly <a href='/typescript-api/payment/payment-state#paymentstate'>PaymentState</a>[]"  >}}

{{< member-description >}}{{< /member-description >}}

### createPayment

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, order: <a href='/typescript-api/entities/order#order'>Order</a>, amount: number, method: string, metadata: any) => Promise&#60;<a href='/typescript-api/entities/payment#payment'>Payment</a> | IneligiblePaymentMethodError&#62;"  >}}

{{< member-description >}}Creates a new Payment.

When creating a Payment in the context of an Order, it is
preferable to use the <a href='/typescript-api/services/order-service#orderservice'>OrderService</a> `addPaymentToOrder()` method, which will also handle
updating the Order state too.{{< /member-description >}}

### settlePayment

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, paymentId: <a href='/typescript-api/common/id#id'>ID</a>) => Promise&#60;PaymentStateTransitionError | <a href='/typescript-api/entities/payment#payment'>Payment</a>&#62;"  >}}

{{< member-description >}}Settles a Payment.

When settling a Payment in the context of an Order, it is
preferable to use the <a href='/typescript-api/services/order-service#orderservice'>OrderService</a> `settlePayment()` method, which will also handle
updating the Order state too.{{< /member-description >}}

### cancelPayment

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, paymentId: <a href='/typescript-api/common/id#id'>ID</a>) => Promise&#60;PaymentStateTransitionError | <a href='/typescript-api/entities/payment#payment'>Payment</a>&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### createManualPayment

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, order: <a href='/typescript-api/entities/order#order'>Order</a>, amount: number, input: ManualPaymentInput) => "  >}}

{{< member-description >}}Creates a Payment from the manual payment mutation in the Admin API

When creating a manual Payment in the context of an Order, it is
preferable to use the <a href='/typescript-api/services/order-service#orderservice'>OrderService</a> `addManualPaymentToOrder()` method, which will also handle
updating the Order state too.{{< /member-description >}}

### createRefund

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: RefundOrderInput, order: <a href='/typescript-api/entities/order#order'>Order</a>, selectedPayment: <a href='/typescript-api/entities/payment#payment'>Payment</a>) => Promise&#60;Refund | RefundStateTransitionError&#62;"  >}}

{{< member-description >}}Creates a Refund against the specified Payment. If the amount to be refunded exceeds the value of the
specified Payment (in the case of multiple payments on a single Order), then the remaining outstanding
refund amount will be refunded against the next available Payment from the Order.

When creating a Refund in the context of an Order, it is
preferable to use the <a href='/typescript-api/services/order-service#orderservice'>OrderService</a> `refundOrder()` method, which performs additional
validation.{{< /member-description >}}


</div>
