import { Permission } from '@vendure/common/lib/generated-types';
import { describe, expect, it } from 'vitest';

import { Channel } from '../../../entity/channel/channel.entity';
import { Role } from '../../../entity/role/role.entity';
import { User } from '../../../entity/user/user.entity';

import { getChannelPermissions, getUserChannelsPermissions } from './get-user-channels-permissions';

const channel = (id: number, code: string) => new Channel({ id, code, token: `${code}-token` });
const role = (permissions: Permission[], channels: Channel[]) =>
    new Role({ code: 'r', description: '', permissions, channels });

describe('getChannelPermissions()', () => {
    const channelA = channel(1, 'A');
    const channelB = channel(2, 'B');

    it('uses role channels when no user channels are given', () => {
        const result = getChannelPermissions([role([Permission.ReadCatalog], [channelA])]);
        expect(result.map(c => c.code)).toEqual(['A']);
        expect(result[0].permissions).toEqual([Permission.ReadCatalog]);
    });

    it('uses role channels when user channels is an empty array', () => {
        const result = getChannelPermissions([role([Permission.ReadCatalog], [channelA])], []);
        expect(result.map(c => c.code)).toEqual(['A']);
    });

    it('uses role channels when user channels is undefined (not loaded)', () => {
        const user = new User({ roles: [role([Permission.ReadCatalog], [channelA])] });
        expect(getUserChannelsPermissions(user).map(c => c.code)).toEqual(['A']);
    });

    it('restricts to user channels and ignores role channels', () => {
        const result = getChannelPermissions([role([Permission.ReadCatalog], [channelA])], [channelB]);
        expect(result.map(c => c.code)).toEqual(['B']);
        expect(result[0].permissions).toEqual([Permission.ReadCatalog]);
    });

    it('unions the permissions of all roles on each user channel', () => {
        const result = getChannelPermissions(
            [
                role([Permission.ReadCatalog], [channelA]),
                role([Permission.UpdateCatalog], [channelA]),
            ],
            [channelB],
        );
        expect(result).toHaveLength(1);
        expect(result[0].permissions.sort()).toEqual(
            [Permission.ReadCatalog, Permission.UpdateCatalog].sort(),
        );
    });

    it('getUserChannelsPermissions passes user.channels through', () => {
        const user = new User({
            roles: [role([Permission.ReadCatalog], [channelA])],
            channels: [channelB],
        });
        expect(getUserChannelsPermissions(user).map(c => c.code)).toEqual(['B']);
    });
});
