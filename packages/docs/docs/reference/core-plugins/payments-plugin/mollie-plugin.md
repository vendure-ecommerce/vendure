---
title: "MolliePlugin"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## MolliePlugin

<GenerationInfo sourceFile="packages/payments-plugin/src/mollie/mollie.plugin.ts" sourceLine="195" packageName="@vendure/payments-plugin" />

Plugin to enable payments through the [Mollie platform](https://docs.mollie.com/).
This plugin uses the Order API from Mollie, not the Payments API.

## Requirements

1. You will need to create a Mollie account and get your apiKey in the dashboard.
2. Install the Payments plugin and the Mollie client:

    `yarn add @vendure/payments-plugin @mollie/api-client`

    or

    `npm install @vendure/payments-plugin @mollie/api-client`

## Setup

1. Add the plugin to your VendureConfig `plugins` array:
    ```ts
    import { MolliePlugin } from '@vendure/payments-plugin/package/mollie';

    // ...

    plugins: [
      MolliePlugin.init({ vendureHost: 'https://yourhost.io/' }),
    ]
    ```
2. Create a new PaymentMethod in the Admin UI, and select "Mollie payments" as the handler.
3. Set your Mollie apiKey in the `API Key` field.
4. Set the `Fallback redirectUrl` to the url that the customer should be redirected to after completing the payment.
You can override this url by passing the `redirectUrl` as an argument to the `createMolliePaymentIntent` mutation.

## Storefront usage

In your storefront you add a payment to an order using the `createMolliePaymentIntent` mutation. In this example, our Mollie
PaymentMethod was given the code "mollie-payment-method". The `redirectUrl``is the url that is used to redirect the end-user
back to your storefront after completing the payment.

```GraphQL
mutation CreateMolliePaymentIntent {
  createMolliePaymentIntent(input: {
    redirectUrl: "https://storefront/order/1234XYZ" // Optional, the fallback redirect url set in the admin UI will be used if not provided
    paymentMethodCode: "mollie-payment-method" // Optional, the first method with Mollie as handler will be used if not provided
    molliePaymentMethodCode: "ideal", // Optional argument to skip the method selection in the hosted checkout
    locale: "nl_NL", // Optional, the browser language will be used by Mollie if not provided
    immediateCapture: true, // Optional, default is true, set to false if you expect the order fulfillment to take longer than 24 hours
  }) {
         ... on MolliePaymentIntent {
              url
          }
         ... on MolliePaymentIntentError {
              errorCode
              message
         }
  }
}
```

The response will contain
a redirectUrl, which can be used to redirect your customer to the Mollie
platform.

'molliePaymentMethodCode' is an optional parameter that can be passed to skip Mollie's hosted payment method selection screen
You can get available Mollie payment methods with the following query:

```GraphQL
{
 molliePaymentMethods(input: { paymentMethodCode: "mollie-payment-method" }) {
   id
   code
   description
   minimumAmount {
     value
     currency
   }
   maximumAmount {
     value
     currency
   }
   image {
     size1x
     size2x
     svg
   }
 }
}
```

After completing payment on the Mollie platform,
the user is redirected to the redirect url that was provided in the `createMolliePaymentIntent` mutation, e.g. `https://storefront/order/CH234X5`

## Pay later methods

Mollie supports pay-later methods like 'Klarna Pay Later'. Pay-later methods are captured immediately after payment.

If your order fulfillment time is longer than 24 hours You should pass `immediateCapture=false` to the `createMolliePaymentIntent` mutation.
This will transition your order to 'PaymentAuthorized' after the Mollie hosted checkout.
You need to manually capture the payment after the order is fulfilled, by settling existing payments, either via the admin UI or in custom code.

Make sure to capture a payment within 28 days, after that the payment will be automaticallreleased.
See the [Mollie documentation](https://docs.mollie.com/docs/place-a-hold-for-a-payment#authorization-expiration-window)
for more information.

## ArrangingAdditionalPayment state

In some rare cases, a customer can add items to the active order, while a Mollie checkout is still open,
for example by opening your storefront in another browser tab.
This could result in an order being in `ArrangingAdditionalPayment` status after the customer finished payment.
You should check if there is still an active order with status `ArrangingAdditionalPayment` on your order confirmation page,
and if so, allow your customer to pay for the additional items by creating another Mollie payment.

```ts title="Signature"
class MolliePlugin {
    static options: MolliePluginOptions;
    init(options: MolliePluginOptions) => typeof MolliePlugin;
}
```

<div className="members-wrapper">

### options

<MemberInfo kind="property" type={`<a href='/reference/core-plugins/payments-plugin/mollie-plugin#molliepluginoptions'>MolliePluginOptions</a>`}   />


### init

<MemberInfo kind="method" type={`(options: <a href='/reference/core-plugins/payments-plugin/mollie-plugin#molliepluginoptions'>MolliePluginOptions</a>) => typeof <a href='/reference/core-plugins/payments-plugin/mollie-plugin#mollieplugin'>MolliePlugin</a>`}   />

Initialize the mollie payment plugin


</div>


## MolliePluginOptions

<GenerationInfo sourceFile="packages/payments-plugin/src/mollie/mollie.plugin.ts" sourceLine="28" packageName="@vendure/payments-plugin" />

Configuration options for the Mollie payments plugin.

```ts title="Signature"
interface MolliePluginOptions {
    vendureHost: string;
    enabledPaymentMethodsParams?: (
        injector: Injector,
        ctx: RequestContext,
        order: Order | null,
    ) => AdditionalEnabledPaymentMethodsParams | Promise<AdditionalEnabledPaymentMethodsParams>;
}
```

<div className="members-wrapper">

### vendureHost

<MemberInfo kind="property" type={`string`}   />

The host of your Vendure server, e.g. `'https://my-vendure.io'`.
This is used by Mollie to send webhook events to the Vendure server
### enabledPaymentMethodsParams

<MemberInfo kind="property" type={`(         injector: <a href='/reference/typescript-api/common/injector#injector'>Injector</a>,         ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>,         order: <a href='/reference/typescript-api/entities/order#order'>Order</a> | null,     ) =&#62; AdditionalEnabledPaymentMethodsParams | Promise&#60;AdditionalEnabledPaymentMethodsParams&#62;`}  since="2.2.0"  />

Provide additional parameters to the Mollie enabled payment methods API call. By default,
the plugin will already pass the `resource` parameter.

For example, if you want to provide a `locale` and `billingCountry` for the API call, you can do so like this:

**Note:** The `order` argument is possibly `null`, this could happen when you fetch the available payment methods
before the order is created.

*Example*

```ts
import { VendureConfig } from '@vendure/core';
import { MolliePlugin, getLocale } from '@vendure/payments-plugin/package/mollie';

export const config: VendureConfig = {
  // ...
  plugins: [
    MolliePlugin.init({
      enabledPaymentMethodsParams: (injector, ctx, order) => {
        const locale = order?.billingAddress?.countryCode
            ? getLocale(order.billingAddress.countryCode, ctx.languageCode)
            : undefined;

        return {
          locale,
          billingCountry: order?.billingAddress?.countryCode,
        },
      }
    }),
  ],
};
```


</div>
