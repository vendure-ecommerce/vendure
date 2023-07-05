import { mergeConfig } from '@vendure/core';
import gql from 'graphql-tag';
import path from 'path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { testConfig, TEST_SETUP_TIMEOUT_MS } from '../../../e2e-common/test-config';
import { createTestEnvironment } from '../../testing/lib/create-test-environment';

import {
    sync,
    TestPluginWithCustomPermissions,
    wishlist,
} from './fixtures/test-plugins/with-custom-permissions';
import {
    AdministratorFragment,
    CreateAdministratorMutation,
    CreateAdministratorMutationVariables,
    CreateRoleMutation,
    CreateRoleMutationVariables,
    RoleFragment,
    UpdateRoleMutation,
    UpdateRoleMutationVariables,
} from './graphql/generated-e2e-admin-types';
import { CREATE_ADMINISTRATOR, CREATE_ROLE, UPDATE_ROLE } from './graphql/shared-definitions';
import { assertThrowsWithMessage } from './utils/assert-throws-with-message';

describe('Custom permissions', () => {
    const { server, adminClient } = createTestEnvironment(
        mergeConfig(testConfig(), {
            plugins: [TestPluginWithCustomPermissions],
        }),
    );

    let testRole: RoleFragment;
    let testAdmin: AdministratorFragment;

    beforeAll(async () => {
        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-minimal.csv'),
            customerCount: 1,
        });
        await adminClient.asSuperAdmin();

        // create a new role and Admin and sign in as that Admin
        const { createRole } = await adminClient.query<CreateRoleMutation, CreateRoleMutationVariables>(
            CREATE_ROLE,
            {
                input: {
                    channelIds: ['T_1'],
                    code: 'test-role',
                    description: 'Testing custom permissions',
                    permissions: [],
                },
            },
        );
        testRole = createRole;
        const { createAdministrator } = await adminClient.query<
            CreateAdministratorMutation,
            CreateAdministratorMutationVariables
        >(CREATE_ADMINISTRATOR, {
            input: {
                firstName: 'Test',
                lastName: 'Admin',
                emailAddress: 'test@admin.com',
                password: 'test',
                roleIds: [testRole.id],
            },
        });

        testAdmin = createAdministrator;
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    describe('superadmin has custom permissions automatically', () => {
        beforeAll(async () => {
            await adminClient.asSuperAdmin();
        });

        it('single permission', async () => {
            const { syncWishlist } = await adminClient.query(SYNC);
            expect(syncWishlist).toBe(true);
        });

        it('CRUD create permission', async () => {
            const { createWishlist } = await adminClient.query(CRUD_CREATE);
            expect(createWishlist).toBe(true);
        });

        it('CRUD read permission', async () => {
            // eslint-disable-next-line no-shadow,@typescript-eslint/no-shadow
            const { wishlist } = await adminClient.query(CRUD_READ);
            expect(wishlist).toBe(true);
        });

        it('CRUD update permission', async () => {
            const { updateWishlist } = await adminClient.query(CRUD_UPDATE);
            expect(updateWishlist).toBe(true);
        });

        it('CRUD delete permission', async () => {
            const { deleteWishlist } = await adminClient.query(CRUD_DELETE);
            expect(deleteWishlist).toBe(true);
        });
    });

    describe('custom permissions prevent unauthorized access', () => {
        beforeAll(async () => {
            await adminClient.asUserWithCredentials(testAdmin.emailAddress, 'test');
        });

        it(
            'single permission',
            assertThrowsWithMessage(async () => {
                await adminClient.query(SYNC);
            }, 'You are not currently authorized to perform this action'),
        );

        it(
            'CRUD create permission',
            assertThrowsWithMessage(async () => {
                await adminClient.query(CRUD_CREATE);
            }, 'You are not currently authorized to perform this action'),
        );

        it(
            'CRUD read permission',
            assertThrowsWithMessage(async () => {
                await adminClient.query(CRUD_READ);
            }, 'You are not currently authorized to perform this action'),
        );

        it(
            'CRUD update permission',
            assertThrowsWithMessage(async () => {
                await adminClient.query(CRUD_UPDATE);
            }, 'You are not currently authorized to perform this action'),
        );

        it(
            'CRUD delete permission',
            assertThrowsWithMessage(async () => {
                await adminClient.query(CRUD_DELETE);
            }, 'You are not currently authorized to perform this action'),
        );
    });

    describe('adding permissions enables access', () => {
        beforeAll(async () => {
            await adminClient.asSuperAdmin();
            await adminClient.query<UpdateRoleMutation, UpdateRoleMutationVariables>(UPDATE_ROLE, {
                input: {
                    id: testRole.id,
                    permissions: [
                        sync.Permission,
                        wishlist.Create,
                        wishlist.Read,
                        wishlist.Update,
                        wishlist.Delete,
                    ],
                },
            });

            await adminClient.asUserWithCredentials(testAdmin.emailAddress, 'test');
        });

        it('single permission', async () => {
            const { syncWishlist } = await adminClient.query(SYNC);
            expect(syncWishlist).toBe(true);
        });

        it('CRUD create permission', async () => {
            const { createWishlist } = await adminClient.query(CRUD_CREATE);
            expect(createWishlist).toBe(true);
        });

        it('CRUD read permission', async () => {
            // eslint-disable-next-line no-shadow,@typescript-eslint/no-shadow
            const { wishlist } = await adminClient.query(CRUD_READ);
            expect(wishlist).toBe(true);
        });

        it('CRUD update permission', async () => {
            const { updateWishlist } = await adminClient.query(CRUD_UPDATE);
            expect(updateWishlist).toBe(true);
        });

        it('CRUD delete permission', async () => {
            const { deleteWishlist } = await adminClient.query(CRUD_DELETE);
            expect(deleteWishlist).toBe(true);
        });
    });
});

const SYNC = gql`
    mutation Sync {
        syncWishlist
    }
`;

const CRUD_READ = gql`
    query CrudRead {
        wishlist
    }
`;

const CRUD_CREATE = gql`
    mutation CrudCreate {
        createWishlist
    }
`;

const CRUD_UPDATE = gql`
    mutation CrudUpdate {
        updateWishlist
    }
`;

const CRUD_DELETE = gql`
    mutation CrudDelete {
        deleteWishlist
    }
`;
