import { mergeConfig } from '@vendure/core';
import { createTestEnvironment } from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';
import { ReplaySubject } from 'rxjs';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { testConfig, TEST_SETUP_TIMEOUT_MS } from '../../../e2e-common/test-config';

import {
    TransactionTestPlugin,
    TRIGGER_ATTEMPTED_READ_EMAIL,
    TRIGGER_ATTEMPTED_UPDATE_EMAIL,
} from './fixtures/test-plugins/transaction-test-plugin';

describe('Transaction infrastructure', () => {
    const { server, adminClient } = createTestEnvironment(
        mergeConfig(testConfig(), {
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

    it('failing mutation inside connection.withTransaction() wrapper with request context', async () => {
        try {
            await adminClient.query(CREATE_ADMIN5, {
                emailAddress: 'test5',
                fail: true,
                noContext: false,
            });
            fail('Should have thrown');
        } catch (e) {
            expect(e.message).toContain('Failed!');
        }

        const { verify } = await adminClient.query(VERIFY_TEST);

        expect(verify.admins.length).toBe(2);
        expect(verify.users.length).toBe(3);
        expect(!!verify.admins.find((a: any) => a.emailAddress === 'test5')).toBe(false);
        expect(!!verify.users.find((u: any) => u.identifier === 'test5')).toBe(false);
    });

    it('failing mutation inside connection.withTransaction() wrapper without request context', async () => {
        try {
            await adminClient.query(CREATE_ADMIN5, {
                emailAddress: 'test5',
                fail: true,
                noContext: true,
            });
            fail('Should have thrown');
        } catch (e) {
            expect(e.message).toContain('Failed!');
        }

        const { verify } = await adminClient.query(VERIFY_TEST);

        expect(verify.admins.length).toBe(2);
        expect(verify.users.length).toBe(3);
        expect(!!verify.admins.find((a: any) => a.emailAddress === 'test5')).toBe(false);
        expect(!!verify.users.find((u: any) => u.identifier === 'test5')).toBe(false);
    });

    // Testing https://github.com/vendure-ecommerce/vendure/issues/520
    it('passing transaction via EventBus', async () => {
        TransactionTestPlugin.reset();
        const { createTestAdministrator } = await adminClient.query(CREATE_ADMIN, {
            emailAddress: TRIGGER_ATTEMPTED_UPDATE_EMAIL,
            fail: false,
        });
        await TransactionTestPlugin.eventHandlerComplete$.toPromise();
        expect(createTestAdministrator.emailAddress).toBe(TRIGGER_ATTEMPTED_UPDATE_EMAIL);
        expect(TransactionTestPlugin.errorHandler).not.toHaveBeenCalled();
    });

    // Testing https://github.com/vendure-ecommerce/vendure/issues/1107
    it('passing transaction via EventBus with delay in committing transaction', async () => {
        TransactionTestPlugin.reset();
        const { createTestAdministrator4 } = await adminClient.query(CREATE_ADMIN4, {
            emailAddress: TRIGGER_ATTEMPTED_READ_EMAIL,
            fail: false,
        });
        await TransactionTestPlugin.eventHandlerComplete$.toPromise();
        expect(createTestAdministrator4.emailAddress).toBe(TRIGGER_ATTEMPTED_READ_EMAIL);
        expect(TransactionTestPlugin.errorHandler).not.toHaveBeenCalled();
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
    mutation CreateTestAdmin3($emailAddress: String!, $fail: Boolean!) {
        createTestAdministrator3(emailAddress: $emailAddress, fail: $fail) {
            ...CreatedAdmin
        }
    }
    ${ADMIN_FRAGMENT}
`;

const CREATE_ADMIN4 = gql`
    mutation CreateTestAdmin4($emailAddress: String!, $fail: Boolean!) {
        createTestAdministrator4(emailAddress: $emailAddress, fail: $fail) {
            ...CreatedAdmin
        }
    }
    ${ADMIN_FRAGMENT}
`;

const CREATE_ADMIN5 = gql`
    mutation CreateTestAdmin5($emailAddress: String!, $fail: Boolean!, $noContext: Boolean!) {
        createTestAdministrator5(emailAddress: $emailAddress, fail: $fail, noContext: $noContext) {
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
