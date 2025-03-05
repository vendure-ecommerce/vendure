import { Injectable } from '@nestjs/common';
import { ID } from '@vendure/common/lib/shared-types';

import { RequestContext } from '../../../api/index';
import { TransactionalConnection } from '../../../connection/index';

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

    async create(ctx: RequestContext, input: { userId: ID; channelId: ID; roleId: ID }) {
        throw new Error('Not implemented by daniel yet');
    }

    async delete(ctx: RequestContext, id: ID) {
        throw new Error('Not implemented by daniel yet');
    }
}
