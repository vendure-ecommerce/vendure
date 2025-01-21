import gql from 'graphql-tag';
import { VendurePlugin } from '../vendure-plugin';
import { ChannelRolePermissionResolverStrategy } from './config/channel-role-permission-resolver-strategy';
import { ChannelRole } from './entities/channel-role.entity';
import { ChannelRoleService } from './services/channel-role.service';

@VendurePlugin({
    entities: [ChannelRole],
    providers: [ChannelRoleService],
    configuration: config => {
        config.authOptions.rolePermissionResolverStrategy = new ChannelRolePermissionResolverStrategy();
        return config;
    },
    adminApiExtensions: {
        schema: gql`
            input ChannelRoleInput {
                roleId: ID!
                channelId: ID!
            }
            extend input CreateAdministratorInput {
                channelIds: [ChannelRoleInput!]!
            }
        `,
    },
})
export class ChannelRolePlugin {}
