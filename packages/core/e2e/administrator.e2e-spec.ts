import { createTestEnvironment } from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { TEST_SETUP_TIMEOUT_MS, testConfig } from '../../../e2e-common/test-config';

import { ADMINISTRATOR_FRAGMENT } from './graphql/fragments';
import {
    Administrator,
    CreateAdministrator,
    GetAdministrator,
    GetAdministrators,
    UpdateAdministrator,
} from './graphql/generated-e2e-admin-types';
import { CREATE_ADMINISTRATOR } from './graphql/shared-definitions';
import { assertThrowsWithMessage } from './utils/assert-throws-with-message';

describe('Administrator resolver', () => {
    const { server, adminClient } = createTestEnvironment(testConfig);
    let createdAdmin: Administrator.Fragment;

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
        const result = await adminClient.query<GetAdministrators.Query, GetAdministrators.Variables>(
            GET_ADMINISTRATORS,
        );
        expect(result.administrators.items.length).toBe(1);
        expect(result.administrators.totalItems).toBe(1);
    });

    it('createAdministrator', async () => {
        const result = await adminClient.query<CreateAdministrator.Mutation, CreateAdministrator.Variables>(
            CREATE_ADMINISTRATOR,
            {
                input: {
                    emailAddress: 'test@test.com',
                    firstName: 'First',
                    lastName: 'Last',
                    password: 'password',
                    roleIds: ['1'],
                },
            },
        );

        createdAdmin = result.createAdministrator;
        expect(createdAdmin).toMatchSnapshot();
    });

    it('administrator', async () => {
        const result = await adminClient.query<GetAdministrator.Query, GetAdministrator.Variables>(
            GET_ADMINISTRATOR,
            {
                id: createdAdmin.id,
            },
        );
        expect(result.administrator).toEqual(createdAdmin);
    });

    it('updateAdministrator', async () => {
        const result = await adminClient.query<UpdateAdministrator.Mutation, UpdateAdministrator.Variables>(
            UPDATE_ADMINISTRATOR,
            {
                input: {
                    id: createdAdmin.id,
                    emailAddress: 'new-email',
                    firstName: 'new first',
                    lastName: 'new last',
                    password: 'new password',
                    roleIds: ['2'],
                },
            },
        );
        expect(result.updateAdministrator).toMatchSnapshot();
    });

    it('updateAdministrator works with partial input', async () => {
        const result = await adminClient.query<UpdateAdministrator.Mutation, UpdateAdministrator.Variables>(
            UPDATE_ADMINISTRATOR,
            {
                input: {
                    id: createdAdmin.id,
                    emailAddress: 'newest-email',
                },
            },
        );
        expect(result.updateAdministrator.emailAddress).toBe('newest-email');
        expect(result.updateAdministrator.firstName).toBe('new first');
        expect(result.updateAdministrator.lastName).toBe('new last');
    });

    it(
        'updateAdministrator throws with invalid roleId',
        assertThrowsWithMessage(
            () =>
                adminClient.query<UpdateAdministrator.Mutation, UpdateAdministrator.Variables>(
                    UPDATE_ADMINISTRATOR,
                    {
                        input: {
                            id: createdAdmin.id,
                            emailAddress: 'new-email',
                            firstName: 'new first',
                            lastName: 'new last',
                            password: 'new password',
                            roleIds: ['999'],
                        },
                    },
                ),
            `No Role with the id '999' could be found`,
        ),
    );
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

export const UPDATE_ADMINISTRATOR = gql`
    mutation UpdateAdministrator($input: UpdateAdministratorInput!) {
        updateAdministrator(input: $input) {
            ...Administrator
        }
    }
    ${ADMINISTRATOR_FRAGMENT}
`;
