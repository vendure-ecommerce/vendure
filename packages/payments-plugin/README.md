# Payments plugin

For documentation, see [docs.vendure.io/reference/core-plugins/payments-plugin/](https://docs.vendure.io/reference/core-plugins/payments-plugin/)

## Development

### Mollie local development

For testing out changes to the Mollie plugin locally, with a real Mollie account, follow the steps below. These steps
will create an order, set Mollie as payment method, and create a payment intent link to the Mollie platform.

1. Get a test api key from your Mollie
   dashboard: https://help.mollie.com/hc/en-us/articles/115000328205-Where-can-I-find-the-API-key-
2. Create the file `packages/payments-plugin/.env` with content `MOLLIE_APIKEY=your-test-apikey`
3. `cd packages/payments-plugin`
5. `npm run dev-server:mollie`
6. Watch the logs for `Mollie payment link` and click the link to finalize the test payment.

You can change the order flow, payment methods and more in the file `e2e/mollie-dev-server`, and restart the devserver.

### Stripe local development

For testing out changes to the Stripe plugin locally, with a real Stripe account, follow the steps below. These steps
will create an order, set Stripe as payment method, and create a payment secret.

1. Get a test api key from your Stripe
   dashboard: https://dashboard.stripe.com/test/apikeys
2. Use Ngrok or Localtunnel to make your localhost publicly available and create a webhook as described here: https://www.vendure.io/docs/typescript-api/payments-plugin/stripe-plugin/
3. Create the file `packages/payments-plugin/.env` with these contents:
```sh
STRIPE_APIKEY=sk_test_xxxx
STRIPE_WEBHOOK_SECRET=webhook-secret
STRIPE_PUBLISHABLE_KEY=pk_test_xxxx
```
1. `cd packages/payments-plugin`
2. `yarn dev-server:stripe`
3. Watch the logs for the link or go to `http://localhost:3050/checkout` to test the checkout.

After checkout completion you can see your payment in https://dashboard.stripe.com/test/payments/
