import { gql } from 'graphql-tag';

export const shopSchema = gql`
    type MolliePaymentIntentError {
        errorCode: String!
        message: String!
    }
    type MolliePaymentIntent {
        url: String!
    }
    union MolliePaymentIntentResult = MolliePaymentIntent | MolliePaymentIntentError
    input MolliePaymentIntentInput {
        paymentMethodCode: String!
    }
    extend type Mutation {
        createMolliePaymentIntent(input: MolliePaymentIntentInput!): MolliePaymentIntentResult!
    }
`;
