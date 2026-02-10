import { Injectable } from '@nestjs/common';
import { ID } from '@vendure/common/lib/shared-types';
import { unique } from '@vendure/common/lib/unique';

import { RequestContext } from '../../api/common/request-context';
import { Instrument } from '../../common/instrument-decorator';
import { TransactionalConnection } from '../../connection/transactional-connection';
import { Channel } from '../../entity/channel/channel.entity';
import { ChannelRole } from '../../entity/role/channel-role.entity';
import { Role } from '../../entity/role/role.entity';
import { User } from '../../entity/user/user.entity';
import { UserChannelPermissions } from '../helpers/utils/get-user-channels-permissions';

/**
 * @description
 * Contains methods relating to {@link ChannelRole} entities.
 *
 * @docsCategory services
 * @since 3.3.0
 */
@Injectable()
@Instrument()
export class ChannelRoleService {
    constructor(private connection: TransactionalConnection) {}

    /**
     * @description
     * Creates a new ChannelRole association.
     */
    async create(
        ctx: RequestContext,
        input: { userId: ID; channelId: ID; roleId: ID },
    ): Promise<ChannelRole> {
        const user = await this.connection.getEntityOrThrow(ctx, User, input.userId);
        const channel = await this.connection.getEntityOrThrow(ctx, Channel, input.channelId);
        const role = await this.connection.getEntityOrThrow(ctx, Role, input.roleId);

        const channelRole = new ChannelRole({
            user,
            channel,
            role,
        });
        return this.connection.getRepository(ctx, ChannelRole).save(channelRole);
    }

    /**
     * @description
     * Deletes a ChannelRole association by id.
     */
    async delete(ctx: RequestContext, id: ID): Promise<void> {
        const channelRole = await this.connection.getEntityOrThrow(ctx, ChannelRole, id);
        await this.connection.getRepository(ctx, ChannelRole).remove(channelRole);
    }

    /**
     * @description
     * Returns all ChannelRole entries for a given User.
     */
    async findByUserId(ctx: RequestContext, userId: ID): Promise<ChannelRole[]> {
        return this.connection.getRepository(ctx, ChannelRole).find({
            where: { user: { id: userId } },
            relations: ['channel', 'role'],
        });
    }

    /**
     * @description
     * Returns all ChannelRole entries for a given User id, loading the channel
     * and role relations. This version works without a RequestContext and
     * uses the raw connection.
     */
    async findByUserIdRaw(userId: ID): Promise<ChannelRole[]> {
        return this.connection.rawConnection.getRepository(ChannelRole).find({
            where: { user: { id: userId } },
            relations: ['channel', 'role'],
        });
    }

    /**
     * @description
     * Aggregates permissions grouped by channel for a given User,
     * based on their ChannelRole entries.
     */
    async getMergedPermissionsPerChannel(
        ctx: RequestContext | undefined,
        userId: ID,
    ): Promise<UserChannelPermissions[]> {
        const channelRoles = ctx ? await this.findByUserId(ctx, userId) : await this.findByUserIdRaw(userId);

        const channelsMap: Record<string, UserChannelPermissions> = {};

        for (const cr of channelRoles) {
            const { channel, role } = cr;
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

        return Object.values(channelsMap).sort((a, b) => (a.id < b.id ? -1 : 1));
    }

    /**
     * @description
     * Replaces all ChannelRole entries for a given User with the provided set.
     */
    async setChannelRolesForUser(
        ctx: RequestContext,
        userId: ID,
        channelRoles: Array<{ channelId: ID; roleId: ID }>,
    ): Promise<ChannelRole[]> {
        // Remove existing channel-role entries for this user
        const existing = await this.findByUserId(ctx, userId);
        if (existing.length) {
            await this.connection.getRepository(ctx, ChannelRole).remove(existing);
        }

        // Create new entries
        const results: ChannelRole[] = [];
        for (const cr of channelRoles) {
            const created = await this.create(ctx, {
                userId,
                channelId: cr.channelId,
                roleId: cr.roleId,
            });
            results.push(created);
        }
        return results;
    }
}
