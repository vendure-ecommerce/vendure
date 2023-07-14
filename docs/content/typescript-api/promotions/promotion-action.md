---
title: "Promotion Action"
weight: 10
date: 2023-07-14T16:57:49.669Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# promotion-action
<div class="symbol">


# PromotionAction

{{< generation-info sourceFile="packages/core/src/config/promotion/promotion-action.ts" sourceLine="247" packageName="@vendure/core">}}

An abstract class which is extended by <a href='/typescript-api/promotions/promotion-action#promotionitemaction'>PromotionItemAction</a>, <a href='/typescript-api/promotions/promotion-action#promotionorderaction'>PromotionOrderAction</a>,
and <a href='/typescript-api/promotions/promotion-action#promotionshippingaction'>PromotionShippingAction</a>.

## Signature

```TypeScript
class PromotionAction<T extends ConfigArgs = ConfigArgs, U extends PromotionCondition[] | undefined = any> extends ConfigurableOperationDef<T> {
  readonly readonly priorityValue: number;
  constructor(config: PromotionActionConfig<T, U>)
}
```
## Extends

 * <a href='/typescript-api/configurable-operation-def/#configurableoperationdef'>ConfigurableOperationDef</a>&#60;T&#62;


## Members

### priorityValue

{{< member-info kind="property" type="number" default="0"  >}}

{{< member-description >}}Used to determine the order of application of multiple Promotions
on the same Order. See the <a href='/typescript-api/entities/promotion#promotion'>Promotion</a> `priorityScore` field for
more information.{{< /member-description >}}

### constructor

