import { Injector } from '../../common';
import { TransactionalConnection } from '../../connection';
import { User } from '../../entity';
import { ChannelRole } from '../../entity/channel-role/channel-role';
import { UserChannelPermissions } from '../../service/helpers/utils/get-user-channels-permissions';

import { RolePermissionResolverStrategy } from './role-permission-resolver-strategy';

export class ChannelRolePermissionResolverStrategy implements RolePermissionResolverStrategy {
    private connection: TransactionalConnection;

    async init(injector: Injector) {
        this.connection = injector.get(TransactionalConnection);
    }

    async resolvePermissions(user: User): Promise<UserChannelPermissions[]> {
        console.log('---- BEGIN RESOLVE');
        const channelRoleEntries = await this.connection.rawConnection.getRepository(ChannelRole).find({
            where: { user: { id: user.id } },
            relations: ['user', 'channel', 'role'],
        });
        console.log('---- RESOLVE -- ENTRIES:', JSON.stringify(channelRoleEntries));

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
        console.log('---- RESOLVE -- OUTPUT:', channelRolePermissions);

        console.log('---- END RESOLVE');
        return channelRolePermissions;
    }
}
