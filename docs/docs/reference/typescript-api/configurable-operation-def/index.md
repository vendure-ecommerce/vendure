---
title: "ConfigurableOperationDef"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## ConfigurableOperationDef

<GenerationInfo sourceFile="packages/core/src/common/configurable-operation.ts" sourceLine="335" packageName="@vendure/core" />

A ConfigurableOperationDef is a special type of object used extensively by Vendure to define
code blocks which have arguments which are configurable at run-time by the administrator.

This is the mechanism used by:

* <a href='/reference/typescript-api/configuration/collection-filter#collectionfilter'>CollectionFilter</a>
* <a href='/reference/typescript-api/payment/payment-method-handler#paymentmethodhandler'>PaymentMethodHandler</a>
* <a href='/reference/typescript-api/promotions/promotion-action#promotionaction'>PromotionAction</a>
* <a href='/reference/typescript-api/promotions/promotion-condition#promotioncondition'>PromotionCondition</a>
* <a href='/reference/typescript-api/shipping/shipping-calculator#shippingcalculator'>ShippingCalculator</a>
* <a href='/reference/typescript-api/shipping/shipping-eligibility-checker#shippingeligibilitychecker'>ShippingEligibilityChecker</a>

Any class which extends ConfigurableOperationDef works in the same way: it takes a
config object as the constructor argument. That config object extends the <a href='/reference/typescript-api/configurable-operation-def/configurable-operation-def-options#configurableoperationdefoptions'>ConfigurableOperationDefOptions</a>
interface and typically adds some kind of business logic function to it.

For example, in the case of `ShippingEligibilityChecker`,
it adds the `check()` function to the config object which defines the logic for checking whether an Order is eligible
for a particular ShippingMethod.

## The `args` property

The key feature of the ConfigurableOperationDef is the `args` property. This is where we define those
arguments that are exposed via the Admin UI as data input components. This allows their values to
be set at run-time by the Administrator. Those values can then be accessed in the business logic
of the operation.

The data type of the args can be one of <a href='/reference/typescript-api/configurable-operation-def/config-arg-type#configargtype'>ConfigArgType</a>, and the configuration is further explained in
the docs of <a href='/reference/typescript-api/configurable-operation-def/config-args#configargs'>ConfigArgs</a>.

## Dependency Injection
If your business logic relies on injectable providers, such as the `TransactionalConnection` object, or any of the
internal Vendure services or those defined in a plugin, you can inject them by using the config object's
`init()` method, which exposes the <a href='/reference/typescript-api/common/injector#injector'>Injector</a>.

Here's an example of a ShippingCalculator that injects a service which has been defined in a plugin:

*Example*

```ts
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

```ts title="Signature"
class ConfigurableOperationDef<T extends ConfigArgs = ConfigArgs> {
    code: string
    args: T
    description: LocalizedStringArray
    constructor(options: ConfigurableOperationDefOptions<T>)
    init(injector: Injector) => ;
    destroy() => ;
    toGraphQlType(ctx: RequestContext) => ConfigurableOperationDefinition;
    argsArrayToHash(args: ConfigArg[]) => ConfigArgValues<T>;
}
```

<div className="members-wrapper">

### code

<MemberInfo kind="property" type={`string`}   />


### args

<MemberInfo kind="property" type={`T`}   />


### description

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/configurable-operation-def/localized-string-array#localizedstringarray'>LocalizedStringArray</a>`}   />


### constructor

<MemberInfo kind="method" type={`(options: <a href='/reference/typescript-api/configurable-operation-def/configurable-operation-def-options#configurableoperationdefoptions'>ConfigurableOperationDefOptions</a>&#60;T&#62;) => ConfigurableOperationDef`}   />


### init

<MemberInfo kind="method" type={`(injector: <a href='/reference/typescript-api/common/injector#injector'>Injector</a>) => `}   />


### destroy

<MemberInfo kind="method" type={`() => `}   />


### toGraphQlType

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>) => ConfigurableOperationDefinition`}   />

Convert a ConfigurableOperationDef into a ConfigurableOperationDefinition object, typically
so that it can be sent via the API.
### argsArrayToHash

<MemberInfo kind="method" type={`(args: ConfigArg[]) => ConfigArgValues&#60;T&#62;`}   />

Coverts an array of ConfigArgs into a hash object:

from:
`[{ name: 'foo', type: 'string', value: 'bar'}]`

to:
`{ foo: 'bar' }`


</div>
