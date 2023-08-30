---
title: "ConfigurableOperationDef"
weight: 10
date: 2023-07-14T16:57:49.424Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# ConfigurableOperationDef
<div class="symbol">


# ConfigurableOperationDef

{{< generation-info sourceFile="packages/core/src/common/configurable-operation.ts" sourceLine="335" packageName="@vendure/core">}}

A ConfigurableOperationDef is a special type of object used extensively by Vendure to define
code blocks which have arguments which are configurable at run-time by the administrator.

This is the mechanism used by:

* <a href='/typescript-api/configuration/collection-filter#collectionfilter'>CollectionFilter</a>
* <a href='/typescript-api/payment/payment-method-handler#paymentmethodhandler'>PaymentMethodHandler</a>
* <a href='/typescript-api/promotions/promotion-action#promotionaction'>PromotionAction</a>
* <a href='/typescript-api/promotions/promotion-condition#promotioncondition'>PromotionCondition</a>
* <a href='/typescript-api/shipping/shipping-calculator#shippingcalculator'>ShippingCalculator</a>
* <a href='/typescript-api/shipping/shipping-eligibility-checker#shippingeligibilitychecker'>ShippingEligibilityChecker</a>

Any class which extends ConfigurableOperationDef works in the same way: it takes a
config object as the constructor argument. That config object extends the <a href='/typescript-api/configurable-operation-def/configurable-operation-def-options#configurableoperationdefoptions'>ConfigurableOperationDefOptions</a>
interface and typically adds some kind of business logic function to it.

For example, in the case of `ShippingEligibilityChecker`,
it adds the `check()` function to the config object which defines the logic for checking whether an Order is eligible
for a particular ShippingMethod.

## The `args` property

The key feature of the ConfigurableOperationDef is the `args` property. This is where we define those
arguments that are exposed via the Admin UI as data input components. This allows their values to
be set at run-time by the Administrator. Those values can then be accessed in the business logic
of the operation.

The data type of the args can be one of <a href='/typescript-api/configurable-operation-def/config-arg-type#configargtype'>ConfigArgType</a>, and the configuration is further explained in
the docs of <a href='/typescript-api/configurable-operation-def/config-args#configargs'>ConfigArgs</a>.

## Dependency Injection
If your business logic relies on injectable providers, such as the `TransactionalConnection` object, or any of the
internal Vendure services or those defined in a plugin, you can inject them by using the config object's
`init()` method, which exposes the <a href='/typescript-api/common/injector#injector'>Injector</a>.

Here's an example of a ShippingCalculator that injects a service which has been defined in a plugin:

*Example*

```TypeScript
import { Injector, ShippingCalculator } from '@vendure/core';
import { ShippingRatesService } from './shipping-rates.service';

// We keep reference to our injected service by keeping it
// in the top-level scope of the file.
let shippingRatesService: ShippingRatesService;

export const customShippingCalculator = new ShippingCalculator({
  code: 'custom-shipping-calculator',
  description: [],
  args: {},

  init(injector: Injector) {
    // The init function is called during bootstrap, and allows
    // us to inject any providers we need.
    shippingRatesService = injector.get(ShippingRatesService);
  },

  calculate: async (order, args) => {
    // We can now use the injected provider in the business logic.
    const { price, priceWithTax } = await shippingRatesService.getRate({
      destination: order.shippingAddress,
      contents: order.lines,
    });

    return {
      price,
      priceWithTax,
    };
  },
});
```

## Signature

```TypeScript
class ConfigurableOperationDef<T extends ConfigArgs = ConfigArgs> {
  code: string
  args: T
  description: LocalizedStringArray
  constructor(options: ConfigurableOperationDefOptions<T>)
  async init(injector: Injector) => ;
  async destroy() => ;
  toGraphQlType(ctx: RequestContext) => ConfigurableOperationDefinition;
  protected argsArrayToHash(args: ConfigArg[]) => ConfigArgValues<T>;
}
```
## Members

### code

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### args

{{< member-info kind="property" type="T"  >}}

{{< member-description >}}{{< /member-description >}}

### description

{{< member-info kind="property" type="<a href='/typescript-api/configurable-operation-def/localized-string-array#localizedstringarray'>LocalizedStringArray</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### constructor

{{< member-info kind="method" type="(options: <a href='/typescript-api/configurable-operation-def/configurable-operation-def-options#configurableoperationdefoptions'>ConfigurableOperationDefOptions</a>&#60;T&#62;) => ConfigurableOperationDef"  >}}

{{< member-description >}}{{< /member-description >}}

### init

{{< member-info kind="method" type="(injector: <a href='/typescript-api/common/injector#injector'>Injector</a>) => "  >}}

{{< member-description >}}{{< /member-description >}}

### destroy

{{< member-info kind="method" type="() => "  >}}

{{< member-description >}}{{< /member-description >}}

### toGraphQlType

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>) => ConfigurableOperationDefinition"  >}}

{{< member-description >}}Convert a ConfigurableOperationDef into a ConfigurableOperationDefinition object, typically
so that it can be sent via the API.{{< /member-description >}}

### argsArrayToHash

{{< member-info kind="method" type="(args: ConfigArg[]) => ConfigArgValues&#60;T&#62;"  >}}

{{< member-description >}}Coverts an array of ConfigArgs into a hash object:

from:
`[{ name: 'foo', type: 'string', value: 'bar'}]`

to:
`{ foo: 'bar' }`{{< /member-description >}}


</div>
