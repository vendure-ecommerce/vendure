import { DEFAULT_CHANNEL_CODE } from '@vendure/common/lib/shared-constants';

import { DataService } from '../../data/providers/data.service';

/**
 * @description
 * Resolves to an object containing the Channel code of the given channelId, or if no channelId
 * is supplied, the code of the activeChannel.
 */
export function getChannelCodeFromUserStatus(dataService: DataService, channelId?: string) {
    return dataService.client
        .userStatus()
        .mapSingle(({ userStatus }) => {
            const channelCode =
                userStatus.channels.find(c => c.id === (channelId ?? userStatus.activeChannelId))?.code ??
                'undefined';
            return { channelCode };
        })
        .toPromise();
}

/**
 * @description
 * Resolves to `true` if multiple Channels are set up.
 */
export function isMultiChannel(dataService: DataService) {
    return dataService.client
        .userStatus()
        .mapSingle(({ userStatus }) => 1 < userStatus.channels.length)
        .toPromise();
}

/**
 * @description
 * Resolves to `true` if the current active Channel is not the default Channel.
 */
export function currentChannelIsNotDefault(dataService: DataService) {
    return dataService.client
        .userStatus()
        .mapSingle(({ userStatus }) => {
            if (userStatus.channels.length === 1) {
                return false;
            }
            const defaultChannelId = userStatus.channels.find(c => c.code === DEFAULT_CHANNEL_CODE)?.id;
            return userStatus.activeChannelId !== defaultChannelId;
        })
        .toPromise();
}
