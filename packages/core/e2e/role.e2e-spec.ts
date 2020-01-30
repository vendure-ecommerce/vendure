import { omit } from '@vendure/common/lib/omit';
import {
    CUSTOMER_ROLE_CODE,
    DEFAULT_CHANNEL_CODE,
    SUPER_ADMIN_ROLE_CODE,
} from '@vendure/common/lib/shared-constants';
import { createTestEnvironment } from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { TEST_SETUP_TIMEOUT_MS, testConfig } from '../../../e2e-common/test-config';

import { ROLE_FRAGMENT } from './graphql/fragments';
import {
    CreateChannel,
    CreateRole,
    CurrencyCode,
    DeleteRole,
    DeletionResult,
    GetRole,
    GetRoles,
    LanguageCode,
    Permission,
    Role,
    UpdateRole,
} from './graphql/generated-e2e-admin-types';
import { CREATE_CHANNEL, CREATE_ROLE } from './graphql/shared-definitions';
import { assertThrowsWithMessage } from './utils/assert-throws-with-message';
import { sortById } from './utils/test-order-utils';

describe('Role resolver', () => {
    const { server, adminClient } = createTestEnvironment(testConfig);
    let createdRole: Role.Fragment;
    let defaultRoles: Role.Fragment[];

    beforeAll(async () => {
        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-minimal.csv'),
            customerCount: 1,
        });
        await adminClient.asSuperAdmin();
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    it('roles', async () => {
        const result = await adminClient.query<GetRoles.Query, GetRoles.Variables>(GET_ROLES);

        defaultRoles = result.roles.items;
        expect(result.roles.items.length).toBe(2);
        expect(result.roles.totalItems).toBe(2);
    });

    it(
        'createRole with invalid permission',
        assertThrowsWithMessage(async () => {
            await adminClient.query<CreateRole.Mutation, CreateRole.Variables>(CREATE_ROLE, {
                input: {
                    code: 'test',
                    description: 'test role',
                    permissions: ['bad permission' as any],
                },
            });
        }, 'Variable "$input" got invalid value "bad permission" at "input.permissions[0]"; Expected type Permission.'),
    );

    it('createRole with no permissions includes Authenticated', async () => {
        const { createRole } = await adminClient.query<CreateRole.Mutation, CreateRole.Variables>(
            CREATE_ROLE,
            {
                input: {
                    code: 'test',
                    description: 'test role',
                    permissions: [],
                },
            },
        );

        expect(omit(createRole, ['channels'])).toEqual({
            code: 'test',
            description: 'test role',
            id: 'T_3',
            permissions: [Permission.Authenticated],
        });
    });

    it('createRole deduplicates permissions', async () => {
        const { createRole } = await adminClient.query<CreateRole.Mutation, CreateRole.Variables>(
            CREATE_ROLE,
            {
                input: {
                    code: 'test2',
                    description: 'test role2',
                    permissions: [Permission.ReadSettings, Permission.ReadSettings],
                },
            },
        );

        expect(omit(createRole, ['channels'])).toEqual({
            code: 'test2',
            description: 'test role2',
            id: 'T_4',
            permissions: [Permission.Authenticated, Permission.ReadSettings],
        });
    });

    it('createRole with permissions', async () => {
        const result = await adminClient.query<CreateRole.Mutation, CreateRole.Variables>(CREATE_ROLE, {
            input: {
                code: 'test',
                description: 'test role',
                permissions: [Permission.ReadCustomer, Permission.UpdateCustomer],
            },
        });

        createdRole = result.createRole;
        expect(createdRole).toEqual({
            code: 'test',
            description: 'test role',
            id: 'T_5',
            permissions: [Permission.Authenticated, Permission.ReadCustomer, Permission.UpdateCustomer],
            channels: [
                {
                    code: DEFAULT_CHANNEL_CODE,
                    id: 'T_1',
                    token: 'e2e-default-channel',
                },
            ],
        });
    });

    it('role', async () => {
        const result = await adminClient.query<GetRole.Query, GetRole.Variables>(GET_ROLE, {
            id: createdRole.id,
        });
        expect(result.role).toEqual(createdRole);
    });

    it('updateRole', async () => {
        const result = await adminClient.query<UpdateRole.Mutation, UpdateRole.Variables>(UPDATE_ROLE, {
            input: {
                id: createdRole.id,
                code: 'test-modified',
                description: 'test role modified',
                permissions: [Permission.ReadCustomer, Permission.UpdateCustomer, Permission.DeleteCustomer],
            },
        });

        expect(omit(result.updateRole, ['channels'])).toEqual({
            code: 'test-modified',
            description: 'test role modified',
            id: 'T_5',
            permissions: [
                Permission.Authenticated,
                Permission.ReadCustomer,
                Permission.UpdateCustomer,
                Permission.DeleteCustomer,
            ],
        });
    });

    it('updateRole works with partial input', async () => {
        const result = await adminClient.query<UpdateRole.Mutation, UpdateRole.Variables>(UPDATE_ROLE, {
            input: {
                id: createdRole.id,
                code: 'test-modified-again',
            },
        });

        expect(result.updateRole.code).toBe('test-modified-again');
        expect(result.updateRole.description).toBe('test role modified');
        expect(result.updateRole.permissions).toEqual([
            Permission.Authenticated,
            Permission.ReadCustomer,
            Permission.UpdateCustomer,
            Permission.DeleteCustomer,
        ]);
    });

    it('updateRole deduplicates permissions', async () => {
        const result = await adminClient.query<UpdateRole.Mutation, UpdateRole.Variables>(UPDATE_ROLE, {
            input: {
                id: createdRole.id,
                permissions: [
                    Permission.Authenticated,
                    Permission.Authenticated,
                    Permission.ReadCustomer,
                    Permission.ReadCustomer,
                ],
            },
        });

        expect(result.updateRole.permissions).toEqual([Permission.Authenticated, Permission.ReadCustomer]);
    });

    it(
        'updateRole is not allowed for SuperAdmin role',
        assertThrowsWithMessage(async () => {
            const superAdminRole = defaultRoles.find(r => r.code === SUPER_ADMIN_ROLE_CODE);
            if (!superAdminRole) {
                fail(`Could not find SuperAdmin role`);
                return;
            }
            return adminClient.query<UpdateRole.Mutation, UpdateRole.Variables>(UPDATE_ROLE, {
                input: {
                    id: superAdminRole.id,
                    code: 'superadmin-modified',
                    description: 'superadmin modified',
                    permissions: [Permission.Authenticated],
                },
            });
        }, `The role '${SUPER_ADMIN_ROLE_CODE}' cannot be modified`),
    );

    it(
        'updateRole is not allowed for Customer role',
        assertThrowsWithMessage(async () => {
            const customerRole = defaultRoles.find(r => r.code === CUSTOMER_ROLE_CODE);
            if (!customerRole) {
                fail(`Could not find Customer role`);
                return;
            }
            return adminClient.query<UpdateRole.Mutation, UpdateRole.Variables>(UPDATE_ROLE, {
                input: {
                    id: customerRole.id,
                    code: 'customer-modified',
                    description: 'customer modified',
                    permissions: [Permission.Authenticated, Permission.DeleteAdministrator],
                },
            });
        }, `The role '${CUSTOMER_ROLE_CODE}' cannot be modified`),
    );

    it(
        'deleteRole is not allowed for Customer role',
        assertThrowsWithMessage(async () => {
            const customerRole = defaultRoles.find(r => r.code === CUSTOMER_ROLE_CODE);
            if (!customerRole) {
                fail(`Could not find Customer role`);
                return;
            }
            return adminClient.query<DeleteRole.Mutation, DeleteRole.Variables>(DELETE_ROLE, {
                id: customerRole.id,
            });
        }, `The role '${CUSTOMER_ROLE_CODE}' cannot be deleted`),
    );

    it(
        'deleteRole is not allowed for SuperAdmin role',
        assertThrowsWithMessage(async () => {
            const superAdminRole = defaultRoles.find(r => r.code === SUPER_ADMIN_ROLE_CODE);
            if (!superAdminRole) {
                fail(`Could not find Customer role`);
                return;
            }
            return adminClient.query<DeleteRole.Mutation, DeleteRole.Variables>(DELETE_ROLE, {
                id: superAdminRole.id,
            });
        }, `The role '${SUPER_ADMIN_ROLE_CODE}' cannot be deleted`),
    );

    it('deleteRole deletes a role', async () => {
        const { deleteRole } = await adminClient.query<DeleteRole.Mutation, DeleteRole.Variables>(
            DELETE_ROLE,
            {
                id: createdRole.id,
            },
        );

        expect(deleteRole.result).toBe(DeletionResult.DELETED);

        const { role } = await adminClient.query<GetRole.Query, GetRole.Variables>(GET_ROLE, {
            id: createdRole.id,
        });
        expect(role).toBeNull();
    });

    describe('multi-channel', () => {
        let secondChannel: CreateChannel.CreateChannel;
        let multiChannelRole: CreateRole.CreateRole;

        beforeAll(async () => {
            const { createChannel } = await adminClient.query<
                CreateChannel.Mutation,
                CreateChannel.Variables
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

            secondChannel = createChannel;
        });

        it('createRole with specified channel', async () => {
            const result = await adminClient.query<CreateRole.Mutation, CreateRole.Variables>(CREATE_ROLE, {
                input: {
                    code: 'multi-test',
                    description: 'multi channel test role',
                    permissions: [Permission.ReadCustomer],
                    channelIds: [secondChannel.id],
                },
            });

            multiChannelRole = result.createRole;
            expect(multiChannelRole).toEqual({
                code: 'multi-test',
                description: 'multi channel test role',
                id: 'T_6',
                permissions: [Permission.Authenticated, Permission.ReadCustomer],
                channels: [
                    {
                        code: 'second-channel',
                        id: 'T_2',
                        token: 'second-channel-token',
                    },
                ],
            });
        });

        it('updateRole with specified channel', async () => {
            const { updateRole } = await adminClient.query<UpdateRole.Mutation, UpdateRole.Variables>(
                UPDATE_ROLE,
                {
                    input: {
                        id: multiChannelRole.id,
                        channelIds: ['T_1', 'T_2'],
                    },
                },
            );

            expect(updateRole.channels.sort(sortById)).toEqual([
                {
                    code: DEFAULT_CHANNEL_CODE,
                    id: 'T_1',
                    token: 'e2e-default-channel',
                },
                {
                    code: 'second-channel',
                    id: 'T_2',
                    token: 'second-channel-token',
                },
            ]);
        });
    });
});

export const GET_ROLES = gql`
    query GetRoles($options: RoleListOptions) {
        roles(options: $options) {
            items {
                ...Role
            }
            totalItems
        }
    }
    ${ROLE_FRAGMENT}
`;

export const GET_ROLE = gql`
    query GetRole($id: ID!) {
        role(id: $id) {
            ...Role
        }
    }
    ${ROLE_FRAGMENT}
`;

export const UPDATE_ROLE = gql`
    mutation UpdateRole($input: UpdateRoleInput!) {
        updateRole(input: $input) {
            ...Role
        }
    }
    ${ROLE_FRAGMENT}
`;

export const DELETE_ROLE = gql`
    mutation DeleteRole($id: ID!) {
        deleteRole(id: $id) {
            result
            message
        }
    }
`;
