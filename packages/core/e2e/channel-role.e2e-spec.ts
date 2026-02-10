import { DEFAULT_CHANNEL_CODE } from '@vendure/common/lib/shared-constants';
import { ChannelRolePermissionResolverStrategy, mergeConfig } from '@vendure/core';
import { createTestEnvironment, E2E_DEFAULT_CHANNEL_TOKEN } from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { TEST_SETUP_TIMEOUT_MS, testConfig } from '../../../e2e-common/test-config';

import * as Codegen from './graphql/generated-e2e-admin-types';
import { CurrencyCode, LanguageCode, Permission } from './graphql/generated-e2e-admin-types';
import { CREATE_CHANNEL, CREATE_ROLE, GET_CHANNELS, ME } from './graphql/shared-definitions';

describe('ChannelRole permission resolver', () => {
    const { server, adminClient } = createTestEnvironment(
        mergeConfig(testConfig(), {
            authOptions: {
                rolePermissionResolverStrategy: new ChannelRolePermissionResolverStrategy(),
            },
        }),
    );

    let defaultChannel: { id: string; code: string; token: string };
    let secondChannel: { id: string; code: string; token: string };
    let readCustomerRole: { id: string; code: string };
    let readOrderRole: { id: string; code: string };
    let createdAdminId: string;

    beforeAll(async () => {
        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-minimal.csv'),
            customerCount: 1,
        });
        await adminClient.asSuperAdmin();

        // Get channels
        const { channels } = await adminClient.query<Codegen.GetChannelsQuery>(GET_CHANNELS);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        defaultChannel = channels.items.find(c => c.token === E2E_DEFAULT_CHANNEL_TOKEN)!;

        // Create a second channel
        const { createChannel } = await adminClient.query<
            Codegen.CreateChannelMutation,
            Codegen.CreateChannelMutationVariables
        >(CREATE_CHANNEL, {
            input: {
                code: 'second-channel',
                token: 'second-channel-token',
                defaultLanguageCode: LanguageCode.en,
                currencyCode: CurrencyCode.GBP,
                pricesIncludeTax: true,
                defaultShippingZoneId: 'T_1',
                defaultTaxZoneId: 'T_1',
            },
        });
        secondChannel = createChannel as any;

        // Create roles (without channel assignments — channels are now assigned per user)
        const { createRole: role1 } = await adminClient.query<
            Codegen.CreateRoleMutation,
            Codegen.CreateRoleMutationVariables
        >(CREATE_ROLE, {
            input: {
                code: 'read-customer',
                description: 'Can read customers',
                permissions: [Permission.ReadCustomer],
                channelIds: [defaultChannel.id],
            },
        });
        readCustomerRole = role1;

        const { createRole: role2 } = await adminClient.query<
            Codegen.CreateRoleMutation,
            Codegen.CreateRoleMutationVariables
        >(CREATE_ROLE, {
            input: {
                code: 'read-order',
                description: 'Can read orders',
                permissions: [Permission.ReadOrder],
                channelIds: [defaultChannel.id],
            },
        });
        readOrderRole = role2;
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    describe('createChannelAdministrator', () => {
        it('creates an administrator with channel-role assignments', async () => {
            const result = await adminClient.query(CREATE_CHANNEL_ADMINISTRATOR, {
                input: {
                    firstName: 'Channel',
                    lastName: 'Admin',
                    emailAddress: 'channel-admin@test.com',
                    password: 'test',
                    channelRoles: [
                        { channelId: defaultChannel.id, roleId: readCustomerRole.id },
                        { channelId: secondChannel.id, roleId: readOrderRole.id },
                    ],
                },
            });

            createdAdminId = result.createChannelAdministrator.id;
            expect(createdAdminId).toBeDefined();

            const admin = result.createChannelAdministrator;
            expect(admin.firstName).toBe('Channel');
            expect(admin.lastName).toBe('Admin');
            expect(admin.emailAddress).toBe('channel-admin@test.com');
        });

        it('administrator has channelRoles populated', async () => {
            const result = await adminClient.query(GET_ADMINISTRATOR_WITH_CHANNEL_ROLES, {
                id: createdAdminId,
            });

            const admin = result.administrator;
            expect(admin).toBeDefined();
            expect(admin.user.channelRoles).toHaveLength(2);

            const channelRoleCodes = admin.user.channelRoles.map((cr: any) => ({
                channelCode: cr.channel.code,
                roleCode: cr.role.code,
            }));
            expect(channelRoleCodes).toEqual(
                expect.arrayContaining([
                    { channelCode: DEFAULT_CHANNEL_CODE, roleCode: 'read-customer' },
                    { channelCode: 'second-channel', roleCode: 'read-order' },
                ]),
            );
        });
    });

    describe('permission resolution via channel-role strategy', () => {
        it('resolves permissions per channel for the created admin', async () => {
            await adminClient.asUserWithCredentials('channel-admin@test.com', 'test');

            // Check permissions on the default channel
            adminClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);
            const meDefault = await adminClient.query(ME);
            const defaultChannelPerms = meDefault.me.channels.find(
                (c: any) => c.code === DEFAULT_CHANNEL_CODE,
            );
            expect(defaultChannelPerms).toBeDefined();
            expect(defaultChannelPerms.permissions).toContain(Permission.ReadCustomer);
            expect(defaultChannelPerms.permissions).not.toContain(Permission.ReadOrder);

            // Check permissions on the second channel
            const secondChannelPerms = meDefault.me.channels.find((c: any) => c.code === 'second-channel');
            expect(secondChannelPerms).toBeDefined();
            expect(secondChannelPerms.permissions).toContain(Permission.ReadOrder);
            expect(secondChannelPerms.permissions).not.toContain(Permission.ReadCustomer);
        });
    });

    describe('updateChannelAdministrator', () => {
        beforeAll(async () => {
            adminClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);
            await adminClient.asSuperAdmin();
        });

        it('updates channel-role assignments', async () => {
            const result = await adminClient.query(UPDATE_CHANNEL_ADMINISTRATOR, {
                input: {
                    id: createdAdminId,
                    channelRoles: [{ channelId: defaultChannel.id, roleId: readOrderRole.id }],
                },
            });

            expect(result.updateChannelAdministrator.id).toBe(createdAdminId);

            // Verify the updated channel roles
            const adminResult = await adminClient.query(GET_ADMINISTRATOR_WITH_CHANNEL_ROLES, {
                id: createdAdminId,
            });

            expect(adminResult.administrator.user.channelRoles).toHaveLength(1);
            expect(adminResult.administrator.user.channelRoles[0].channel.code).toBe(DEFAULT_CHANNEL_CODE);
            expect(adminResult.administrator.user.channelRoles[0].role.code).toBe('read-order');
        });

        it('updated permissions are reflected in session', async () => {
            await adminClient.asUserWithCredentials('channel-admin@test.com', 'test');

            const me = await adminClient.query(ME);
            const defaultChannelPerms = me.me.channels.find((c: any) => c.code === DEFAULT_CHANNEL_CODE);
            expect(defaultChannelPerms).toBeDefined();
            expect(defaultChannelPerms.permissions).toContain(Permission.ReadOrder);
            expect(defaultChannelPerms.permissions).not.toContain(Permission.ReadCustomer);

            // Second channel should no longer have permissions
            const secondChannelPerms = me.me.channels.find((c: any) => c.code === 'second-channel');
            expect(secondChannelPerms).toBeUndefined();
        });

        it('can update basic fields without changing channel roles', async () => {
            await adminClient.asSuperAdmin();

            const result = await adminClient.query(UPDATE_CHANNEL_ADMINISTRATOR, {
                input: {
                    id: createdAdminId,
                    firstName: 'Updated',
                    lastName: 'Name',
                },
            });

            expect(result.updateChannelAdministrator.id).toBe(createdAdminId);

            const adminResult = await adminClient.query(GET_ADMINISTRATOR_WITH_CHANNEL_ROLES, {
                id: createdAdminId,
            });
            expect(adminResult.administrator.firstName).toBe('Updated');
            expect(adminResult.administrator.lastName).toBe('Name');
            // Channel roles should be unchanged
            expect(adminResult.administrator.user.channelRoles).toHaveLength(1);
        });
    });

    describe('multiple roles on same channel', () => {
        let multiRoleAdminId: string;

        beforeAll(async () => {
            adminClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);
            await adminClient.asSuperAdmin();
        });

        it('creates admin with multiple roles on the same channel', async () => {
            const result = await adminClient.query(CREATE_CHANNEL_ADMINISTRATOR, {
                input: {
                    firstName: 'Multi',
                    lastName: 'Role',
                    emailAddress: 'multi-role@test.com',
                    password: 'test',
                    channelRoles: [
                        { channelId: defaultChannel.id, roleId: readCustomerRole.id },
                        { channelId: defaultChannel.id, roleId: readOrderRole.id },
                    ],
                },
            });

            multiRoleAdminId = result.createChannelAdministrator.id;
            expect(multiRoleAdminId).toBeDefined();
        });

        it('merges permissions from multiple roles on the same channel', async () => {
            await adminClient.asUserWithCredentials('multi-role@test.com', 'test');

            const me = await adminClient.query(ME);
            const defaultPerms = me.me.channels.find((c: any) => c.code === DEFAULT_CHANNEL_CODE);
            expect(defaultPerms).toBeDefined();
            // Both ReadCustomer and ReadOrder should be present from the two roles
            expect(defaultPerms.permissions).toContain(Permission.ReadCustomer);
            expect(defaultPerms.permissions).toContain(Permission.ReadOrder);
        });
    });
});

const CREATE_CHANNEL_ADMINISTRATOR = gql`
    mutation CreateChannelAdministrator($input: CreateChannelAdministratorInput!) {
        createChannelAdministrator(input: $input) {
            id
            firstName
            lastName
            emailAddress
        }
    }
`;

const UPDATE_CHANNEL_ADMINISTRATOR = gql`
    mutation UpdateChannelAdministrator($input: UpdateChannelAdministratorInput!) {
        updateChannelAdministrator(input: $input) {
            id
            firstName
            lastName
            emailAddress
        }
    }
`;

const GET_ADMINISTRATOR_WITH_CHANNEL_ROLES = gql`
    query GetAdministratorWithChannelRoles($id: ID!) {
        administrator(id: $id) {
            id
            firstName
            lastName
            emailAddress
            user {
                id
                channelRoles {
                    id
                    channel {
                        id
                        code
                    }
                    role {
                        id
                        code
                        description
                        permissions
                    }
                }
            }
        }
    }
`;
