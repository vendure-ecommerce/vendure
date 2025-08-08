import { Injectable } from '@nestjs/common';
import { DeletionResponse, DeletionResult } from '@vendure/common/lib/generated-types';
import { ID } from '@vendure/common/lib/shared-types';

import { RequestContext } from '../../../api/index';
import { TransactionalConnection } from '../../../connection/index';
import { Channel, Role, User } from '../../../entity';
import { ChannelRole } from '../entities/channel-role.entity';

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
    constructor(private connection: TransactionalConnection) {}

    /**
     * @throws EntityNotFoundError
     */
    async create(
        ctx: RequestContext,
        input: { userId: ID; channelId: ID; roleId: ID },
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

        // TODO custom fields ???

        return this.connection.getRepository(ctx, ChannelRole).save(entity);
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

        // TODO Dont quite remember if the promise all returned the first error
        // Check it out a lil later. Would be nice to show which entity specifically failed

        channelRole.user = user;
        channelRole.channel = channel;
        channelRole.role = role;

        // TODO custom fields ???

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
}
