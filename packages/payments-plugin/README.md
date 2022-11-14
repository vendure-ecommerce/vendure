# Payments plugin

For documentation, see https://www.vendure.io/docs/typescript-api/payments-plugin

## Development

### Mollie local development

For testing out changes to the Mollie plugin locally, with a real Mollie account, follow the steps below. These steps
will create an order, set Mollie as payment method, and create a payment intent link to the Mollie platform.

1. Get a test apikey from your Mollie
   dashboard: https://help.mollie.com/hc/en-us/articles/115000328205-Where-can-I-find-the-API-key-
2. Create an .env file in `packages/payments-plugin` with `MOLLIE_APIKEY=your-test-apikey`
3. `cd packages/payments-plugin`
4. `yarn dev-server:mollie`
5. Watch the logs for `Mollie payment link` and click the link to finalize the test payment.

You can change the order flow, payment methods and more in the file `e2e/mollie-dev-server`, and restart the devserver.
