import { Injector } from '../../common';
import { TransactionalConnection } from '../../connection';
import { User } from '../../entity';
import { ChannelRole } from '../../entity/channel-role/channel-role.entity';
import { UserChannelPermissions } from '../../service/helpers/utils/get-user-channels-permissions';

import { RolePermissionResolverStrategy } from './role-permission-resolver-strategy';

export class ChannelRolePermissionResolverStrategy implements RolePermissionResolverStrategy {
    private connection: TransactionalConnection;

    async init(injector: Injector) {
        this.connection = injector.get(TransactionalConnection);
    }

    async resolvePermissions(user: User): Promise<UserChannelPermissions[]> {
        const channelRoleEntries = await this.connection.rawConnection.getRepository(ChannelRole).find({
            where: { user: { id: user.id } },
            relations: ['user', 'channel', 'role'],
        });

        const channelRolePermissions = new Array<UserChannelPermissions>(channelRoleEntries.length);
        for (let i = 0; i < channelRoleEntries.length; i++) {
            channelRolePermissions[i] = {
                id: channelRoleEntries[i].channel.id,
                token: channelRoleEntries[i].channel.token,
                code: channelRoleEntries[i].channel.code,
                permissions: channelRoleEntries[i].role.permissions,
            };
        }
        channelRoleEntries.sort((a, b) => (a.id < b.id ? -1 : 1));

        return channelRolePermissions;
    }
}
