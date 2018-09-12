import {
    CreateRole,
    CreateRoleVariables,
    GetRole,
    GetRoles,
    GetRolesVariables,
    GetRoleVariables,
    Permission,
    Role,
    UpdateRole,
    UpdateRoleVariables,
} from 'shared/generated-types';
import { omit } from 'shared/omit';
import { CUSTOMER_ROLE_CODE, SUPER_ADMIN_ROLE_CODE } from 'shared/shared-constants';

import {
    CREATE_ROLE,
    GET_ROLE,
    GET_ROLES,
    UPDATE_ROLE,
} from '../../admin-ui/src/app/data/definitions/administrator-definitions';

import { TestClient } from './test-client';
import { TestServer } from './test-server';

describe('Role resolver', () => {
    const client = new TestClient();
    const server = new TestServer();
    let createdRole: Role;
    let defaultRoles: Role[];

    beforeAll(async () => {
        const token = await server.init({
            productCount: 1,
            customerCount: 1,
        });
        await client.init();
    }, 60000);

    afterAll(async () => {
        await server.destroy();
    });

    it('roles', async () => {
        const result = await client.query<GetRoles, GetRolesVariables>(GET_ROLES);

        defaultRoles = result.roles.items;
        expect(result.roles.items.length).toBe(2);
        expect(result.roles.totalItems).toBe(2);
    });

    it('createRole', async () => {
        const result = await client.query<CreateRole, CreateRoleVariables>(CREATE_ROLE, {
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
        const result = await client.query<GetRole, GetRoleVariables>(GET_ROLE, { id: createdRole.id });
        expect(result.role).toEqual(createdRole);
    });

    it('updateRole', async () => {
        const result = await client.query<UpdateRole, UpdateRoleVariables>(UPDATE_ROLE, {
            input: {
                id: createdRole.id,
                code: 'test-modified',
                description: 'test role modified',
                permissions: [Permission.ReadCustomer, Permission.UpdateCustomer, Permission.DeleteCustomer],
            },
        });

        expect(omit(result.updateRole, ['channels'])).toMatchSnapshot();
    });

    it('updateRole is not allowed for SuperAdmin role', async () => {
        const superAdminRole = defaultRoles.find(r => r.code === SUPER_ADMIN_ROLE_CODE);
        if (!superAdminRole) {
            fail(`Could not find SuperAdmin role`);
            return;
        }
        try {
            const result = await client.query<UpdateRole, UpdateRoleVariables>(UPDATE_ROLE, {
                input: {
                    id: superAdminRole.id,
                    code: 'superadmin-modified',
                    description: 'superadmin modified',
                    permissions: [Permission.Authenticated],
                },
            });
            fail(`Should throw`);
        } catch (err) {
            expect(err.message).toEqual(
                expect.stringContaining(`The role '${SUPER_ADMIN_ROLE_CODE}' cannot be modified`),
            );
        }
    });

    it('updateRole is not allowed for Customer role', async () => {
        const customerRole = defaultRoles.find(r => r.code === CUSTOMER_ROLE_CODE);
        if (!customerRole) {
            fail(`Could not find Customer role`);
            return;
        }
        try {
            const result = await client.query<UpdateRole, UpdateRoleVariables>(UPDATE_ROLE, {
                input: {
                    id: customerRole.id,
                    code: 'customer-modified',
                    description: 'customer modified',
                    permissions: [Permission.Authenticated, Permission.DeleteAdministrator],
                },
            });
            fail(`Should throw`);
        } catch (err) {
            expect(err.message).toEqual(
                expect.stringContaining(`The role '${CUSTOMER_ROLE_CODE}' cannot be modified`),
            );
        }
    });
});
