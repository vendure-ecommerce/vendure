import gql from 'graphql-tag';

export const GET_IN_FLIGHT_REQUESTS = gql`
    query GetInFlightRequests {
        network @client {
            inFlightRequests
        }
    }
`;
