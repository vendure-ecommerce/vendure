---
title: "OrderCodeStrategy"
weight: 10
date: 2023-07-14T16:57:49.636Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# OrderCodeStrategy
<div class="symbol">


# OrderCodeStrategy

{{< generation-info sourceFile="packages/core/src/config/order/order-code-strategy.ts" sourceLine="32" packageName="@vendure/core">}}

The OrderCodeStrategy determines how Order codes are generated.
A custom strategy can be defined which e.g. integrates with an
existing system to generate a code:

*Example*

```TypeScript
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

## Signature

```TypeScript
interface OrderCodeStrategy extends InjectableStrategy {
  generate(ctx: RequestContext): string | Promise<string>;
}
```
## Extends

 * <a href='/typescript-api/common/injectable-strategy#injectablestrategy'>InjectableStrategy</a>


## Members

### generate

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>) => string | Promise&#60;string&#62;"  >}}

{{< member-description >}}Generates the order code.{{< /member-description >}}


</div>
<div class="symbol">


# DefaultOrderCodeStrategy

{{< generation-info sourceFile="packages/core/src/config/order/order-code-strategy.ts" sourceLine="48" packageName="@vendure/core">}}

The default OrderCodeStrategy generates a random string consisting
of 16 uppercase letters and numbers.

## Signature

```TypeScript
class DefaultOrderCodeStrategy implements OrderCodeStrategy {
  generate(ctx: RequestContext) => string;
}
```
## Implements

 * <a href='/typescript-api/orders/order-code-strategy#ordercodestrategy'>OrderCodeStrategy</a>


## Members

### generate

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>) => string"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
