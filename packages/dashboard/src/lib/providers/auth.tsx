import { api } from '@/graphql/api.js';
import { ResultOf, graphql } from '@/graphql/graphql.js';
import { useUserSettings } from '@/hooks/use-user-settings.js';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import * as React from 'react';

/**
 * @description
 * **Status: Developer Preview**
 *
 * @docsCategory hooks
 * @docsPage useAuth
 * @docsWeight 0
 * @since 3.3.0
 */
export interface AuthContext {
    status: 'authenticated' | 'verifying' | 'unauthenticated';
    authenticationError?: string;
    isAuthenticated: boolean;
    login: (username: string, password: string, onSuccess?: () => void) => void;
    logout: (onSuccess?: () => void) => Promise<void>;
    user: ResultOf<typeof CurrentUserQuery>['activeAdministrator'] | undefined;
    channels: NonNullable<ResultOf<typeof CurrentUserQuery>['me']>['channels'] | undefined;
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
    query CurrentUserInformation {
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
        activeAdministrator {
            id
            firstName
            lastName
            emailAddress
        }
    }
`);

export const AuthContext = React.createContext<AuthContext | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [status, setStatus] = React.useState<AuthContext['status']>('unauthenticated');
    const [authenticationError, setAuthenticationError] = React.useState<string | undefined>();
    const { settings, setActiveChannelId } = useUserSettings();
    const queryClient = useQueryClient();

    // Query for current user
    const {
        data: currentUserData,
        isLoading,
        error: currentUserError,
        refetch: refetchCurrentUser,
    } = useQuery({
        queryKey: ['currentUser'],
        queryFn: () => api.query(CurrentUserQuery),
    });

    // Set active channel if needed
    React.useEffect(() => {
        if (!settings.activeChannelId && currentUserData?.me?.channels?.length) {
            setActiveChannelId(currentUserData.me.channels[0].id);
        }
    }, [settings.activeChannelId, currentUserData?.me?.channels]);

    // Auth actions
    const login = React.useCallback(
        (username: string, password: string, onLoginSuccess?: () => void) => {
            setStatus('verifying');
            api.mutate(LoginMutation)({ username, password })
                .then(async data => {
                    if (data.login.__typename === 'CurrentUser') {
                        setAuthenticationError(undefined);
                        await refetchCurrentUser();
                        setStatus('authenticated');
                        onLoginSuccess?.();
                    } else {
                        setAuthenticationError(data?.login.message);
                        setStatus('unauthenticated');
                    }
                })
                .catch(error => {
                    setAuthenticationError(error.message);
                    setStatus('unauthenticated');
                });
        },
        [refetchCurrentUser],
    );

    const logout = React.useCallback(
        async (onLogoutSuccess?: () => void) => {
            setStatus('verifying');
            api.mutate(LogOutMutation)({}).then(async data => {
                if (data?.logout.success) {
                    queryClient.removeQueries({ queryKey: ['currentUser'] });
                    setStatus('unauthenticated');
                    onLogoutSuccess?.();
                }
            });
        },
        [refetchCurrentUser],
    );

    // Determine isAuthenticated from currentUserData
    const isAuthenticated = !!currentUserData?.me?.id;

    // Set status based on query result (only if not in the middle of login/logout)
    React.useEffect(() => {
        if (status === 'verifying') return;
        if (currentUserError || !currentUserData?.me?.id) {
            setStatus('unauthenticated');
        } else {
            setStatus('authenticated');
        }
    }, [currentUserData, currentUserError]);

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                authenticationError,
                status,
                user: currentUserData?.activeAdministrator,
                channels: currentUserData?.me?.channels,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
