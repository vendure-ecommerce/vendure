import { OnApplicationBootstrap } from '@nestjs/common';
import {
    Asset,
    PluginCommonModule,
    Product,
    TransactionalConnection,
    User,
    VendurePlugin,
} from '@vendure/core';
import gql from 'graphql-tag';

import { ProfileAsset } from './profile-asset.entity';
import { Profile } from './profile.entity';

const schema = gql`
    type Profile implements Node {
        id: ID!
        createdAt: DateTime!
        updatedAt: DateTime!
        name: String!
        user: User!
    }
`;

/**
 * Test plugin for https://github.com/vendure-ecommerce/vendure/issues/1664
 *
 * Test query:
 * ```graphql
 * query {
 *   product(id: 1) {
 *     name
 *     customFields {
 *       owner {
 *         id
 *         identifier
 *         customFields {
 *           profile {
 *             id
 *             name
 *           }
 *         }
 *       }
 *     }
 *   }
 * }
 * ```
 */
@VendurePlugin({
    imports: [PluginCommonModule],
    entities: () => [Profile, ProfileAsset],
    shopApiExtensions: { schema, resolvers: [] },
    adminApiExtensions: { schema, resolvers: [] },
    configuration: config => {
        config.customFields.Product.push({
            name: 'owner',
            nullable: true,
            type: 'relation',
            entity: User,
            public: false,
            eager: true, // needs to be eager to enable indexing of user->profile attributes like name, etc.
            readonly: true,
        });
        // User
        config.customFields.User.push({
            name: 'profile',
            type: 'relation',
            entity: Profile,
            nullable: true,
            public: false,
            internal: false,
            readonly: true,
            eager: true, // needs to be eager to enable indexing of profile attributes like name, etc.
        });
        return config;
    },
})
export class Test1664Plugin implements OnApplicationBootstrap {
    constructor(private connection: TransactionalConnection) {}

    async onApplicationBootstrap() {
        const profilesCount = await this.connection.rawConnection.getRepository(Profile).count();
        if (0 < profilesCount) {
            return;
        }
        // Create a Profile and assign it to all the products
        const users = await this.connection.rawConnection.getRepository(User).find();
        // tslint:disable-next-line:no-non-null-assertion
        const user = users[1]!;
        const profile = await this.connection.rawConnection.getRepository(Profile).save(
            new Profile({
                name: 'Test Profile',
                user,
            }),
        );

        (user.customFields as any).profile = profile;
        await this.connection.rawConnection.getRepository(User).save(user);

        const asset = await this.connection.rawConnection.getRepository(Asset).findOne(1);
        if (asset) {
            const profileAsset = this.connection.rawConnection.getRepository(ProfileAsset).save({
                asset,
                profile,
            });
        }

        const products = await this.connection.rawConnection.getRepository(Product).find();
        for (const product of products) {
            (product.customFields as any).owner = user;
            await this.connection.rawConnection.getRepository(Product).save(product);
        }
    }
}
