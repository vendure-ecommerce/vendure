import { api } from '@/graphql/api.js';
import { ResultOf, graphql } from '@/graphql/graphql.js';
import { useMutation, useQuery } from '@tanstack/react-query';
import * as React from 'react';

export interface AuthContext {
    status: 'authenticated' | 'verifying' | 'unauthenticated';
    authenticationError?: string;
    isAuthenticated: boolean;
    login: (username: string, password: string, onSuccess?: () => void) => void;
    logout: (onSuccess?: () => void) => Promise<void>;
    user: ResultOf<typeof ActiveAdministratorQuery>['activeAdministrator'] | undefined;
}

const LoginMutation = graphql(`
    mutation Login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            __typename
            ... on CurrentUser {
                id
                identifier
            }
            ... on ErrorResult {
                message
                errorCode
            }
        }
    }
`);

const LogOutMutation = graphql(`
    mutation LogOut {
        logout {
            success
        }
    }
`);

const CurrentUserQuery = graphql(`
    query CurrentUser {
        me {
            id
            identifier
            channels {
                id
                token
                code
                permissions
            }
        }
    }
`);

const ActiveAdministratorQuery = graphql(`
    query ActiveAdministrator {
        activeAdministrator {
            id
            firstName
            lastName
            emailAddress
        }
    }
`);

const AuthContext = React.createContext<AuthContext | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [status, setStatus] = React.useState<AuthContext['status']>('verifying');
    const [authenticationError, setAuthenticationError] = React.useState<string | undefined>();
    const onLoginSuccessFn = React.useRef<() => void>(() => {});
    const onLogoutSuccessFn = React.useRef<() => void>(() => {});
    const isAuthenticated = status === 'authenticated';

    const { data: currentUserData, isLoading } = useQuery({
        queryKey: ['currentUser'],
        queryFn: () => api.query(CurrentUserQuery),
        retry: false,
    });

    const { data: administratorData, isLoading: isAdministratorLoading } = useQuery({
        queryKey: ['administrator'],
        queryFn: () => api.query(ActiveAdministratorQuery),
    });

    const loginMutationFn = api.mutate(LoginMutation);
    const loginMutation = useMutation({
        mutationFn: loginMutationFn,
        onSuccess: async data => {
            if (data.login.__typename === 'CurrentUser') {
                setStatus('authenticated');
                onLoginSuccessFn.current();
            } else {
                setAuthenticationError(data?.login.message);
                setStatus('unauthenticated');
            }
        },
        onError: error => {
            setAuthenticationError(error.message);
            setStatus('unauthenticated');
        },
    });

    const logoutMutationFn = api.mutate(LogOutMutation);
    const logoutMutation = useMutation({
        mutationFn: logoutMutationFn,
        onSuccess: async data => {
            console.log(data);
            if (data?.logout.success === true) {
                setStatus('unauthenticated');
                onLogoutSuccessFn.current();
            }
        },
    });

    const logout = React.useCallback(async (onLogoutSuccess?: () => void) => {
        logoutMutation.mutate({});
        onLogoutSuccessFn.current = onLogoutSuccess || (() => {});
    }, []);

    const login = React.useCallback((username: string, password: string, onLoginSuccess?: () => void) => {
        setStatus('verifying');
        onLoginSuccessFn.current = onLoginSuccess || (() => {});
        loginMutation.mutate({ username, password });
    }, []);

    React.useEffect(() => {
        if (!isLoading) {
            if (currentUserData?.me?.id) {
                setStatus('authenticated');
            } else {
                setStatus('unauthenticated');
            }
        } else {
            setStatus('verifying');
        }
    }, [isLoading, currentUserData]);

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                authenticationError,
                status,
                user: administratorData?.activeAdministrator,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
