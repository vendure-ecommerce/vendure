---
title: "MolliePlugin"
weight: 10
date: 2023-07-14T16:57:50.795Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# MolliePlugin
<div class="symbol">


# MolliePlugin

{{< generation-info sourceFile="packages/payments-plugin/src/mollie/mollie.plugin.ts" sourceLine="151" packageName="@vendure/payments-plugin">}}

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
    ```TypeScript
    import { MolliePlugin } from '@vendure/payments-plugin/package/mollie';

    // ...

    plugins: [
      MolliePlugin.init({ vendureHost: 'https://yourhost.io/', useDynamicRedirectUrl: true }),
    ]
    ```
2. Create a new PaymentMethod in the Admin UI, and select "Mollie payments" as the handler.
3. Set your Mollie apiKey in the `API Key` field.

## Specifying the redirectUrl

Currently, there are two ways to specify the `redirectUrl` to which the customer is redirected after completing the payment:
1. Configure the `redirectUrl` in the PaymentMethod.
2. Pass the `redirectUrl` as an argument to the `createPaymentIntent` mutation.

Which method is used depends on the value of the `useDynamicRedirectUrl` option while initializing the plugin.
By default, this option is set to `false` for backwards compatibility. In a future version, this option will be deprecated.
Upon deprecation, the `redirectUrl` will always be passed as an argument to the `createPaymentIntent` mutation.

TODO toevoegen van /code weggehaald..!
## Storefront usage

In your storefront you add a payment to an order using the `createMolliePaymentIntent` mutation. In this example, our Mollie
PaymentMethod was given the code "mollie-payment-method". The `redirectUrl``is the url that is used to redirect the end-user
back to your storefront after completing the payment. When using the first method specified in `Specifying the redirectUrl`,
the order code is appened to the `redirectUrl`. For the second method, the order code is not appended to the specified `redirectUrl`.

```GraphQL
mutation CreateMolliePaymentIntent {
  createMolliePaymentIntent(input: {
    redirectUrl: "https://storefront/order"
    paymentMethodCode: "mollie-payment-method"
    molliePaymentMethodCode: "ideal"
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
You can pass `MolliePaymentMethod.code` to the `createMolliePaymentIntent` mutation to skip the method selection.

After completing payment on the Mollie platform,
the user is redirected to the configured redirect url + orderCode: `https://storefront/order/CH234X5`

## Pay later methods
Mollie supports pay-later methods like 'Klarna Pay Later'. For pay-later methods, the status of an order is
'PaymentAuthorized' after the Mollie hosted checkout. You need to manually settle the payment via the admin ui to capture the payment!
Make sure you capture a payment within 28 days, because this is the Klarna expiry time

If you don't want this behaviour (Authorized first), you can set 'autoCapture=true' on the payment method. This option will immediately
capture the payment after a customer authorizes the payment.

## Signature

```TypeScript
class MolliePlugin {
  static static options: MolliePluginOptions;
  static init(options: MolliePluginOptions) => typeof MolliePlugin;
}
```
## Members

### options

{{< member-info kind="property" type="<a href='/typescript-api/core-plugins/payments-plugin/mollie-plugin#molliepluginoptions'>MolliePluginOptions</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### init

{{< member-info kind="method" type="(options: <a href='/typescript-api/core-plugins/payments-plugin/mollie-plugin#molliepluginoptions'>MolliePluginOptions</a>) => typeof <a href='/typescript-api/core-plugins/payments-plugin/mollie-plugin#mollieplugin'>MolliePlugin</a>"  >}}

{{< member-description >}}Initialize the mollie payment plugin{{< /member-description >}}


</div>
<div class="symbol">


# MolliePluginOptions

{{< generation-info sourceFile="packages/payments-plugin/src/mollie/mollie.plugin.ts" sourceLine="17" packageName="@vendure/payments-plugin">}}

Configuration options for the Mollie payments plugin.

## Signature

```TypeScript
interface MolliePluginOptions {
  vendureHost: string;
  useDynamicRedirectUrl?: boolean;
}
```
## Members

### vendureHost

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}The host of your Vendure server, e.g. `'https://my-vendure.io'`.
This is used by Mollie to send webhook events to the Vendure server{{< /member-description >}}

### useDynamicRedirectUrl

{{< member-info kind="property" type="boolean" default="false"  since="2.0.0" >}}

{{< member-description >}}For backwards compatibility, by default set to false.
This option will be deprecated in a future version.
When enabled, the `redirectUrl` can be passed via the `createPaymentIntent` mutation
instead of being configured in the Payment Method.{{< /member-description >}}


</div>
