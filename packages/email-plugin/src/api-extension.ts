import gql from 'graphql-tag';
export const adminSchema = gql`
    type EmailEventConfigArgDefinition {
        name: String!
        type: String!
        list: Boolean!
        required: Boolean!
        defaultValue: JSON
        label: String
        description: String
        ui: JSON
    }

    type EmailEventConfigurableOperationDefinition {
        args: [EmailEventConfigArgDefinition!]!
        description: String!
    }

    type EmailEvent {
        type: String!
        entityType: String!
        label: [LocalizedString!]!
        description: [LocalizedString!]
        operationDefinitions: EmailEventConfigurableOperationDefinition
    }

    extend type Query {
        emailEventsForResend(entityType: String!, entityId: ID!): [EmailEvent!]!
    }

    input EmailEventConfigArgInput {
        name: String!
        "A JSON stringified representation of the actual value"
        value: String!
    }

    type EmailEventConfigArg {
        name: String!
        "A JSON stringified representation of the actual value"
        value: String!
    }

    input ResendEmailInput {
        type: String!
        entityType: String!
        entityId: ID!
        arguments: [EmailEventConfigArgInput!]!
    }

    extend type Mutation {
        resendEmailEvent(input: ResendEmailInput!): Boolean!
    }
`;
