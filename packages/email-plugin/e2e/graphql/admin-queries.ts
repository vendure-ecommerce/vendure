import gql from 'graphql-tag';

export const EMAIL_EVENT_FRAGMENT = gql`
    fragment EmailEvent on EmailEvent {
        type
        entityType
        label {
            languageCode
            value
        }
        description {
            languageCode
            value
        }
        operationDefinitions {
            code
            args {
                name
                type
                list
                required
                defaultValue
                label
                description
                ui
            }
            description
        }
    }
`;

export const GET_EMAIL_EVENTS_FOR_RESEND = gql`
    query GetEmailEventsForResend($entityType: String!, $entityId: ID!) {
        emailEventsForResend(entityType: $entityType, entityId: $entityId) {
            ...EmailEvent
        }
    }
    ${EMAIL_EVENT_FRAGMENT}
`;

export const RESEND_EMAIL_EVENT = gql`
    mutation ResendEmailEvent($input: ResendEmailEventInput!) {
        resendEmailEvent(input: $input)
    }
`;
