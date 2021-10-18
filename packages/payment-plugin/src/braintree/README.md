# Braintree plugin

This plugin enables payments to be processed by [Braintree](https://www.braintreepayments.com/), a popular payment provider.

## Requirements

1. You will need to create a Braintree sandbox account as outlined in https://developers.braintreepayments.com/start/overview.
2. Then install `braintree` and `@types/braintree` from npm. This plugin was written with `v3.0.0` of the Braintree lib.

## Setup
1. Add the plugin to your VendureConfig `plugins` array.
2. In the admin UI, fill in the `merchantId`, `publicKey` & `privateKey` from your Braintree sandbox account.

## Usage

The plugin is designed to work with the [Braintree drop-in UI](https://developers.braintreepayments.com/guides/drop-in/overview/javascript/v3).

In your storefront, you'll have some code like this to submit the payment:

```TypeScript
async function submitPayment() {
    const paymentResult = await this.dropin.requestPaymentMethod();
    myGraphQlClient.mutation(gql`
        mutation {
            addPaymentToOrder(input: $input) {
                id
                state
                payments {
                    id
                    amount
                    errorMessage
                    method
                    state
                    transactionId
                    createdAt
                }
            }
        }`, {
        input: {
            method: 'braintree',
            metadata: paymentResult,
        },
    });
}
```
