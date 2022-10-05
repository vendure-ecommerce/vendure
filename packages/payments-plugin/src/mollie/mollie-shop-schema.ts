import { gql } from 'graphql-tag';

export const shopSchema = gql`
    type MolliePaymentIntentError implements ErrorResult {
        errorCode: ErrorCode!
        message: String!
    }
    type MolliePaymentMethod {
        id: String!
    }
    type MolliePaymentIntent {
        url: String!
    }
    union MolliePaymentIntentResult = MolliePaymentIntent | MolliePaymentIntentError
    input MolliePaymentIntentInput {
        paymentMethodCode: String!
        molliePaymentMethod: String
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
