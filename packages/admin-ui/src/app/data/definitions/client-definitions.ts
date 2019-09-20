import gql from 'graphql-tag';

export const REQUEST_STARTED = gql`
    mutation RequestStarted {
        requestStarted @client
    }
`;

export const REQUEST_COMPLETED = gql`
    mutation RequestCompleted {
        requestCompleted @client
    }
`;

export const SET_AS_LOGGED_IN = gql`
    mutation SetAsLoggedIn($username: String!, $loginTime: String!, $permissions: [String!]!) {
        setAsLoggedIn(username: $username, loginTime: $loginTime, permissions: $permissions) @client {
            username
            isLoggedIn
            loginTime
            permissions
        }
    }
`;

export const SET_AS_LOGGED_OUT = gql`
    mutation SetAsLoggedOut {
        setAsLoggedOut @client {
            username
            isLoggedIn
            loginTime
            permissions
        }
    }
`;

export const SET_UI_LANGUAGE = gql`
    mutation SetUiLanguage($languageCode: LanguageCode!) {
        setUiLanguage(languageCode: $languageCode) @client
    }
`;

export const GET_NEWTORK_STATUS = gql`
    query GetNetworkStatus {
        networkStatus @client {
            inFlightRequests
        }
    }
`;

export const GET_USER_STATUS = gql`
    query GetUserStatus {
        userStatus @client {
            username
            isLoggedIn
            loginTime
            permissions
        }
    }
`;

export const GET_UI_STATE = gql`
    query GetUiState {
        uiState @client {
            language
        }
    }
`;
