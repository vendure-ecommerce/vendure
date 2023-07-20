---
title: "DefaultActiveOrderStrategy"
weight: 10
date: 2023-07-20T13:56:14.508Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## DefaultActiveOrderStrategy

<GenerationInfo sourceFile="packages/core/src/config/order/default-active-order-strategy.ts" sourceLine="18" packageName="@vendure/core" since="1.9.0" />

The default <a href='/typescript-api/orders/active-order-strategy#activeorderstrategy'>ActiveOrderStrategy</a>, which uses the current <a href='/typescript-api/entities/session#session'>Session</a> to determine
the active Order, and requires no additional input in the Shop API since it is based on the
session which is part of the RequestContext.

```ts title="Signature"
class DefaultActiveOrderStrategy implements ActiveOrderStrategy {
  name: 'default-active-order-strategy';
  async init(injector: Injector) => ;
  createActiveOrder(ctx: RequestContext) => ;
  async determineActiveOrder(ctx: RequestContext) => ;
}
```
Implements

 * <a href='/typescript-api/orders/active-order-strategy#activeorderstrategy'>ActiveOrderStrategy</a>



### name

<MemberInfo kind="property" type="'default-active-order-strategy'"   />


### init

<MemberInfo kind="method" type="(injector: <a href='/typescript-api/common/injector#injector'>Injector</a>) => "   />


### createActiveOrder

<MemberInfo kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>) => "   />


### determineActiveOrder

<MemberInfo kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>) => "   />


