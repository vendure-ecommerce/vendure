import { Permission } from '@vendure/common/lib/generated-types';
import { ID } from '@vendure/common/lib/shared-types';
import { unique } from '@vendure/common/lib/unique';

import { Channel } from '../../../entity/channel/channel.entity';
import { Role } from '../../../entity/role/role.entity';
import { User } from '../../../entity/user/user.entity';

export interface UserChannelPermissions {
    id: ID;
    token: string;
    code: string;
    permissions: Permission[];
}

/**
 * Returns an array of Channels and permissions on those Channels for the given User.
 */
export function getUserChannelsPermissions(user: User): UserChannelPermissions[] {
    return getChannelPermissions(user.roles, user.channels);
}

/**
 * @description
 * Returns an array of Channels and permissions on those Channels for the given Roles.
 * If `userChannels` is non-empty, access is restricted to exactly those Channels (the
 * Channels of the Roles are ignored) and the permissions of all Roles apply on each of them.
 */
export function getChannelPermissions(roles: Role[], userChannels?: Channel[]): UserChannelPermissions[] {
    const channelsMap: { [code: string]: UserChannelPermissions } = {};

    for (const role of roles) {
        for (const channel of userChannels?.length ? userChannels : role.channels) {
            if (!channelsMap[channel.code]) {
                channelsMap[channel.code] = {
                    id: channel.id,
                    token: channel.token,
                    code: channel.code,
                    permissions: [],
                };
            }
            channelsMap[channel.code].permissions = unique([
                ...channelsMap[channel.code].permissions,
                ...role.permissions,
            ]);
        }
    }

    return Object.values(channelsMap).sort((a, b) => (a.id < b.id ? -1 : 1));
}
