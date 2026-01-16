---
title: "Promotion Condition"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## PromotionCondition

<GenerationInfo sourceFile="packages/core/src/config/promotion/promotion-condition.ts" sourceLine="66" packageName="@vendure/core" />

PromotionConditions are used to create <a href='/reference/typescript-api/entities/promotion#promotion'>Promotion</a>s. The purpose of a PromotionCondition
is to check the order against a particular predicate function (the `check` function) and to return
`true` if the Order satisfies the condition, or `false` if it does not.

```ts title="Signature"
class PromotionCondition<T extends ConfigArgs = ConfigArgs, C extends string = string, R extends CheckPromotionConditionResult = any> extends ConfigurableOperationDef<T> {
    readonly priorityValue: number;
    code: C
    constructor(config: PromotionConditionConfig<T, C, R>)
    check(ctx: RequestContext, order: Order, args: ConfigArg[], promotion: Promotion) => Promise<R>;
}
```
* Extends: <code><a href='/reference/typescript-api/configurable-operation-def/#configurableoperationdef'>ConfigurableOperationDef</a>&#60;T&#62;</code>



<div className="members-wrapper">

### priorityValue

<MemberInfo kind="property" type={`number`} default={`0`}   />

Used to determine the order of application of multiple Promotions
on the same Order. See the <a href='/reference/typescript-api/entities/promotion#promotion'>Promotion</a> `priorityScore` field for
more information.
### code

<MemberInfo kind="property" type={`C`}   />


### constructor

<MemberInfo kind="method" type={`(config: <a href='/reference/typescript-api/promotions/promotion-condition#promotionconditionconfig'>PromotionConditionConfig</a>&#60;T, C, R&#62;) => PromotionCondition`}   />


### check

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, order: <a href='/reference/typescript-api/entities/order#order'>Order</a>, args: ConfigArg[], promotion: <a href='/reference/typescript-api/entities/promotion#promotion'>Promotion</a>) => Promise&#60;R&#62;`}   />

This is the function which contains the conditional logic to decide whether
a Promotion should apply to an Order. See <a href='/reference/typescript-api/promotions/promotion-condition#checkpromotionconditionfn'>CheckPromotionConditionFn</a>.


</div>


## PromotionConditionConfig

<GenerationInfo sourceFile="packages/core/src/config/promotion/promotion-condition.ts" sourceLine="46" packageName="@vendure/core" />

This object is used to configure a PromotionCondition.

```ts title="Signature"
interface PromotionConditionConfig<T extends ConfigArgs, C extends string, R extends CheckPromotionConditionResult> extends ConfigurableOperationDefOptions<T> {
    code: C;
    check: CheckPromotionConditionFn<T, R>;
    priorityValue?: number;
}
```
* Extends: <code><a href='/reference/typescript-api/configurable-operation-def/configurable-operation-def-options#configurableoperationdefoptions'>ConfigurableOperationDefOptions</a>&#60;T&#62;</code>



<div className="members-wrapper">

### code

<MemberInfo kind="property" type={`C`}   />


### check

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/promotions/promotion-condition#checkpromotionconditionfn'>CheckPromotionConditionFn</a>&#60;T, R&#62;`}   />


### priorityValue

<MemberInfo kind="property" type={`number`}   />




</div>


## CheckPromotionConditionFn

<GenerationInfo sourceFile="packages/core/src/config/promotion/promotion-condition.ts" sourceLine="31" packageName="@vendure/core" />

A function which checks whether or not a given <a href='/reference/typescript-api/entities/order#order'>Order</a> satisfies the <a href='/reference/typescript-api/promotions/promotion-condition#promotioncondition'>PromotionCondition</a>.

The function should return either a `boolean` or and plain object type:

* `false`: The condition is not satisfied - do not apply PromotionActions
* `true`: The condition is satisfied, apply PromotionActions
* `{ [key: string]: any; }`: The condition is satisfied, apply PromotionActions
_and_ pass this object into the PromotionAction's `state` argument.

```ts title="Signature"
type CheckPromotionConditionFn<T extends ConfigArgs, R extends CheckPromotionConditionResult> = (
    ctx: RequestContext,
    order: Order,
    args: ConfigArgValues<T>,
    promotion: Promotion,
) => R | Promise<R>
```
