import { Type } from '@vendure/common/lib/shared-types';
import gql from 'graphql-tag';

import { PluginCommonModule } from '../plugin-common.module';
import { VendurePlugin } from '../vendure-plugin';

import { ChannelRolePermissionResolverStrategy } from './config/channel-role-permission-resolver-strategy';
import { CHANNELROLE_PLUGIN_OPTIONS } from './constants';
import { ChannelRole } from './entities/channel-role.entity';
import { ChannelRoleResolver } from './resolvers/channel-role.resolver';
import { ChannelRoleService } from './services/channel-role.service';

export interface ChannelRoleOptions {}

/**
 * @description
 * This plugin extends the Admin-API and provides a {@link ChannelRolePermissionResolverStrategy} which
 * fundamentally changes how Vendure resolves {@link Permission}s for {@link User}s.
 *
 * By default with the included {@link DefaultRolePermissionResolverStrategy}
 * Vendure stores and resolves permissions by assigning {@link User}s
 * `N` {@link Role}s of which each role can relate to `M` {@link Channel}s.
 *
 * This works well, but it also means you cannot share roles between channels while restricting
 * your users exclusively to their own channel, because channels are tied to the role.
 *
 * Imagine a scenario where you have two users called `UserA`, `UserB`, two channels called
 * `ChannelA`, `ChannelB` and a `CatalogManager`-Role which has permissions for creating,
 * updating and deleting products. You want `UserA` to only be able to work on products that
 * belong to `ChannelA` and `UserB` should only be allowed to work on `ChannelB`.
 *
 * Sharing of a general `CatalogManager`-Role between these channels is not possible under the
 * default strategy because once you relate both channels to the role, both users will have
 * permissions to access each others channels, looking like so:
 *
 * ```
 * UserA ═══➤ CatalogManager ═╦═➤ ChannelA
 *                            ╚═➤ ChannelB
 * UserB ═══➤ CatalogManager ═╦═➤ ChannelA
 *                            ╚═➤ ChannelB
 * ```
 *
 * This means in order to isolate them from each other you must duplicate and maintain two separate
 * `CatalogManager`-Role like so:
 *
 * ```
 * UserA ═══➤ CatalogManagerA ═══➤ ChannelA
 * UserB ═══➤ CatalogManagerB ═══➤ ChannelB
 * ```
 *
 * This scales badly and makes it hard to maintain for marketplaces with lots of administrators.
 *
 * This plugin replaces the default strategy with {@link ChannelRolePermissionResolverStrategy}
 * which allows you to share roles between channels, while still being able to restrict users
 * to their dedicated channels. Using the previously mentioned example, adding the plugin lets you
 * share the permissions from a role granularly for any channel, like so:
 *
 * ```
 * UserA ═══➤ CatalogManager ═══➤ ChannelA
 * UserB ═══➤ CatalogManager ═══➤ ChannelB
 * UserC ═══➤ CatalogManager ═══➤ ChannelA
 * UserC ═══➤ CatalogManager ═══➤ ChannelB
 * UserD ═══➤ CatalogManager ═══➤ ChannelD
 * ... etc. ...
 * ```
 *
 * This is especially useful for multi vendor marketplaces where each vendor has their own channel with `N` roles respectively.
 *
 * @docsCategory auth
 * @docsPage ChannelRolePlugin
 * @docsWeight 0
 * @since 3.2.0
 */
@VendurePlugin({
    imports: [PluginCommonModule],
    entities: [ChannelRole],
    providers: [
        { provide: CHANNELROLE_PLUGIN_OPTIONS, useFactory: () => ChannelRolePlugin.options },
        ChannelRoleService,
    ],
    configuration: config => {
        config.authOptions.rolePermissionResolverStrategy = new ChannelRolePermissionResolverStrategy();
        return config;
    },
    adminApiExtensions: {
        schema: gql`
            input ChannelRoleInput {
                channelId: ID!
                roleId: ID!
            }
            input CreateChannelAdministratorInput {
                firstName: String!
                lastName: String!
                emailAddress: String!
                password: String!
                channelRoles: [ChannelRoleInput!]!
            }
            input UpdateChannelAdministratorInput {
                id: ID!
                firstName: String
                lastName: String
                emailAddress: String
                password: String
                channelRoles: [ChannelRoleInput!]
            }
            extend type Mutation {
                createChannelAdministrator(input: CreateChannelAdministratorInput!): Administrator!
                updateChannelAdministrator(input: UpdateChannelAdministratorInput!): Administrator!
            }
        `,
        resolvers: [ChannelRoleResolver],
    },
    compatibility: '^3.0.0',
})
export class ChannelRolePlugin {
    static options: ChannelRoleOptions = {};

    static init(options: ChannelRoleOptions): Type<ChannelRolePlugin> {
        this.options = options;
        return ChannelRolePlugin;
    }
}
