import { mergeConfig } from '@vendure/core';
import { createTestEnvironment } from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { testConfig, TEST_SETUP_TIMEOUT_MS } from '../../../e2e-common/test-config';

import { TransactionTestPlugin } from './fixtures/test-plugins/transaction-test-plugin';

describe('Transaction infrastructure', () => {
    const { server, adminClient } = createTestEnvironment(
        mergeConfig(testConfig, {
            plugins: [TransactionTestPlugin],
        }),
    );

    beforeAll(async () => {
        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-minimal.csv'),
            customerCount: 0,
        });
        await adminClient.asSuperAdmin();
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    it('non-failing mutation', async () => {
        const { createTestAdministrator } = await adminClient.query(CREATE_ADMIN, {
            emailAddress: 'test1',
            fail: false,
        });

        expect(createTestAdministrator.emailAddress).toBe('test1');
        expect(createTestAdministrator.user.identifier).toBe('test1');

        const { verify } = await adminClient.query(VERIFY_TEST);

        expect(verify.admins.length).toBe(2);
        expect(verify.users.length).toBe(2);
        expect(!!verify.admins.find((a: any) => a.emailAddress === 'test1')).toBe(true);
        expect(!!verify.users.find((u: any) => u.identifier === 'test1')).toBe(true);
    });

    it('failing mutation', async () => {
        try {
            await adminClient.query(CREATE_ADMIN, {
                emailAddress: 'test2',
                fail: true,
            });
            fail('Should have thrown');
        } catch (e) {
            expect(e.message).toContain('Failed!');
        }

        const { verify } = await adminClient.query(VERIFY_TEST);

        expect(verify.admins.length).toBe(2);
        expect(verify.users.length).toBe(2);
        expect(!!verify.admins.find((a: any) => a.emailAddress === 'test2')).toBe(false);
        expect(!!verify.users.find((u: any) => u.identifier === 'test2')).toBe(false);
    });

    it('failing manual mutation', async () => {
        try {
            await adminClient.query(CREATE_ADMIN2, {
                emailAddress: 'test3',
                fail: true,
            });
            fail('Should have thrown');
        } catch (e) {
            expect(e.message).toContain('Failed!');
        }

        const { verify } = await adminClient.query(VERIFY_TEST);

        expect(verify.admins.length).toBe(2);
        expect(verify.users.length).toBe(2);
        expect(!!verify.admins.find((a: any) => a.emailAddress === 'test3')).toBe(false);
        expect(!!verify.users.find((u: any) => u.identifier === 'test3')).toBe(false);
    });

    it('failing manual mutation without transaction', async () => {
        try {
            await adminClient.query(CREATE_ADMIN3, {
                emailAddress: 'test4',
                fail: true,
            });
            fail('Should have thrown');
        } catch (e) {
            expect(e.message).toContain('Failed!');
        }

        const { verify } = await adminClient.query(VERIFY_TEST);

        expect(verify.admins.length).toBe(2);
        expect(verify.users.length).toBe(3);
        expect(!!verify.admins.find((a: any) => a.emailAddress === 'test4')).toBe(false);
        expect(!!verify.users.find((u: any) => u.identifier === 'test4')).toBe(true);
    });
});

const ADMIN_FRAGMENT = gql`
    fragment CreatedAdmin on Administrator {
        id
        emailAddress
        user {
            id
            identifier
        }
    }
`;

const CREATE_ADMIN = gql`
    mutation CreateTestAdmin($emailAddress: String!, $fail: Boolean!) {
        createTestAdministrator(emailAddress: $emailAddress, fail: $fail) {
            ...CreatedAdmin
        }
    }
    ${ADMIN_FRAGMENT}
`;

const CREATE_ADMIN2 = gql`
    mutation CreateTestAdmin2($emailAddress: String!, $fail: Boolean!) {
        createTestAdministrator2(emailAddress: $emailAddress, fail: $fail) {
            ...CreatedAdmin
        }
    }
    ${ADMIN_FRAGMENT}
`;

const CREATE_ADMIN3 = gql`
    mutation CreateTestAdmin2($emailAddress: String!, $fail: Boolean!) {
        createTestAdministrator3(emailAddress: $emailAddress, fail: $fail) {
            ...CreatedAdmin
        }
    }
    ${ADMIN_FRAGMENT}
`;

const VERIFY_TEST = gql`
    query VerifyTest {
        verify {
            admins {
                id
                emailAddress
            }
            users {
                id
                identifier
            }
        }
    }
`;
