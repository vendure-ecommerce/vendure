---
title: "FulfillmentHandler"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## FulfillmentHandler

<GenerationInfo sourceFile="packages/core/src/config/fulfillment/fulfillment-handler.ts" sourceLine="150" packageName="@vendure/core" />

A FulfillmentHandler is used when creating a new <a href='/reference/typescript-api/entities/fulfillment#fulfillment'>Fulfillment</a>. When the `addFulfillmentToOrder` mutation
is executed, the specified handler will be used and it's `createFulfillment` method is called. This method
may perform async tasks such as calling a 3rd-party shipping API to register a new shipment and receive
a tracking code. This data can then be returned and will be incorporated into the created Fulfillment.

If the `args` property is defined, this means that arguments passed to the `addFulfillmentToOrder` mutation
will be passed through to the `createFulfillment` method as the last argument.

*Example*

```ts
let shipomatic;

export const shipomaticFulfillmentHandler = new FulfillmentHandler({
  code: 'ship-o-matic',
  description: [{
    languageCode: LanguageCode.en,
    value: 'Generate tracking codes via the Ship-o-matic API'
  }],

  args: {
    preferredService: {
      type: 'string',
      ui: {
        component: 'select-form-input',
        options: [
          { value: 'first_class' },
          { value: 'priority'},
          { value: 'standard' },
        ],
      },
    }
  },

  init: () => {
    // some imaginary shipping service
    shipomatic = new ShipomaticClient(API_KEY);
  },

  createFulfillment: async (ctx, orders, lines, args) => {

     const shipment = getShipmentFromOrders(orders, lines);

     try {
       const transaction = await shipomatic.transaction.create({
         shipment,
         service_level: args.preferredService,
         label_file_type: 'png',
       })

       return {
         method: `Ship-o-matic ${args.preferredService}`,
         trackingCode: transaction.tracking_code,
         customFields: {
           shippingTransactionId: transaction.id,
         }
       };
     } catch (e: any) {
       // Errors thrown from within this function will
       // result in a CreateFulfillmentError being returned
       throw e;
     }
  },

  onFulfillmentTransition: async (fromState, toState, { fulfillment }) => {
    if (toState === 'Cancelled') {
      await shipomatic.transaction.cancel({
        transaction_id: fulfillment.customFields.shippingTransactionId,
      });
    }
  }
});
```

```ts title="Signature"
class FulfillmentHandler<T extends ConfigArgs = ConfigArgs> extends ConfigurableOperationDef<T> {
    constructor(config: FulfillmentHandlerConfig<T>)
}
```
* Extends: <code><a href='/reference/typescript-api/configurable-operation-def/#configurableoperationdef'>ConfigurableOperationDef</a>&#60;T&#62;</code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(config: <a href='/reference/typescript-api/fulfillment/fulfillment-handler#fulfillmenthandlerconfig'>FulfillmentHandlerConfig</a>&#60;T&#62;) => FulfillmentHandler`}   />




</div>


## FulfillmentHandlerConfig

<GenerationInfo sourceFile="packages/core/src/config/fulfillment/fulfillment-handler.ts" sourceLine="49" packageName="@vendure/core" />

The configuration object used to instantiate a <a href='/reference/typescript-api/fulfillment/fulfillment-handler#fulfillmenthandler'>FulfillmentHandler</a>.

```ts title="Signature"
interface FulfillmentHandlerConfig<T extends ConfigArgs> extends ConfigurableOperationDefOptions<T> {
    createFulfillment: CreateFulfillmentFn<T>;
    onFulfillmentTransition?: OnTransitionStartFn<FulfillmentState, FulfillmentTransitionData>;
}
```
* Extends: <code><a href='/reference/typescript-api/configurable-operation-def/configurable-operation-def-options#configurableoperationdefoptions'>ConfigurableOperationDefOptions</a>&#60;T&#62;</code>



<div className="members-wrapper">

### createFulfillment

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/fulfillment/fulfillment-handler#createfulfillmentfn'>CreateFulfillmentFn</a>&#60;T&#62;`}   />

Invoked when the `addFulfillmentToOrder` mutation is executed with this handler selected.

If an Error is thrown from within this function, no Fulfillment is created and the `CreateFulfillmentError`
result will be returned.
### onFulfillmentTransition

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/state-machine/state-machine-config#ontransitionstartfn'>OnTransitionStartFn</a>&#60;<a href='/reference/typescript-api/fulfillment/fulfillment-state#fulfillmentstate'>FulfillmentState</a>, <a href='/reference/typescript-api/fulfillment/fulfillment-transition-data#fulfillmenttransitiondata'>FulfillmentTransitionData</a>&#62;`}   />

This allows the handler to intercept state transitions of the created Fulfillment. This works much in the
same way as the {@link CustomFulfillmentProcess} `onTransitionStart` method (i.e. returning `false` or
`string` will be interpreted as an error and prevent the state transition), except that it is only invoked
on Fulfillments which were created with this particular FulfillmentHandler.

It can be useful e.g. to intercept Fulfillment cancellations and relay that information to a 3rd-party
shipping API.


</div>


## CreateFulfillmentFn

<GenerationInfo sourceFile="packages/core/src/config/fulfillment/fulfillment-handler.ts" sourceLine="34" packageName="@vendure/core" />

The function called when creating a new Fulfillment

```ts title="Signature"
type CreateFulfillmentFn<T extends ConfigArgs> = (
    ctx: RequestContext,
    orders: Order[],
    lines: OrderLineInput[],
    args: ConfigArgValues<T>,
) => CreateFulfillmentResult | Promise<CreateFulfillmentResult>
```


## CreateFulfillmentResult

<GenerationInfo sourceFile="packages/core/src/config/fulfillment/fulfillment-handler.ts" sourceLine="24" packageName="@vendure/core" />



```ts title="Signature"
type CreateFulfillmentResult = Partial<Pick<Fulfillment, 'trackingCode' | 'method' | 'customFields'>>
```
