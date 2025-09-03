import { Injectable } from '@nestjs/common';
import { DeletionResponse, DeletionResult } from '@vendure/common/lib/generated-types';
import { ID } from '@vendure/common/lib/shared-types';
import { unique } from '@vendure/common/lib/unique';

import { RequestContext } from '../../api';
import { TransactionalConnection } from '../../connection';
import { Channel, Role, User } from '../../entity';
import { ChannelRole } from '../../entity/role/channel-role.entity';
import { CustomFieldRelationService } from '../helpers/custom-field-relation/custom-field-relation.service';
import { UserChannelPermissions } from '../helpers/utils/get-user-channels-permissions';

/**
 * @description
 * Contains methods relating to {@link ChannelRole} entities.
 *
 * @todo TODO
 *
 * @docsCategory services
 */
@Injectable()
export class ChannelRoleService {
    constructor(
        private connection: TransactionalConnection,
        private customFieldRelationService: CustomFieldRelationService,
    ) {}

    /**
     * @throws EntityNotFoundError
     */
    async create(
        ctx: RequestContext,
        input: { userId: ID; channelId: ID; roleId: ID }, // TODO type
    ): Promise<ChannelRole> {
        const [user, channel, role] = await Promise.all([
            this.connection.getEntityOrThrow(ctx, User, input.userId),
            this.connection.getEntityOrThrow(ctx, Channel, input.channelId),
            this.connection.getEntityOrThrow(ctx, Role, input.roleId),
        ]);
        const entity = new ChannelRole({
            user,
            channel,
            role,
        });

        const newChannelRole = this.connection.getRepository(ctx, ChannelRole).save(entity);

        // TODO After stuff works and type generation
        // await this.customFieldRelationService.updateRelations(ctx, Channel, input, newChannelRole);

        return newChannelRole;
    }

    /**
     * @throws EntityNotFoundError
     */
    async update(
        ctx: RequestContext,
        input: { id: ID; userId: ID; channelId: ID; roleId: ID },
    ): Promise<ChannelRole> {
        const [channelRole, user, channel, role] = await Promise.all([
            this.connection.getEntityOrThrow(ctx, ChannelRole, input.id),
            this.connection.getEntityOrThrow(ctx, User, input.userId),
            this.connection.getEntityOrThrow(ctx, Channel, input.channelId),
            this.connection.getEntityOrThrow(ctx, Role, input.roleId),
        ]);

        channelRole.user = user;
        channelRole.channel = channel;
        channelRole.role = role;

        // TODO custom fields

        return this.connection.getRepository(ctx, ChannelRole).save(channelRole);
    }

    /**
     * @throws EntityNotFoundError
     */
    async delete(ctx: RequestContext, id: ID): Promise<DeletionResponse> {
        const channelRole = await this.connection.getEntityOrThrow(ctx, ChannelRole, id);
        try {
            await this.connection.getRepository(ctx, ChannelRole).remove(channelRole);
            return {
                result: DeletionResult.DELETED,
            };
        } catch (e: any) {
            return {
                result: DeletionResult.NOT_DELETED,
                message: e.message,
            };
        }
    }

    /**
     * Users can have multiple roles on the same channel. This function merges
     * all the unique permissions into a contiguous array to enable convenient permission checks.
     */
    async getMergedPermissionsPerChannel(activeUserId: ID): Promise<UserChannelPermissions[]> {
        const channelRoleEntries = await this.connection.rawConnection.getRepository(ChannelRole).find({
            where: { userId: activeUserId },
            relations: ['channel', 'role'],
        });

        // First merge all permissions by channel
        const map = new Map<ID, UserChannelPermissions>();

        for (const entry of channelRoleEntries) {
            const item = map.get(entry.channelId);
            if (!item) {
                map.set(entry.channelId, {
                    id: entry.channelId,
                    code: entry.channel.code,
                    token: entry.channel.token,
                    permissions: entry.role.permissions,
                });
            } else {
                item.permissions.push(...entry.role.permissions);
            }
        }

        // Filter out duplicates
        for (const item of map.values()) {
            item.permissions = unique(item.permissions);
        }

        // eslint-disable-next-line max-len
        // Sorting to have same behavior, see https://github.com/vendure-ecommerce/vendure/commit/71b8f4cb944e8967206235c3ef1a4bf0aa36ef57#diff-f094d80e8041fc0c9be6dfcdf711415e6b1577e72a6efe55ef1579d885fa28b1
        // TODO should check if thats actually necessary anymore
        return Array.from(map.values()).sort((a, b) => (a.id < b.id ? -1 : 1));
    }
}
