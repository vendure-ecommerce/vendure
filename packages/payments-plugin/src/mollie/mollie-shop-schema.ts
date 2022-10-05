import { gql } from 'graphql-tag';

export const shopSchema = gql`
    type MolliePaymentIntentError implements ErrorResult {
        errorCode: ErrorCode!
        message: String!
    }
    type MollieAmount {
        value: String
        currency: String
    }
    type MolliePaymentMethodImages {
        size1x: String
        size2x: String
        svg: String
    }
    type MolliePaymentMethod {
        id: ID!
        code: String!
        description: String
        minimumAmount: MollieAmount
        maximumAmount: MollieAmount
        image: MolliePaymentMethodImages
    }
    type MolliePaymentIntent {
        url: String!
    }
    union MolliePaymentIntentResult = MolliePaymentIntent | MolliePaymentIntentError
    input MolliePaymentIntentInput {
        paymentMethodCode: String!
        """
        The molliePaymentMethod can be found using the 'code' field of one of the methods from the query 'molliePaymentMethods'
        """
        molliePaymentMethodCode: String
    }
    input MolliePaymentMethodsInput {
        paymentMethodCode: String!
    }
    extend type Mutation {
        createMolliePaymentIntent(input: MolliePaymentIntentInput!): MolliePaymentIntentResult!
    }
    extend type Query {
        molliePaymentMethods(input: MolliePaymentMethodsInput!): [MolliePaymentMethod!]!
    }
`;
