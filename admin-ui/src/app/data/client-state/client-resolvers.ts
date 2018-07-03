import { InMemoryCache } from 'apollo-cache-inmemory';
import { GraphQLFieldResolver } from 'graphql';
import { GET_NEWTORK_STATUS } from '../queries/local-queries';
import {
    GetNetworkStatus,
    GetUserStatus,
    GetUserStatus_userStatus,
    LogInVariables,
    RequestStarted,
} from '../types/gql-generated-types';

export type ResolverContext = {
    cache: InMemoryCache;
    optimisticResponse: any;
    getCacheKey: (storeObj: any) => string;
};

export type ResolverDefinition = {
    Mutation: {
        [name: string]: GraphQLFieldResolver<any, ResolverContext, any>;
    },
};

export const clientResolvers: ResolverDefinition = {
    Mutation: {
        requestStarted: (_, args, { cache }): number => {
            return updateRequestsInFlight(cache, 1);
        },
        requestCompleted: (_, args, { cache }): number => {
            return updateRequestsInFlight(cache, -1);
        },
        logIn: (_, args: LogInVariables, { cache }): GetUserStatus_userStatus => {
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
        logOut: (_, args, { cache }): GetUserStatus_userStatus => {
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
