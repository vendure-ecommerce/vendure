import gql from 'graphql-tag';

export const GET_SERVER_CONFIG = gql`
    query GetServerConfig {
        config {
            customFields
        }
    }
`;
