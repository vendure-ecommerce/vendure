import gql from 'graphql-tag';

export const adminSchema = gql`
    type EmailEvent {
        type: String!
        entityType: String!
        label: [LocalizedString!]!
        description: [LocalizedString!]
        operationDefinitions: ConfigurableOperationDefinition
    }

    extend type Query {
        emailEventsForResend(entityType: String!, entityId: ID!): [EmailEvent!]!
    }

    input ResendEmailEventInput {
        type: String!
        entityType: String!
        entityId: ID!
        arguments: [ConfigArgInput!]!
    }

    extend type Mutation {
        resendEmailEvent(input: ResendEmailEventInput!): Boolean!
    }
`;
