import { graphql } from './graphql-admin';

export const paymentMethodFragment = graphql(`
    fragment PaymentMethod on PaymentMethod {
        id
        code
        name
        description
        enabled
        checker {
            code
            args {
                name
                value
            }
        }
        handler {
            code
            args {
                name
                value
            }
        }
    }
`);

export const refundFragment = graphql(`
    fragment Refund on Refund {
        id
        state
        items
        transactionId
        shipping
        total
        metadata
    }
`);
