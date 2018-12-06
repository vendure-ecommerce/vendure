import {
    Administrator,
    CreateAdministrator,
    GetAdministrator,
    GetAdministrators,
    UpdateAdministrator,
} from '../../shared/generated-types';

import {
    CREATE_ADMINISTRATOR,
    GET_ADMINISTRATOR,
    GET_ADMINISTRATORS,
    UPDATE_ADMINISTRATOR,
} from '../../admin-ui/src/app/data/definitions/administrator-definitions';

import { TEST_SETUP_TIMEOUT_MS } from './config/test-config';
import { TestClient } from './test-client';
import { TestServer } from './test-server';

describe('Administrator resolver', () => {
    const client = new TestClient();
    const server = new TestServer();
    let createdAdmin: Administrator.Fragment;

    beforeAll(async () => {
        const token = await server.init({
            productCount: 1,
            customerCount: 1,
        });
        await client.init();
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    it('administrators', async () => {
        const result = await client.query<GetAdministrators.Query, GetAdministrators.Variables>(
            GET_ADMINISTRATORS,
        );
        expect(result.administrators.items.length).toBe(1);
        expect(result.administrators.totalItems).toBe(1);
    });

    it('createAdministrator', async () => {
        const result = await client.query<CreateAdministrator.Mutation, CreateAdministrator.Variables>(
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
        const result = await client.query<GetAdministrator.Query, GetAdministrator.Variables>(
            GET_ADMINISTRATOR,
            {
                id: createdAdmin.id,
            },
        );
        expect(result.administrator).toEqual(createdAdmin);
    });

    it('updateAdministrator', async () => {
        const result = await client.query<UpdateAdministrator.Mutation, UpdateAdministrator.Variables>(
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
        const result = await client.query<UpdateAdministrator.Mutation, UpdateAdministrator.Variables>(
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

    it('updateAdministrator throws with invalid roleId', async () => {
        try {
            const result = await client.query<UpdateAdministrator.Mutation, UpdateAdministrator.Variables>(
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
            );
            fail(`Should throw`);
        } catch (err) {
            expect(err.message).toEqual(expect.stringContaining(`No Role with the id '999' could be found`));
        }
    });
});
