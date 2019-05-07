import { omit } from '@vendure/common/lib/omit';
import { CUSTOMER_ROLE_CODE, SUPER_ADMIN_ROLE_CODE } from '@vendure/common/lib/shared-constants';
import gql from 'graphql-tag';
import path from 'path';

import { TEST_SETUP_TIMEOUT_MS } from './config/test-config';
import { ROLE_FRAGMENT } from './graphql/fragments';
import { CreateRole, GetRole, GetRoles, Permission, Role, UpdateRole } from './graphql/generated-e2e-admin-types';
import { CREATE_ROLE } from './graphql/shared-definitions';
import { TestAdminClient } from './test-client';
import { TestServer } from './test-server';
import { assertThrowsWithMessage } from './utils/assert-throws-with-message';

describe('Role resolver', () => {
    const client = new TestAdminClient();
    const server = new TestServer();
    let createdRole: Role.Fragment;
    let defaultRoles: Role.Fragment[];

    beforeAll(async () => {
        const token = await server.init({
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-minimal.csv'),
            customerCount: 1,
        });
        await client.init();
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    it('roles', async () => {
        const result = await client.query<GetRoles.Query, GetRoles.Variables>(GET_ROLES);

        defaultRoles = result.roles.items;
        expect(result.roles.items.length).toBe(2);
        expect(result.roles.totalItems).toBe(2);
    });

    it('createRole', async () => {
        const result = await client.query<CreateRole.Mutation, CreateRole.Variables>(CREATE_ROLE, {
            input: {
                code: 'test',
                description: 'test role',
                permissions: [Permission.ReadCustomer, Permission.UpdateCustomer],
            },
        });

        createdRole = result.createRole;
        expect(omit(createdRole, ['channels'])).toMatchSnapshot();
    });

    it('role', async () => {
        const result = await client.query<GetRole.Query, GetRole.Variables>(GET_ROLE, { id: createdRole.id });
        expect(result.role).toEqual(createdRole);
    });

    it('updateRole', async () => {
        const result = await client.query<UpdateRole.Mutation, UpdateRole.Variables>(UPDATE_ROLE, {
            input: {
                id: createdRole.id,
                code: 'test-modified',
                description: 'test role modified',
                permissions: [Permission.ReadCustomer, Permission.UpdateCustomer, Permission.DeleteCustomer],
            },
        });

        expect(omit(result.updateRole, ['channels'])).toMatchSnapshot();
    });

    it('updateRole works with partial input', async () => {
        const result = await client.query<UpdateRole.Mutation, UpdateRole.Variables>(UPDATE_ROLE, {
            input: {
                id: createdRole.id,
                code: 'test-modified-again',
            },
        });

        expect(result.updateRole.code).toBe('test-modified-again');
        expect(result.updateRole.description).toBe('test role modified');
        expect(result.updateRole.permissions).toEqual([
            Permission.ReadCustomer,
            Permission.UpdateCustomer,
            Permission.DeleteCustomer,
        ]);
    });

    it(
        'updateRole is not allowed for SuperAdmin role',
        assertThrowsWithMessage(async () => {
            const superAdminRole = defaultRoles.find(r => r.code === SUPER_ADMIN_ROLE_CODE);
            if (!superAdminRole) {
                fail(`Could not find SuperAdmin role`);
                return;
            }
            return client.query<UpdateRole.Mutation, UpdateRole.Variables>(UPDATE_ROLE, {
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
            return client.query<UpdateRole.Mutation, UpdateRole.Variables>(UPDATE_ROLE, {
                input: {
                    id: customerRole.id,
                    code: 'customer-modified',
                    description: 'customer modified',
                    permissions: [Permission.Authenticated, Permission.DeleteAdministrator],
                },
            });
        }, `The role '${CUSTOMER_ROLE_CODE}' cannot be modified`),
    );
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
