---
title: "Promotion Condition"
weight: 10
date: 2023-07-14T16:57:49.678Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# promotion-condition
<div class="symbol">


# PromotionCondition

{{< generation-info sourceFile="packages/core/src/config/promotion/promotion-condition.ts" sourceLine="66" packageName="@vendure/core">}}

PromotionConditions are used to create <a href='/typescript-api/entities/promotion#promotion'>Promotion</a>s. The purpose of a PromotionCondition
is to check the order against a particular predicate function (the `check` function) and to return
`true` if the Order satisfies the condition, or `false` if it does not.

## Signature

```TypeScript
class PromotionCondition<T extends ConfigArgs = ConfigArgs, C extends string = string, R extends CheckPromotionConditionResult = any> extends ConfigurableOperationDef<T> {
  readonly readonly priorityValue: number;
  code: C
  constructor(config: PromotionConditionConfig<T, C, R>)
  async check(ctx: RequestContext, order: Order, args: ConfigArg[], promotion: Promotion) => Promise<R>;
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

### code

{{< member-info kind="property" type="C"  >}}

{{< member-description >}}{{< /member-description >}}

### constructor

{{< member-info kind="method" type="(config: <a href='/typescript-api/promotions/promotion-condition#promotionconditionconfig'>PromotionConditionConfig</a>&#60;T, C, R&#62;) => PromotionCondition"  >}}

{{< member-description >}}{{< /member-description >}}

### check

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, order: <a href='/typescript-api/entities/order#order'>Order</a>, args: ConfigArg[], promotion: <a href='/typescript-api/entities/promotion#promotion'>Promotion</a>) => Promise&#60;R&#62;"  >}}

{{< member-description >}}This is the function which contains the conditional logic to decide whether
a Promotion should apply to an Order. See <a href='/typescript-api/promotions/promotion-condition#checkpromotionconditionfn'>CheckPromotionConditionFn</a>.{{< /member-description >}}


</div>
<div class="symbol">


# PromotionConditionConfig

{{< generation-info sourceFile="packages/core/src/config/promotion/promotion-condition.ts" sourceLine="46" packageName="@vendure/core">}}

This object is used to configure a PromotionCondition.

## Signature

```TypeScript
interface PromotionConditionConfig<T extends ConfigArgs, C extends string, R extends CheckPromotionConditionResult> extends ConfigurableOperationDefOptions<T> {
  code: C;
  check: CheckPromotionConditionFn<T, R>;
  priorityValue?: number;
}
```
## Extends

 * <a href='/typescript-api/configurable-operation-def/configurable-operation-def-options#configurableoperationdefoptions'>ConfigurableOperationDefOptions</a>&#60;T&#62;


## Members

### code

{{< member-info kind="property" type="C"  >}}

{{< member-description >}}{{< /member-description >}}

### check

{{< member-info kind="property" type="<a href='/typescript-api/promotions/promotion-condition#checkpromotionconditionfn'>CheckPromotionConditionFn</a>&#60;T, R&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### priorityValue

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# CheckPromotionConditionFn

{{< generation-info sourceFile="packages/core/src/config/promotion/promotion-condition.ts" sourceLine="31" packageName="@vendure/core">}}

A function which checks whether or not a given <a href='/typescript-api/entities/order#order'>Order</a> satisfies the <a href='/typescript-api/promotions/promotion-condition#promotioncondition'>PromotionCondition</a>.

The function should return either a `boolean` or and plain object type:

* `false`: The condition is not satisfied - do not apply PromotionActions
* `true`: The condition is satisfied, apply PromotionActions
* `{ [key: string]: any; }`: The condition is satisfied, apply PromotionActions
_and_ pass this object into the PromotionAction's `state` argument.

## Signature

```TypeScript
type CheckPromotionConditionFn<T extends ConfigArgs, R extends CheckPromotionConditionResult> = (
    ctx: RequestContext,
    order: Order,
    args: ConfigArgValues<T>,
    promotion: Promotion,
) => R | Promise<R>
```
</div>
