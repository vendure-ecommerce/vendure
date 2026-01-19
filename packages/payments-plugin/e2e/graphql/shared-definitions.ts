import { graphql } from './graphql-shop';

export const createMolliePaymentIntentDocument = graphql(`
    mutation createMolliePaymentIntent($input: MolliePaymentIntentInput!) {
        createMolliePaymentIntent(input: $input) {
            ... on MolliePaymentIntent {
                url
            }
            ... on MolliePaymentIntentError {
                errorCode
                message
            }
        }
    }
`);

export const getMolliePaymentMethodsDocument = graphql(`
    query molliePaymentMethods($input: MolliePaymentMethodsInput!) {
        molliePaymentMethods(input: $input) {
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
`);

export const createStripePaymentIntentDocument = graphql(`
    mutation createStripePaymentIntent {
        createStripePaymentIntent
    }
`);

export const createCustomStripePaymentIntentDocument = graphql(`
    mutation createCustomStripePaymentIntent {
        createCustomStripePaymentIntent
    }
`);

export const syncMolliePaymentStatusDocument = graphql(`
    mutation syncMolliePaymentStatus($orderCode: String!) {
        syncMolliePaymentStatus(orderCode: $orderCode) {
            id
            code
            state
        }
    }
`);
