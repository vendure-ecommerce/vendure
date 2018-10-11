import gql from 'graphql-tag';

export const COUNTRY_FRAGMENT = gql`
    fragment Country on Country {
        id
        code
        name
        enabled
    }
`;

export const GET_COUNTRY_LIST = gql`
    query GetCountryList($options: CountryListOptions) {
        countries(options: $options) {
            items {
                ...Country
            }
            totalItems
        }
    }
    ${COUNTRY_FRAGMENT}
`;

export const GET_COUNTRY = gql`
    query GetCountry($id: ID!) {
        country(id: $id) {
            ...Country
        }
    }
    ${COUNTRY_FRAGMENT}
`;

export const CREATE_COUNTRY = gql`
    mutation CreateCountry($input: CreateCountryInput!) {
        createCountry(input: $input) {
            ...Country
        }
    }
    ${COUNTRY_FRAGMENT}
`;

export const UPDATE_COUNTRY = gql`
    mutation UpdateCountry($input: UpdateCountryInput!) {
        updateCountry(input: $input) {
            ...Country
        }
    }
    ${COUNTRY_FRAGMENT}
`;

export const ZONE_FRAGMENT = gql`
    fragment Zone on Zone {
        id
        name
        members {
            ...Country
        }
    }
    ${COUNTRY_FRAGMENT}
`;

export const GET_ZONES = gql`
    query GetZones {
        zones {
            ...Zone
        }
    }
    ${ZONE_FRAGMENT}
`;

export const GET_ZONE = gql`
    query GetZone($id: ID!) {
        zone(id: $id) {
            ...Zone
        }
    }
    ${ZONE_FRAGMENT}
`;

export const CREATE_ZONE = gql`
    mutation CreateZone($input: CreateZoneInput!) {
        createZone(input: $input) {
            ...Zone
        }
    }
    ${ZONE_FRAGMENT}
`;

export const UPDATE_ZONE = gql`
    mutation UpdateZone($input: UpdateZoneInput!) {
        updateZone(input: $input) {
            ...Zone
        }
    }
    ${ZONE_FRAGMENT}
`;

export const ADD_MEMBERS_TO_ZONE = gql`
    mutation AddMembersToZone($zoneId: ID!, $memberIds: [ID!]!) {
        addMembersToZone(zoneId: $zoneId, memberIds: $memberIds) {
            ...Zone
        }
    }
    ${ZONE_FRAGMENT}
`;

export const REMOVE_MEMBERS_FROM_ZONE = gql`
    mutation RemoveMembersFromZone($zoneId: ID!, $memberIds: [ID!]!) {
        removeMembersFromZone(zoneId: $zoneId, memberIds: $memberIds) {
            ...Zone
        }
    }
    ${ZONE_FRAGMENT}
`;
