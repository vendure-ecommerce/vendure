import { configurableOperationFragment } from '@/vdb/graphql/fragments.js';
import { graphql } from '@/vdb/graphql/graphql.js';

export const shippingMethodItemFragment = graphql(`
    fragment ShippingMethodItem on ShippingMethod {
        id
        name
        code
        description
        fulfillmentHandlerCode
        createdAt
        updatedAt
    }
`);

export const shippingMethodListQuery = graphql(
    `
        query ShippingMethodList {
            shippingMethods {
                items {
                    ...ShippingMethodItem
                }
                totalItems
            }
        }
    `,
    [shippingMethodItemFragment],
);

export const shippingMethodDetailDocument = graphql(
    `
        query ShippingMethodDetail($id: ID!) {
            shippingMethod(id: $id) {
                id
                createdAt
                updatedAt
                code
                name
                description
                fulfillmentHandlerCode
                checker {
                    ...ConfigurableOperation
                }
                calculator {
                    ...ConfigurableOperation
                }
                translations {
                    id
                    languageCode
                    name
                    description
                }
                customFields
            }
        }
    `,
    [configurableOperationFragment],
);

export const createShippingMethodDocument = graphql(`
    mutation CreateShippingMethod($input: CreateShippingMethodInput!) {
        createShippingMethod(input: $input) {
            id
        }
    }
`);

export const updateShippingMethodDocument = graphql(`
    mutation UpdateShippingMethod($input: UpdateShippingMethodInput!) {
        updateShippingMethod(input: $input) {
            id
        }
    }
`);

export const deleteShippingMethodDocument = graphql(`
    mutation DeleteShippingMethod($id: ID!) {
        deleteShippingMethod(id: $id) {
            result
            message
        }
    }
`);

export const deleteShippingMethodsDocument = graphql(`
    mutation DeleteShippingMethods($ids: [ID!]!) {
        deleteShippingMethods(ids: $ids) {
            result
            message
        }
    }
`);

export const assignShippingMethodsToChannelDocument = graphql(`
    mutation AssignShippingMethodsToChannel($input: AssignShippingMethodsToChannelInput!) {
        assignShippingMethodsToChannel(input: $input) {
            id
            name
        }
    }
`);

export const removeShippingMethodsFromChannelDocument = graphql(`
    mutation RemoveShippingMethodsFromChannel($input: RemoveShippingMethodsFromChannelInput!) {
        removeShippingMethodsFromChannel(input: $input) {
            id
            name
        }
    }
`);
