import { SUPER_ADMIN_USER_IDENTIFIER } from '@vendure/common/lib/shared-constants';
import { createErrorResultGuard, createTestEnvironment, ErrorResultGuard } from '@vendure/testing';
import { fail } from 'assert';
import gql from 'graphql-tag';
import path from 'path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { TEST_SETUP_TIMEOUT_MS, testConfig } from '../../../e2e-common/test-config';

import { ADMINISTRATOR_FRAGMENT } from './graphql/fragments';
import * as Codegen from './graphql/generated-e2e-admin-types';
import {
    AdministratorFragment,
    AttemptLoginDocument,
    CurrentUser,
    DeletionResult,
} from './graphql/generated-e2e-admin-types';
import { CREATE_ADMINISTRATOR, UPDATE_ADMINISTRATOR } from './graphql/shared-definitions';
import { assertThrowsWithMessage } from './utils/assert-throws-with-message';

describe('Administrator resolver', () => {
    const { server, adminClient } = createTestEnvironment(testConfig());
    let createdAdmin: AdministratorFragment;

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

    it('administrators', async () => {
        const result = await adminClient.query<
            Codegen.GetAdministratorsQuery,
            Codegen.GetAdministratorsQueryVariables
        >(GET_ADMINISTRATORS);
        expect(result.administrators.items.length).toBe(1);
        expect(result.administrators.totalItems).toBe(1);
    });

    it('createAdministrator', async () => {
        const result = await adminClient.query<
            Codegen.CreateAdministratorMutation,
            Codegen.CreateAdministratorMutationVariables
        >(CREATE_ADMINISTRATOR, {
            input: {
                emailAddress: 'test@test.com',
                firstName: 'First',
                lastName: 'Last',
                password: 'password',
                roleIds: ['1'],
            },
        });

        createdAdmin = result.createAdministrator;
        expect(createdAdmin).toMatchSnapshot();
    });

    it('administrator', async () => {
        const result = await adminClient.query<
            Codegen.GetAdministratorQuery,
            Codegen.GetAdministratorQueryVariables
        >(GET_ADMINISTRATOR, {
            id: createdAdmin.id,
        });
        expect(result.administrator).toEqual(createdAdmin);
    });

    it('updateAdministrator', async () => {
        const result = await adminClient.query<
            Codegen.UpdateAdministratorMutation,
            Codegen.UpdateAdministratorMutationVariables
        >(UPDATE_ADMINISTRATOR, {
            input: {
                id: createdAdmin.id,
                emailAddress: 'new-email',
                firstName: 'new first',
                lastName: 'new last',
                password: 'new password',
                roleIds: ['2'],
            },
        });
        expect(result.updateAdministrator).toMatchSnapshot();
    });

    it('updateAdministrator works with partial input', async () => {
        const result = await adminClient.query<
            Codegen.UpdateAdministratorMutation,
            Codegen.UpdateAdministratorMutationVariables
        >(UPDATE_ADMINISTRATOR, {
            input: {
                id: createdAdmin.id,
                emailAddress: 'newest-email',
            },
        });
        expect(result.updateAdministrator.emailAddress).toBe('newest-email');
        expect(result.updateAdministrator.firstName).toBe('new first');
        expect(result.updateAdministrator.lastName).toBe('new last');
    });

    it(
        'updateAdministrator throws with invalid roleId',
        assertThrowsWithMessage(
            () =>
                adminClient.query<
                    Codegen.UpdateAdministratorMutation,
                    Codegen.UpdateAdministratorMutationVariables
                >(UPDATE_ADMINISTRATOR, {
                    input: {
                        id: createdAdmin.id,
                        emailAddress: 'new-email',
                        firstName: 'new first',
                        lastName: 'new last',
                        password: 'new password',
                        roleIds: ['999'],
                    },
                }),
            'No Role with the id "999" could be found',
        ),
    );

    it('deleteAdministrator', async () => {
        const { administrators: before } = await adminClient.query<
            Codegen.GetAdministratorsQuery,
            Codegen.GetAdministratorsQueryVariables
        >(GET_ADMINISTRATORS);
        expect(before.totalItems).toBe(2);

        const { deleteAdministrator } = await adminClient.query<
            Codegen.DeleteAdministratorMutation,
            Codegen.DeleteAdministratorMutationVariables
        >(DELETE_ADMINISTRATOR, {
            id: createdAdmin.id,
        });

        expect(deleteAdministrator.result).toBe(DeletionResult.DELETED);

        const { administrators: after } = await adminClient.query<
            Codegen.GetAdministratorsQuery,
            Codegen.GetAdministratorsQueryVariables
        >(GET_ADMINISTRATORS);
        expect(after.totalItems).toBe(1);
    });

    it('cannot delete sole SuperAdmin', async () => {
        const { administrators: before } = await adminClient.query<
            Codegen.GetAdministratorsQuery,
            Codegen.GetAdministratorsQueryVariables
        >(GET_ADMINISTRATORS);
        expect(before.totalItems).toBe(1);
        expect(before.items[0].emailAddress).toBe('superadmin');

        try {
            const { deleteAdministrator } = await adminClient.query<
                Codegen.DeleteAdministratorMutation,
                Codegen.DeleteAdministratorMutationVariables
            >(DELETE_ADMINISTRATOR, {
                id: before.items[0].id,
            });
            fail('Should have thrown');
        } catch (e: any) {
            expect(e.message).toBe('The sole SuperAdmin cannot be deleted');
        }

        const { administrators: after } = await adminClient.query<
            Codegen.GetAdministratorsQuery,
            Codegen.GetAdministratorsQueryVariables
        >(GET_ADMINISTRATORS);
        expect(after.totalItems).toBe(1);
    });

    it(
        'cannot remove SuperAdmin role from sole SuperAdmin',
        assertThrowsWithMessage(async () => {
            const result = await adminClient.query<
                Codegen.UpdateAdministratorMutation,
                Codegen.UpdateAdministratorMutationVariables
            >(UPDATE_ADMINISTRATOR, {
                input: {
                    id: 'T_1',
                    roleIds: [],
                },
            });
        }, 'Cannot remove the SuperAdmin role from the sole SuperAdmin'),
    );

    it('cannot query a deleted Administrator', async () => {
        const { administrator } = await adminClient.query<
            Codegen.GetAdministratorQuery,
            Codegen.GetAdministratorQueryVariables
        >(GET_ADMINISTRATOR, {
            id: createdAdmin.id,
        });

        expect(administrator).toBeNull();
    });

    it('activeAdministrator', async () => {
        await adminClient.asAnonymousUser();

        const { activeAdministrator: result1 } = await adminClient.query<Codegen.ActiveAdministratorQuery>(
            GET_ACTIVE_ADMINISTRATOR,
        );
        expect(result1).toBeNull();

        await adminClient.asSuperAdmin();

        const { activeAdministrator: result2 } = await adminClient.query<Codegen.ActiveAdministratorQuery>(
            GET_ACTIVE_ADMINISTRATOR,
        );
        expect(result2?.emailAddress).toBe(SUPER_ADMIN_USER_IDENTIFIER);
    });

    it('updateActiveAdministrator', async () => {
        const { updateActiveAdministrator } = await adminClient.query<
            Codegen.UpdateActiveAdministratorMutation,
            Codegen.UpdateActiveAdministratorMutationVariables
        >(UPDATE_ACTIVE_ADMINISTRATOR, {
            input: {
                firstName: 'Thomas',
                lastName: 'Anderson',
                emailAddress: 'neo@metacortex.com',
            },
        });

        expect(updateActiveAdministrator.firstName).toBe('Thomas');
        expect(updateActiveAdministrator.lastName).toBe('Anderson');

        const { activeAdministrator } = await adminClient.query<Codegen.ActiveAdministratorQuery>(
            GET_ACTIVE_ADMINISTRATOR,
        );

        expect(activeAdministrator?.firstName).toBe('Thomas');
        expect(activeAdministrator?.user.identifier).toBe('neo@metacortex.com');
    });

    it('supports case-sensitive admin identifiers', async () => {
        const loginResultGuard: ErrorResultGuard<CurrentUser> = createErrorResultGuard(
            input => !!input.identifier,
        );
        const { createAdministrator } = await adminClient.query<
            Codegen.CreateAdministratorMutation,
            Codegen.CreateAdministratorMutationVariables
        >(CREATE_ADMINISTRATOR, {
            input: {
                emailAddress: 'NewAdmin',
                firstName: 'New',
                lastName: 'Admin',
                password: 'password',
                roleIds: ['1'],
            },
        });

        const { login } = await adminClient.query(AttemptLoginDocument, {
            username: 'NewAdmin',
            password: 'password',
        });

        loginResultGuard.assertSuccess(login);
        expect(login.identifier).toBe('NewAdmin');
    });
});

export const GET_ADMINISTRATORS = gql`
    query GetAdministrators($options: AdministratorListOptions) {
        administrators(options: $options) {
            items {
                ...Administrator
            }
            totalItems
        }
    }
    ${ADMINISTRATOR_FRAGMENT}
`;

export const GET_ADMINISTRATOR = gql`
    query GetAdministrator($id: ID!) {
        administrator(id: $id) {
            ...Administrator
        }
    }
    ${ADMINISTRATOR_FRAGMENT}
`;

export const GET_ACTIVE_ADMINISTRATOR = gql`
    query ActiveAdministrator {
        activeAdministrator {
            ...Administrator
        }
    }
    ${ADMINISTRATOR_FRAGMENT}
`;

export const UPDATE_ACTIVE_ADMINISTRATOR = gql`
    mutation UpdateActiveAdministrator($input: UpdateActiveAdministratorInput!) {
        updateActiveAdministrator(input: $input) {
            ...Administrator
        }
    }
    ${ADMINISTRATOR_FRAGMENT}
`;

export const DELETE_ADMINISTRATOR = gql`
    mutation DeleteAdministrator($id: ID!) {
        deleteAdministrator(id: $id) {
            message
            result
        }
    }
`;
