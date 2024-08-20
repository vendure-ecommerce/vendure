import gql from 'graphql-tag';
export const adminSchema = gql`
    enum EmailEventEntities {
        Customer
        Order
    }

    type EmailEvent {
        type: String!
        entityType: EmailEventEntities!
    }

    input AvailableEmailEvents {
        entityType: EmailEventEntities!
        entityId: ID!
    }

    extend type Query {
        availableEmailEventsForResend(input: AvailableEmailEvents!): [EmailEvent!]!
    }

    input ResendEmailInput {
        type: String!
        entityType: EmailEventEntities!
        entityId: ID!
        languageCode: String
    }

    extend type Mutation {
        resendEmailEvent(input: ResendEmailInput!): Boolean!
    }
`;
