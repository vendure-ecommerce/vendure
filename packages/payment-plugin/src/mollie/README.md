# Mollie payment plugin

Plugin to integrate the Mollie

:warning: This plugin does not yet implement refund. It will soon..

### 1. Add in plugin list in `vendure-config.ts`:

```js
MolliePlugin.init('https://yourhost.io/');
```

Pass your publicly available Vendure host to the plugin. This is used by Mollie to let the plugin know when the status
of a payment changed.

**Use something like `localtunnel` to test on localhost!**

### 2. Admin ui

1. Go to the Vendure admin
2. Go to `settings > paymentMethods` and create a payment method with the name `mollie-payment-YOUR_CHANNEL_TOKEN`. This
   specific name is used in the webhook from Mollie.
3. Set the `redirectUrl`, this is the url that is used to redirect the end-user. I.E. `https://storefront/order`
4. Set the your Mollie key in the `apiKey` field.

**The redirect url is used like this: `${redirectUrl}/${order.code}`, so your user will be directed to the page
on `https://storefront/order/CH234X5`**

### Storefront

In your storefront you add a payment to an order as described in the Vendure docs. The response will have
a `order.payments.metadata.public.redirectLink` in it, which can be used to redirect your customer to the Mollie
platform.
