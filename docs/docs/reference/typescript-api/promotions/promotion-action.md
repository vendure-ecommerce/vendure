---
title: "Promotion Action"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## PromotionAction

<GenerationInfo sourceFile="packages/core/src/config/promotion/promotion-action.ts" sourceLine="247" packageName="@vendure/core" />

An abstract class which is extended by <a href='/reference/typescript-api/promotions/promotion-action#promotionitemaction'>PromotionItemAction</a>, <a href='/reference/typescript-api/promotions/promotion-action#promotionorderaction'>PromotionOrderAction</a>,
and <a href='/reference/typescript-api/promotions/promotion-action#promotionshippingaction'>PromotionShippingAction</a>.

```ts title="Signature"
class PromotionAction<T extends ConfigArgs = ConfigArgs, U extends PromotionCondition[] | undefined = any> extends ConfigurableOperationDef<T> {
    readonly priorityValue: number;
    constructor(config: PromotionActionConfig<T, U>)
}
```
* Extends: <code><a href='/reference/typescript-api/configurable-operation-def/#configurableoperationdef'>ConfigurableOperationDef</a>&#60;T&#62;</code>



<div className="members-wrapper">

### priorityValue

<MemberInfo kind="property" type={`number`} default={`0`}   />

Used to determine the order of application of multiple Promotions
on the same Order. See the <a href='/reference/typescript-api/entities/promotion#promotion'>Promotion</a> `priorityScore` field for
more information.
### constructor

<MemberInfo kind="method" type={`(config: <a href='/reference/typescript-api/promotions/promotion-action#promotionactionconfig'>PromotionActionConfig</a>&#60;T, U&#62;) => PromotionAction`}   />




</div>


## PromotionItemAction

<GenerationInfo sourceFile="packages/core/src/config/promotion/promotion-action.ts" sourceLine="320" packageName="@vendure/core" />

Represents a PromotionAction which applies to individual <a href='/reference/typescript-api/entities/order-line#orderline'>OrderLine</a>s.

*Example*

```ts
// Applies a percentage discount to each OrderLine
const itemPercentageDiscount = new PromotionItemAction({
    code: 'item_percentage_discount',
    args: { discount: 'percentage' },
    execute(ctx, orderLine, args) {
        return -orderLine.unitPrice * (args.discount / 100);
    },
    description: 'Discount every item by { discount }%',
});
```

```ts title="Signature"
class PromotionItemAction<T extends ConfigArgs = ConfigArgs, U extends Array<PromotionCondition<any>> = []> extends PromotionAction<T, U> {
    constructor(config: PromotionItemActionConfig<T, U>)
}
```
* Extends: <code><a href='/reference/typescript-api/promotions/promotion-action#promotionaction'>PromotionAction</a>&#60;T, U&#62;</code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(config: <a href='/reference/typescript-api/promotions/promotion-action#promotionitemactionconfig'>PromotionItemActionConfig</a>&#60;T, U&#62;) => PromotionItemAction`}   />




</div>


## PromotionOrderAction

<GenerationInfo sourceFile="packages/core/src/config/promotion/promotion-action.ts" sourceLine="375" packageName="@vendure/core" />

Represents a PromotionAction which applies to the <a href='/reference/typescript-api/entities/order#order'>Order</a> as a whole.

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

```ts title="Signature"
class PromotionOrderAction<T extends ConfigArgs = ConfigArgs, U extends PromotionCondition[] = []> extends PromotionAction<T, U> {
    constructor(config: PromotionOrderActionConfig<T, U>)
}
```
* Extends: <code><a href='/reference/typescript-api/promotions/promotion-action#promotionaction'>PromotionAction</a>&#60;T, U&#62;</code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(config: <a href='/reference/typescript-api/promotions/promotion-action#promotionorderactionconfig'>PromotionOrderActionConfig</a>&#60;T, U&#62;) => PromotionOrderAction`}   />




</div>


## PromotionShippingAction

<GenerationInfo sourceFile="packages/core/src/config/promotion/promotion-action.ts" sourceLine="417" packageName="@vendure/core" />

Represents a PromotionAction which applies to the shipping cost of an Order.

