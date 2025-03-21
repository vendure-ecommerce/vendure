import { graphql } from '@/graphql/graphql.js';

export const paymentMethodItemFragment = graphql(`
    fragment PaymentMethodItem on PaymentMethod {
        id
        createdAt
        updatedAt
        name
        description
        code
        enabled
    }
`);

export const paymentMethodListQuery = graphql(
    `
        query PaymentMethodList {
            paymentMethods {
                items {
                    ...PaymentMethodItem
                }
                totalItems
            }
        }
    `,
    [paymentMethodItemFragment],
);
