import { InMemoryCache } from 'apollo-cache-inmemory';

import {
    GetNetworkStatus,
    GetUiState,
    GetUserStatus,
    LanguageCode,
    SetActiveChannel,
    SetAsLoggedIn,
    SetUiLanguage,
    UpdateUserChannels,
    UserStatus,
} from '../../common/generated-types';
import { GET_NEWTORK_STATUS, GET_USER_STATUS } from '../definitions/client-definitions';

export type ResolverContext = {
    cache: InMemoryCache;
    optimisticResponse: any;
    getCacheKey: (storeObj: any) => string;
};

export type ResolverDefinition = {
    Mutation: {
        [name: string]: (rootValue: any, args: any, context: ResolverContext, info?: any) => any;
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
            const {
                input: { username, loginTime, channels, activeChannelId },
            } = args;
            // tslint:disable-next-line:no-non-null-assertion
            const permissions = channels.find(c => c.id === activeChannelId)!.permissions;
            const data: { userStatus: UserStatus } = {
                userStatus: {
                    __typename: 'UserStatus',
                    username,
                    loginTime,
                    isLoggedIn: true,
                    permissions,
                    channels,
                    activeChannelId,
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
                    permissions: [],
                    channels: [],
                    activeChannelId: null,
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
        setActiveChannel: (_, args: SetActiveChannel.Variables, { cache }): UserStatus => {
            // tslint:disable-next-line:no-non-null-assertion
            const previous = cache.readQuery<GetUserStatus.Query>({ query: GET_USER_STATUS })!;
            const activeChannel = previous.userStatus.channels.find(c => c.id === args.channelId);
            if (!activeChannel) {
                throw new Error('setActiveChannel: Could not find Channel with ID ' + args.channelId);
            }
            const permissions = activeChannel.permissions;
            const data: { userStatus: Partial<UserStatus> } = {
                userStatus: {
                    __typename: 'UserStatus',
                    permissions,
                    activeChannelId: activeChannel.id,
                },
            };
            cache.writeData({ data });
            return { ...previous.userStatus, ...data.userStatus };
        },
        updateUserChannels: (_, args: UpdateUserChannels.Variables, { cache }): UserStatus => {
            // tslint:disable-next-line:no-non-null-assertion
            const previous = cache.readQuery<GetUserStatus.Query>({ query: GET_USER_STATUS })!;
            const data = {
                userStatus: {
                    __typename: 'UserStatus' as const,
                    channels: args.channels,
                },
            };
            cache.writeData({ data });
            return { ...previous.userStatus, ...data.userStatus };
        },
    },
};

function updateRequestsInFlight(cache: InMemoryCache, increment: 1 | -1): number {
    const previous = cache.readQuery<GetNetworkStatus.Query>({ query: GET_NEWTORK_STATUS });
    const inFlightRequests = previous ? previous.networkStatus.inFlightRequests + increment : increment;
    const data: GetNetworkStatus.Query = {
        networkStatus: {
            __typename: 'NetworkStatus',
            inFlightRequests,
        },
    };
    cache.writeData({ data });
    return inFlightRequests;
}
