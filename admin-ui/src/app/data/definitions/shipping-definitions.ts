import gql from 'graphql-tag';

import { ADJUSTMENT_OPERATION_FRAGMENT } from './promotion-definitions';

export const SHIPPING_METHOD_FRAGMENT = gql`
    fragment ShippingMethod on ShippingMethod {
        id
        createdAt
        updatedAt
        code
        description
        checker {
            ...AdjustmentOperation
        }
        calculator {
            ...AdjustmentOperation
        }
    }
    ${ADJUSTMENT_OPERATION_FRAGMENT}
`;

export const GET_SHIPPING_METHOD_LIST = gql`
    query GetShippingMethodList($options: ShippingMethodListOptions) {
        shippingMethods(options: $options) {
            items {
                ...ShippingMethod
            }
            totalItems
        }
    }
    ${SHIPPING_METHOD_FRAGMENT}
`;

export const GET_SHIPPING_METHOD = gql`
    query GetShippingMethod($id: ID!) {
        shippingMethod(id: $id) {
            ...ShippingMethod
        }
    }
    ${SHIPPING_METHOD_FRAGMENT}
`;

export const GET_SHIPPING_METHOD_OPERATIONS = gql`
    query GetShippingMethodOperations {
        shippingEligibilityCheckers {
            ...AdjustmentOperation
        }
        shippingCalculators {
            ...AdjustmentOperation
        }
    }
    ${ADJUSTMENT_OPERATION_FRAGMENT}
`;

export const CREATE_SHIPPING_METHOD = gql`
    mutation CreateShippingMethod($input: CreateShippingMethodInput!) {
        createShippingMethod(input: $input) {
            ...ShippingMethod
        }
    }
    ${SHIPPING_METHOD_FRAGMENT}
`;

export const UPDATE_SHIPPING_METHOD = gql`
    mutation UpdateShippingMethod($input: UpdateShippingMethodInput!) {
        updateShippingMethod(input: $input) {
            ...ShippingMethod
        }
    }
    ${SHIPPING_METHOD_FRAGMENT}
`;