```ts title="Signature"
class PromotionShippingAction<T extends ConfigArgs = ConfigArgs, U extends PromotionCondition[] = []> extends PromotionAction<T, U> {
    constructor(config: PromotionShippingActionConfig<T, U>)
}
```
* Extends: <code><a href='/reference/typescript-api/promotions/promotion-action#promotionaction'>PromotionAction</a>&#60;T, U&#62;</code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(config: <a href='/reference/typescript-api/promotions/promotion-action#promotionshippingactionconfig'>PromotionShippingActionConfig</a>&#60;T, U&#62;) => PromotionShippingAction`}   />




</div>


## ExecutePromotionItemActionFn

<GenerationInfo sourceFile="packages/core/src/config/promotion/promotion-action.ts" sourceLine="72" packageName="@vendure/core" />

The function which is used by a PromotionItemAction to calculate the
discount on the OrderLine.

```ts title="Signature"
type ExecutePromotionItemActionFn<T extends ConfigArgs, U extends Array<PromotionCondition<any>>> = (
    ctx: RequestContext,
    orderLine: OrderLine,
    args: ConfigArgValues<T>,
    state: ConditionState<U>,
    promotion: Promotion,
) => number | Promise<number>
```


## ExecutePromotionOrderActionFn

<GenerationInfo sourceFile="packages/core/src/config/promotion/promotion-action.ts" sourceLine="88" packageName="@vendure/core" />

The function which is used by a PromotionOrderAction to calculate the
discount on the Order.

```ts title="Signature"
type ExecutePromotionOrderActionFn<T extends ConfigArgs, U extends Array<PromotionCondition<any>>> = (
    ctx: RequestContext,
    order: Order,
    args: ConfigArgValues<T>,
    state: ConditionState<U>,
    promotion: Promotion,
) => number | Promise<number>
```


## ExecutePromotionShippingActionFn

<GenerationInfo sourceFile="packages/core/src/config/promotion/promotion-action.ts" sourceLine="104" packageName="@vendure/core" />

The function which is used by a PromotionOrderAction to calculate the
discount on the Order.

```ts title="Signature"
type ExecutePromotionShippingActionFn<T extends ConfigArgs, U extends Array<PromotionCondition<any>>> = (
    ctx: RequestContext,
    shippingLine: ShippingLine,
    order: Order,
    args: ConfigArgValues<T>,
    state: ConditionState<U>,
    promotion: Promotion,
) => number | Promise<number>
```


## PromotionActionSideEffectFn

<GenerationInfo sourceFile="packages/core/src/config/promotion/promotion-action.ts" sourceLine="125" packageName="@vendure/core" since="1.8.0" experimental="true" />

The signature of a PromotionAction's side-effect functions `onActivate` and `onDeactivate`.

```ts title="Signature"
type PromotionActionSideEffectFn<T extends ConfigArgs> = (
    ctx: RequestContext,
    order: Order,
    args: ConfigArgValues<T>,
    promotion: Promotion,
) => void | Promise<void>
```


## PromotionActionConfig

<GenerationInfo sourceFile="packages/core/src/config/promotion/promotion-action.ts" sourceLine="139" packageName="@vendure/core" />

Configuration for all types of <a href='/reference/typescript-api/promotions/promotion-action#promotionaction'>PromotionAction</a>.

```ts title="Signature"
interface PromotionActionConfig<T extends ConfigArgs, U extends Array<PromotionCondition<any>> | undefined> extends ConfigurableOperationDefOptions<T> {
    priorityValue?: number;
    conditions?: U extends undefined ? undefined : ConditionTuple<Exclude<U, undefined>>;
    onActivate?: PromotionActionSideEffectFn<T>;
    onDeactivate?: PromotionActionSideEffectFn<T>;
}
```
* Extends: <code><a href='/reference/typescript-api/configurable-operation-def/configurable-operation-def-options#configurableoperationdefoptions'>ConfigurableOperationDefOptions</a>&#60;T&#62;</code>



<div className="members-wrapper">

### priorityValue

<MemberInfo kind="property" type={`number`} default={`0`}   />

Used to determine the order of application of multiple Promotions
on the same Order. See the <a href='/reference/typescript-api/entities/promotion#promotion'>Promotion</a> `priorityScore` field for
more information.
### conditions

