import { InMemoryCache } from 'apollo-cache-inmemory';
import { GraphQLFieldResolver } from 'graphql';
import {
    GetNetworkStatus,
    GetUiState,
    GetUserStatus,
    GetUserStatus_userStatus,
    LanguageCode,
    SetAsLoggedInVariables,
    SetUiLanguageVariables,
} from 'shared/generated-types';

import { GET_NEWTORK_STATUS } from '../definitions/local-definitions';

export type ResolverContext = {
    cache: InMemoryCache;
    optimisticResponse: any;
    getCacheKey: (storeObj: any) => string;
};

export type ResolverDefinition = {
    Mutation: {
        [name: string]: GraphQLFieldResolver<any, ResolverContext, any>;
    };
};

export const clientResolvers: ResolverDefinition = {
    Mutation: {
        requestStarted: (_, args, { cache }): number => {
            return updateRequestsInFlight(cache, 1);
        },
        requestCompleted: (_, args, { cache }): number => {
            return updateRequestsInFlight(cache, -1);
        },
        setAsLoggedIn: (_, args: SetAsLoggedInVariables, { cache }): GetUserStatus_userStatus => {
            const { username, loginTime } = args;
            const data: GetUserStatus = {
                userStatus: {
                    __typename: 'UserStatus',
                    username,
                    loginTime,
                    isLoggedIn: true,
                },
            };
            cache.writeData({ data });
            return data.userStatus;
        },
        setAsLoggedOut: (_, args, { cache }): GetUserStatus_userStatus => {
            const data: GetUserStatus = {
                userStatus: {
                    __typename: 'UserStatus',
                    username: '',
                    loginTime: '',
                    isLoggedIn: false,
                },
            };
            cache.writeData({ data });
            return data.userStatus;
        },
        setUiLanguage: (_, args: SetUiLanguageVariables, { cache }): LanguageCode => {
            const data: GetUiState = {
                uiState: {
                    __typename: 'UiState',
                    language: args.languageCode,
                },
            };
            cache.writeData({ data });
            return args.languageCode;
        },
    },
};

function updateRequestsInFlight(cache: InMemoryCache, increment: 1 | -1): number {
    const previous = cache.readQuery<GetNetworkStatus>({ query: GET_NEWTORK_STATUS });
    const inFlightRequests = previous.networkStatus.inFlightRequests + increment;
    const data: GetNetworkStatus = {
        networkStatus: {
            __typename: 'NetworkStatus',
            inFlightRequests,
        },
    };
    cache.writeData({ data });
    return inFlightRequests;
}
