import { gql } from 'graphql-tag';

const commonSchemaExtensions = gql`

    input MolliePaymentIntentInput {
        """
        The code of the Vendure payment method to use for the payment.
        Must have Mollie as payment method handler.
        Without this, the first method with Mollie as handler will be used.
        """
        paymentMethodCode: String
        """
        The redirect url to which the customer will be redirected after the payment is completed.
        The configured fallback redirect will be used if this is not provided.
        """
        redirectUrl: String
        """
        Optional preselected Mollie payment method. When this is passed
        the payment selection step will be skipped.
        """
        molliePaymentMethodCode: String
        """
        Use this to create a payment intent for a specific order. This allows you to create intents for
        orders that are not active orders.
        """
        orderId: String
    }

    type MolliePaymentIntent {
        url: String!
    }

    type MolliePaymentIntentError implements ErrorResult {
        errorCode: ErrorCode!
        message: String!
    }

    union MolliePaymentIntentResult = MolliePaymentIntent | MolliePaymentIntentError

    extend type Mutation {
        createMolliePaymentIntent(input: MolliePaymentIntentInput!): MolliePaymentIntentResult!
    }

`;

export const shopApiExtensions = gql`

   ${commonSchemaExtensions}

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
        status: String
    }

    input MolliePaymentMethodsInput {
        paymentMethodCode: String!
    }

    extend type Query {
        molliePaymentMethods(input: MolliePaymentMethodsInput!): [MolliePaymentMethod!]!
    }
`;

export const adminApiExtensions = gql`
    
        ${commonSchemaExtensions}

        extend enum ErrorCode {
            ORDER_PAYMENT_STATE_ERROR
        }
`;
