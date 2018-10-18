import { InMemoryCache } from 'apollo-cache-inmemory';
import { GraphQLFieldResolver } from 'graphql';
import {
    GetNetworkStatus,
    GetUiState,
    GetUserStatus,
    LanguageCode,
    SetAsLoggedIn,
    SetUiLanguage,
} from 'shared/generated-types';

import { GET_NEWTORK_STATUS } from '../definitions/client-definitions';

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
        setAsLoggedIn: (_, args: SetAsLoggedIn.Variables, { cache }): GetUserStatus.UserStatus => {
            const { username, loginTime } = args;
            const data: GetUserStatus.Query = {
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
        setAsLoggedOut: (_, args, { cache }): GetUserStatus.UserStatus => {
            const data: GetUserStatus.Query = {
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
        setUiLanguage: (_, args: SetUiLanguage.Variables, { cache }): LanguageCode => {
            const data: GetUiState.Query = {
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
    const previous = cache.readQuery<GetNetworkStatus.Query>({ query: GET_NEWTORK_STATUS });
    const inFlightRequests = previous.networkStatus.inFlightRequests + increment;
    const data: GetNetworkStatus.Query = {
        networkStatus: {
            __typename: 'NetworkStatus',
            inFlightRequests,
        },
    };
    cache.writeData({ data });
    return inFlightRequests;
}