{{< member-info kind="method" type="(config: <a href='/typescript-api/promotions/promotion-action#promotionactionconfig'>PromotionActionConfig</a>&#60;T, U&#62;) => PromotionAction"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# PromotionItemAction

{{< generation-info sourceFile="packages/core/src/config/promotion/promotion-action.ts" sourceLine="320" packageName="@vendure/core">}}

Represents a PromotionAction which applies to individual <a href='/typescript-api/entities/order-line#orderline'>OrderLine</a>s.

*Example*

```ts
// Applies a percentage discount to each OrderLine
const itemPercentageDiscount = new PromotionItemAction({
    code: 'item_percentage_discount',
    args: { discount: 'percentage' },
    execute(ctx, orderItem, orderLine, args) {
        return -orderLine.unitPrice * (args.discount / 100);
    },
    description: 'Discount every item by { discount }%',
});
```

## Signature

```TypeScript
class PromotionItemAction<T extends ConfigArgs = ConfigArgs, U extends Array<PromotionCondition<any>> = []> extends PromotionAction<T, U> {
  constructor(config: PromotionItemActionConfig<T, U>)
}
```
## Extends

 * <a href='/typescript-api/promotions/promotion-action#promotionaction'>PromotionAction</a>&#60;T, U&#62;


## Members

### constructor

{{< member-info kind="method" type="(config: <a href='/typescript-api/promotions/promotion-action#promotionitemactionconfig'>PromotionItemActionConfig</a>&#60;T, U&#62;) => PromotionItemAction"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# PromotionOrderAction

{{< generation-info sourceFile="packages/core/src/config/promotion/promotion-action.ts" sourceLine="375" packageName="@vendure/core">}}

Represents a PromotionAction which applies to the <a href='/typescript-api/entities/order#order'>Order</a> as a whole.

*Example*

```ts
// Applies a percentage discount to the entire Order
const orderPercentageDiscount = new PromotionOrderAction({
    code: 'order_percentage_discount',
    args: { discount: 'percentage' },
    execute(ctx, order, args) {
        return -order.subTotal * (args.discount / 100);
    },
    description: 'Discount order by { discount }%',
});
```

## Signature

```TypeScript
class PromotionOrderAction<T extends ConfigArgs = ConfigArgs, U extends PromotionCondition[] = []> extends PromotionAction<T, U> {
  constructor(config: PromotionOrderActionConfig<T, U>)
}
```
## Extends

 * <a href='/typescript-api/promotions/promotion-action#promotionaction'>PromotionAction</a>&#60;T, U&#62;


## Members

### constructor

{{< member-info kind="method" type="(config: <a href='/typescript-api/promotions/promotion-action#promotionorderactionconfig'>PromotionOrderActionConfig</a>&#60;T, U&#62;) => PromotionOrderAction"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# PromotionShippingAction

{{< generation-info sourceFile="packages/core/src/config/promotion/promotion-action.ts" sourceLine="417" packageName="@vendure/core">}}

Represents a PromotionAction which applies to the shipping cost of an Order.

## Signature

```TypeScript
class PromotionShippingAction<T extends ConfigArgs = ConfigArgs, U extends PromotionCondition[] = []> extends PromotionAction<T, U> {
  constructor(config: PromotionShippingActionConfig<T, U>)
}
```
## Extends

 * <a href='/typescript-api/promotions/promotion-action#promotionaction'>PromotionAction</a>&#60;T, U&#62;


## Members

### constructor

{{< member-info kind="method" type="(config: <a href='/typescript-api/promotions/promotion-action#promotionshippingactionconfig'>PromotionShippingActionConfig</a>&#60;T, U&#62;) => PromotionShippingAction"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# ExecutePromotionItemActionFn

{{< generation-info sourceFile="packages/core/src/config/promotion/promotion-action.ts" sourceLine="72" packageName="@vendure/core">}}

The function which is used by a PromotionItemAction to calculate the
discount on the OrderLine.

## Signature

```TypeScript
type ExecutePromotionItemActionFn<T extends ConfigArgs, U extends Array<PromotionCondition<any>>> = (
    ctx: RequestContext,
    orderLine: OrderLine,
    args: ConfigArgValues<T>,
    state: ConditionState<U>,
    promotion: Promotion,
) => number | Promise<number>
```
</div>
<div class="symbol">


# ExecutePromotionOrderActionFn

{{< generation-info sourceFile="packages/core/src/config/promotion/promotion-action.ts" sourceLine="88" packageName="@vendure/core">}}

The function which is used by a PromotionOrderAction to calculate the
discount on the Order.

## Signature

```TypeScript
type ExecutePromotionOrderActionFn<T extends ConfigArgs, U extends Array<PromotionCondition<any>>> = (
    ctx: RequestContext,
    order: Order,
    args: ConfigArgValues<T>,
    state: ConditionState<U>,
    promotion: Promotion,
) => number | Promise<number>
```
</div>
<div class="symbol">


# ExecutePromotionShippingActionFn

{{< generation-info sourceFile="packages/core/src/config/promotion/promotion-action.ts" sourceLine="104" packageName="@vendure/core">}}

The function which is used by a PromotionOrderAction to calculate the
discount on the Order.

## Signature

```TypeScript
type ExecutePromotionShippingActionFn<T extends ConfigArgs, U extends Array<PromotionCondition<any>>> = (
    ctx: RequestContext,
    shippingLine: ShippingLine,
    order: Order,
    args: ConfigArgValues<T>,
    state: ConditionState<U>,
    promotion: Promotion,
) => number | Promise<number>
```
</div>
<div class="symbol">


# PromotionActionSideEffectFn

{{< generation-info sourceFile="packages/core/src/config/promotion/promotion-action.ts" sourceLine="125" packageName="@vendure/core" since="1.8.0" experimental="true">}}

The signature of a PromotionAction's side-effect functions `onActivate` and `onDeactivate`.

## Signature

```TypeScript
type PromotionActionSideEffectFn<T extends ConfigArgs> = (
    ctx: RequestContext,
    order: Order,
    args: ConfigArgValues<T>,
    promotion: Promotion,
) => void | Promise<void>
```
</div>
<div class="symbol">


# PromotionActionConfig

{{< generation-info sourceFile="packages/core/src/config/promotion/promotion-action.ts" sourceLine="139" packageName="@vendure/core">}}

Configuration for all types of <a href='/typescript-api/promotions/promotion-action#promotionaction'>PromotionAction</a>.

## Signature

```TypeScript
interface PromotionActionConfig<T extends ConfigArgs, U extends Array<PromotionCondition<any>> | undefined> extends ConfigurableOperationDefOptions<T> {
  priorityValue?: number;
  conditions?: U extends undefined ? undefined : ConditionTuple<Exclude<U, undefined>>;
  onActivate?: PromotionActionSideEffectFn<T>;
  onDeactivate?: PromotionActionSideEffectFn<T>;
}
```
## Extends

 * <a href='/typescript-api/configurable-operation-def/configurable-operation-def-options#configurableoperationdefoptions'>ConfigurableOperationDefOptions</a>&#60;T&#62;


## Members

### priorityValue

{{< member-info kind="property" type="number" default="0"  >}}

{{< member-description >}}Used to determine the order of application of multiple Promotions
on the same Order. See the <a href='/typescript-api/entities/promotion#promotion'>Promotion</a> `priorityScore` field for
more information.{{< /member-description >}}

### conditions

{{< member-info kind="property" type="U extends undefined ? undefined : ConditionTuple&#60;Exclude&#60;U, undefined&#62;&#62;"  >}}

{{< member-description >}}Allows PromotionActions to define one or more PromotionConditions as dependencies. Having a PromotionCondition
as a dependency has the following consequences:
1. A Promotion using this PromotionAction is only valid if it also contains all PromotionConditions
on which it depends.
2. The `execute()` function will receive a statically-typed `state` argument which will contain
the return values of the PromotionConditions' `check()` function.{{< /member-description >}}

### onActivate

{{< member-info kind="property" type="<a href='/typescript-api/promotions/promotion-action#promotionactionsideeffectfn'>PromotionActionSideEffectFn</a>&#60;T&#62;"  since="1.8.0" experimental="true">}}

{{< member-description >}}An optional side effect function which is invoked when the promotion
becomes active. It can be used for things like adding a free gift to the order
or other side effects that are unrelated to price calculations.

If used, make sure to use the corresponding `onDeactivate` function to clean up
or reverse any side effects as needed.{{< /member-description >}}

### onDeactivate

{{< member-info kind="property" type="<a href='/typescript-api/promotions/promotion-action#promotionactionsideeffectfn'>PromotionActionSideEffectFn</a>&#60;T&#62;"  since="1.8.0" experimental="true">}}

{{< member-description >}}Used to reverse or clean up any side effects executed as part of the `onActivate` function.{{< /member-description >}}


</div>
<div class="symbol">


# PromotionItemActionConfig

{{< generation-info sourceFile="packages/core/src/config/promotion/promotion-action.ts" sourceLine="193" packageName="@vendure/core">}}

Configuration for a <a href='/typescript-api/promotions/promotion-action#promotionitemaction'>PromotionItemAction</a>

## Signature

```TypeScript
interface PromotionItemActionConfig<T extends ConfigArgs, U extends PromotionCondition[]> extends PromotionActionConfig<T, U> {
  execute: ExecutePromotionItemActionFn<T, U>;
}
```
## Extends

 * <a href='/typescript-api/promotions/promotion-action#promotionactionconfig'>PromotionActionConfig</a>&#60;T, U&#62;


## Members

### execute

{{< member-info kind="property" type="<a href='/typescript-api/promotions/promotion-action#executepromotionitemactionfn'>ExecutePromotionItemActionFn</a>&#60;T, U&#62;"  >}}

{{< member-description >}}The function which contains the promotion calculation logic.
Should resolve to a number which represents the amount by which to discount
the OrderLine, i.e. the number should be negative.{{< /member-description >}}


</div>
<div class="symbol">


# PromotionOrderActionConfig

{{< generation-info sourceFile="packages/core/src/config/promotion/promotion-action.ts" sourceLine="210" packageName="@vendure/core">}}



## Signature

```TypeScript
interface PromotionOrderActionConfig<T extends ConfigArgs, U extends PromotionCondition[]> extends PromotionActionConfig<T, U> {
  execute: ExecutePromotionOrderActionFn<T, U>;
}
```
## Extends

 * <a href='/typescript-api/promotions/promotion-action#promotionactionconfig'>PromotionActionConfig</a>&#60;T, U&#62;


## Members

### execute

{{< member-info kind="property" type="<a href='/typescript-api/promotions/promotion-action#executepromotionorderactionfn'>ExecutePromotionOrderActionFn</a>&#60;T, U&#62;"  >}}

{{< member-description >}}The function which contains the promotion calculation logic.
Should resolve to a number which represents the amount by which to discount
the Order, i.e. the number should be negative.{{< /member-description >}}


</div>
<div class="symbol">


# PromotionShippingActionConfig

{{< generation-info sourceFile="packages/core/src/config/promotion/promotion-action.ts" sourceLine="227" packageName="@vendure/core">}}



## Signature

```TypeScript
interface PromotionShippingActionConfig<T extends ConfigArgs, U extends PromotionCondition[]> extends PromotionActionConfig<T, U> {
  execute: ExecutePromotionShippingActionFn<T, U>;
}
```
## Extends

 * <a href='/typescript-api/promotions/promotion-action#promotionactionconfig'>PromotionActionConfig</a>&#60;T, U&#62;


## Members

### execute

{{< member-info kind="property" type="<a href='/typescript-api/promotions/promotion-action#executepromotionshippingactionfn'>ExecutePromotionShippingActionFn</a>&#60;T, U&#62;"  >}}

{{< member-description >}}The function which contains the promotion calculation logic.
Should resolve to a number which represents the amount by which to discount
the Shipping, i.e. the number should be negative.{{< /member-description >}}


</div>
