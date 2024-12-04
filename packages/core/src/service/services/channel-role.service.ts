import { Injectable } from '@nestjs/common';

import { TransactionalConnection } from '../../connection';

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
}
