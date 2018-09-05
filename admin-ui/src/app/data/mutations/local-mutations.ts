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
    mutation SetAsLoggedIn($username: String!, $loginTime: String!) {
        setAsLoggedIn(username: $username, loginTime: $loginTime) @client {
            username
            isLoggedIn
            loginTime
        }
    }
`;

export const SET_AS_LOGGED_OUT = gql`
    mutation SetAsLoggedOut {
        setAsLoggedOut @client {
            username
            isLoggedIn
            loginTime
        }
    }
`;

export const SET_UI_LANGUAGE = gql`
    mutation SetUiLanguage($languageCode: LanguageCode!) {
        setUiLanguage(languageCode: $languageCode) @client
    }
`;
