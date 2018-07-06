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

export const LOG_IN = gql`
    mutation LogIn($username: String!, $loginTime: String!) {
        logIn(username: $username, loginTime: $loginTime) @client {
            username
            isLoggedIn
            loginTime
        }
    }
`;

export const LOG_OUT = gql`
    mutation LogOut {
        logOut @client {
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
