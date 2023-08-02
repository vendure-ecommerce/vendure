---
title: "OrderCodeStrategy"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## OrderCodeStrategy

<GenerationInfo sourceFile="packages/core/src/config/order/order-code-strategy.ts" sourceLine="39" packageName="@vendure/core" />

The OrderCodeStrategy determines how Order codes are generated.
A custom strategy can be defined which e.g. integrates with an
existing system to generate a code:

:::info

This is configured via the `orderOptions.orderCodeStrategy` property of
your VendureConfig.

:::

*Example*

```ts
class MyOrderCodeStrategy implements OrderCodeStrategy {
  // Some imaginary service which calls out to an existing external
  // order management system.
  private mgmtService: ExternalOrderManagementService;

  init(injector: Injector) {
    this.mgmtService = injector.get(ExternalOrderManagementService);
  }

  async generate(ctx: RequestContext) {
    const result = await this.mgmtService.getAvailableOrderParams();
    return result.code;
  }
}
```

```ts title="Signature"
interface OrderCodeStrategy extends InjectableStrategy {
    generate(ctx: RequestContext): string | Promise<string>;
}
```
* Extends: <code><a href='/reference/typescript-api/common/injectable-strategy#injectablestrategy'>InjectableStrategy</a></code>



<div className="members-wrapper">

### generate

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>) => string | Promise&#60;string&#62;`}   />

Generates the order code.


</div>


## DefaultOrderCodeStrategy

<GenerationInfo sourceFile="packages/core/src/config/order/order-code-strategy.ts" sourceLine="55" packageName="@vendure/core" />

The default OrderCodeStrategy generates a random string consisting
of 16 uppercase letters and numbers.

```ts title="Signature"
class DefaultOrderCodeStrategy implements OrderCodeStrategy {
    generate(ctx: RequestContext) => string;
}
```
* Implements: <code><a href='/reference/typescript-api/orders/order-code-strategy#ordercodestrategy'>OrderCodeStrategy</a></code>



<div className="members-wrapper">

### generate

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>) => string`}   />




</div>
