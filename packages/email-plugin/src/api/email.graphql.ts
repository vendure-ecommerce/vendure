import { gql } from 'apollo-angular';
export const adminSchema = gql`
    extend type Query {
        availableEmailEventsForResend(input: AvailableEmailEventsForResendInput): [EmailEvent!]!
    }

    input AvailableEmailEventsForResendInput {
        entityType: String!
    }

    type EmailEvent {
        type: String!
        entityType: String!
    }

    extend type Mutation {
        resendEmailEvent(input: ResendEmailInput!): Boolean!
    }

    input ResendEmailInput {
        type: String!
        entityType: String!
        entityId: ID!
        languageCode: String
    }
`;
