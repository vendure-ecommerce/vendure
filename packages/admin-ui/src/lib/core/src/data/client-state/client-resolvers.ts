import { InMemoryCache } from '@apollo/client/core';

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
import { GET_NEWTORK_STATUS, GET_UI_STATE, GET_USER_STATUS } from '../definitions/client-definitions';

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
            cache.writeQuery({ query: GET_USER_STATUS, data });
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
            cache.writeQuery({ query: GET_USER_STATUS, data });
            return data.userStatus;
        },
        setUiLanguage: (_, args: SetUiLanguage.Variables, { cache }): LanguageCode => {
            const data: GetUiState.Query = {
                uiState: {
                    __typename: 'UiState',
                    language: args.languageCode,
                },
            };
            cache.writeQuery({ query: GET_UI_STATE, data });
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
            const data: { userStatus: UserStatus } = {
                userStatus: {
                    ...previous.userStatus,
                    permissions,
                    activeChannelId: activeChannel.id,
                },
            };
            cache.writeQuery({ query: GET_USER_STATUS, data });
            return data.userStatus;
        },
        updateUserChannels: (_, args: UpdateUserChannels.Variables, { cache }): UserStatus => {
            // tslint:disable-next-line:no-non-null-assertion
            const previous = cache.readQuery<GetUserStatus.Query>({ query: GET_USER_STATUS })!;
            const data = {
                userStatus: {
                    ...previous.userStatus,
                    channels: args.channels,
                },
            };
            cache.writeQuery({ query: GET_USER_STATUS, data });
            return data.userStatus;
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
    cache.writeQuery({ query: GET_NEWTORK_STATUS, data });
    return inFlightRequests;
}
