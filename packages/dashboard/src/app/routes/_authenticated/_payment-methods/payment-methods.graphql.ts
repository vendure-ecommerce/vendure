import { configurableOperationFragment } from '@/graphql/fragments.js';
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

export const paymentMethodDetailDocument = graphql(
    `
        query PaymentMethodDetail($id: ID!) {
            paymentMethod(id: $id) {
                id
                createdAt
                updatedAt
                name
                code
                description
                enabled
                translations {
                    id
                    languageCode
                    name
                    description
                }
                checker {
                    ...ConfigurableOperation
                }
                handler {
                    ...ConfigurableOperation
                }
                customFields
            }
        }
    `,
    [configurableOperationFragment],
);

export const createPaymentMethodDocument = graphql(`
    mutation CreatePaymentMethod($input: CreatePaymentMethodInput!) {
        createPaymentMethod(input: $input) {
            id
        }
    }
`);

export const updatePaymentMethodDocument = graphql(`
    mutation UpdatePaymentMethod($input: UpdatePaymentMethodInput!) {
        updatePaymentMethod(input: $input) {
            id
        }
    }
`);

export const deletePaymentMethodDocument = graphql(`
    mutation DeletePaymentMethod($id: ID!) {
        deletePaymentMethod(id: $id) {
            result
            message
        }
    }
`);