<MemberInfo kind="property" type={`U extends undefined ? undefined : ConditionTuple&#60;Exclude&#60;U, undefined&#62;&#62;`}   />

Allows PromotionActions to define one or more PromotionConditions as dependencies. Having a PromotionCondition
as a dependency has the following consequences:
1. A Promotion using this PromotionAction is only valid if it also contains all PromotionConditions
on which it depends.
2. The `execute()` function will receive a statically-typed `state` argument which will contain
the return values of the PromotionConditions' `check()` function.
### onActivate

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/promotions/promotion-action#promotionactionsideeffectfn'>PromotionActionSideEffectFn</a>&#60;T&#62;`}  since="1.8.0" experimental="true" />

An optional side effect function which is invoked when the promotion
becomes active. It can be used for things like adding a free gift to the order
or other side effects that are unrelated to price calculations.

If used, make sure to use the corresponding `onDeactivate` function to clean up
or reverse any side effects as needed.
### onDeactivate

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/promotions/promotion-action#promotionactionsideeffectfn'>PromotionActionSideEffectFn</a>&#60;T&#62;`}  since="1.8.0" experimental="true" />

Used to reverse or clean up any side effects executed as part of the `onActivate` function.


</div>


## PromotionItemActionConfig

<GenerationInfo sourceFile="packages/core/src/config/promotion/promotion-action.ts" sourceLine="193" packageName="@vendure/core" />

Configuration for a <a href='/reference/typescript-api/promotions/promotion-action#promotionitemaction'>PromotionItemAction</a>

```ts title="Signature"
interface PromotionItemActionConfig<T extends ConfigArgs, U extends PromotionCondition[]> extends PromotionActionConfig<T, U> {
    execute: ExecutePromotionItemActionFn<T, U>;
}
```
* Extends: <code><a href='/reference/typescript-api/promotions/promotion-action#promotionactionconfig'>PromotionActionConfig</a>&#60;T, U&#62;</code>



<div className="members-wrapper">

### execute

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/promotions/promotion-action#executepromotionitemactionfn'>ExecutePromotionItemActionFn</a>&#60;T, U&#62;`}   />

The function which contains the promotion calculation logic.
Should resolve to a number which represents the amount by which to discount
the OrderLine, i.e. the number should be negative.


</div>


## PromotionOrderActionConfig

<GenerationInfo sourceFile="packages/core/src/config/promotion/promotion-action.ts" sourceLine="210" packageName="@vendure/core" />



```ts title="Signature"
interface PromotionOrderActionConfig<T extends ConfigArgs, U extends PromotionCondition[]> extends PromotionActionConfig<T, U> {
    execute: ExecutePromotionOrderActionFn<T, U>;
}
```
* Extends: <code><a href='/reference/typescript-api/promotions/promotion-action#promotionactionconfig'>PromotionActionConfig</a>&#60;T, U&#62;</code>



<div className="members-wrapper">

### execute

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/promotions/promotion-action#executepromotionorderactionfn'>ExecutePromotionOrderActionFn</a>&#60;T, U&#62;`}   />

The function which contains the promotion calculation logic.
Should resolve to a number which represents the amount by which to discount
the Order, i.e. the number should be negative.


</div>


## PromotionShippingActionConfig

<GenerationInfo sourceFile="packages/core/src/config/promotion/promotion-action.ts" sourceLine="227" packageName="@vendure/core" />



```ts title="Signature"
interface PromotionShippingActionConfig<T extends ConfigArgs, U extends PromotionCondition[]> extends PromotionActionConfig<T, U> {
    execute: ExecutePromotionShippingActionFn<T, U>;
}
```
* Extends: <code><a href='/reference/typescript-api/promotions/promotion-action#promotionactionconfig'>PromotionActionConfig</a>&#60;T, U&#62;</code>



<div className="members-wrapper">

### execute

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/promotions/promotion-action#executepromotionshippingactionfn'>ExecutePromotionShippingActionFn</a>&#60;T, U&#62;`}   />

The function which contains the promotion calculation logic.
Should resolve to a number which represents the amount by which to discount
the Shipping, i.e. the number should be negative.


</div>
