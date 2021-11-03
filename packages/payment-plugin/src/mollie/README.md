# Mollie payment plugin

Plugin to enable payments through the [Mollie platform](https://docs.mollie.com/).
This plugin uses the Payments API from Mollie, not the Orders API.

## Requirements

1. You will need to create a Mollie account and get your apiKey in the dashboard.
2. Install the Mollie client with `yarn add @mollie/api-client`

## Setup

1. Add the plugin to your VendureConfig `plugins` array:

```js
MolliePlugin.init({ vendureHost: 'https://yourhost.io/' });
```

2. In the admin UI set the `redirectUrl`, this is the url that is used to redirect the end-user. I.E. `https://storefront/order`
3. Set your Mollie apiKey in the `apiKey` field.

After completing payment on the Mollie platform, 
the user is redirect to the configured url + orderCode: `https://storefront/order/CH234X5`

**Use something like [localtunnel](https://github.com/localtunnel/localtunnel) to test on localhost!**
```bash 
npx localtunnel --port 3000 --subdomain my-shop-local-dev
> your url is: https://my-shop-local-dev.loca.lt     <- use this as the vendureHost for local dev.
```

## Storefront usage

In your storefront you add a payment to an order as described in the Vendure docs. The response will have
a `order.payments.metadata.public.redirectLink` in it, which can be used to redirect your customer to the Mollie
platform.
