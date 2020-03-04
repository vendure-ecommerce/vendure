import gql from 'graphql-tag';

import { CONFIGURABLE_OPERATION_DEF_FRAGMENT, CONFIGURABLE_OPERATION_FRAGMENT } from './shared-definitions';

export const PROMOTION_FRAGMENT = gql`
    fragment Promotion on Promotion {
        id
        createdAt
        updatedAt
        name
        enabled
        couponCode
        perCustomerUsageLimit
        startsAt
        endsAt
        conditions {
            ...ConfigurableOperation
        }
        actions {
            ...ConfigurableOperation
        }
    }
    ${CONFIGURABLE_OPERATION_FRAGMENT}
`;

export const GET_PROMOTION_LIST = gql`
    query GetPromotionList($options: PromotionListOptions) {
        promotions(options: $options) {
            items {
                ...Promotion
            }
            totalItems
        }
    }
    ${PROMOTION_FRAGMENT}
`;

export const GET_PROMOTION = gql`
    query GetPromotion($id: ID!) {
        promotion(id: $id) {
            ...Promotion
        }
    }
    ${PROMOTION_FRAGMENT}
`;

export const GET_ADJUSTMENT_OPERATIONS = gql`
    query GetAdjustmentOperations {
        promotionConditions {
            ...ConfigurableOperationDef
        }
        promotionActions {
            ...ConfigurableOperationDef
        }
    }
    ${CONFIGURABLE_OPERATION_DEF_FRAGMENT}
`;

export const CREATE_PROMOTION = gql`
    mutation CreatePromotion($input: CreatePromotionInput!) {
        createPromotion(input: $input) {
            ...Promotion
        }
    }
    ${PROMOTION_FRAGMENT}
`;

export const UPDATE_PROMOTION = gql`
    mutation UpdatePromotion($input: UpdatePromotionInput!) {
        updatePromotion(input: $input) {
            ...Promotion
        }
    }
    ${PROMOTION_FRAGMENT}
`;

export const DELETE_PROMOTION = gql`
    mutation DeletePromotion($id: ID!) {
        deletePromotion(id: $id) {
            result
            message
        }
    }
`;
