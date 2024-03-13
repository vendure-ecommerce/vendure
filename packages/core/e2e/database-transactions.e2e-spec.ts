import { mergeConfig } from '@vendure/core';
import { createTestEnvironment } from '@vendure/testing';
import { fail } from 'assert';
import gql from 'graphql-tag';
import path from 'path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { TEST_SETUP_TIMEOUT_MS, testConfig } from '../../../e2e-common/test-config';

import {
    TransactionTestPlugin,
    TRIGGER_ATTEMPTED_READ_EMAIL,
    TRIGGER_ATTEMPTED_UPDATE_EMAIL,
    TRIGGER_NO_OPERATION,
} from './fixtures/test-plugins/transaction-test-plugin';

type DBType = 'mysql' | 'postgres' | 'sqlite' | 'sqljs';

const itIfDb = (dbs: DBType[]) => {
    return dbs.includes((process.env.DB as DBType) || 'sqljs') ? it : it.skip;
};

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
        } catch (e: any) {
            expect(e.message).toContain('Failed!');
        }

        const { verify } = await adminClient.query(VERIFY_TEST);

        expect(verify.admins.length).toBe(2);
        expect(verify.users.length).toBe(2);
        expect(!!verify.admins.find((a: any) => a.emailAddress === 'test2')).toBe(false);
        expect(!!verify.users.find((u: any) => u.identifier === 'test2')).toBe(false);
    });

    it('failing mutation with promise concurrent execution', async () => {
        try {
            await adminClient.query(CREATE_N_ADMINS, {
                emailAddress: 'testN-',
                failFactor: 0.4,
                n: 10,
            });
            fail('Should have thrown');
        } catch (e) {
            expect(e.message).toContain('Failed!');
        }

        const { verify } = await adminClient.query(VERIFY_TEST);

        expect(verify.admins.length).toBe(2);
        expect(verify.users.length).toBe(2);
        expect(!!verify.admins.find((a: any) => a.emailAddress.includes('testN'))).toBe(false);
        expect(!!verify.users.find((u: any) => u.identifier.includes('testN'))).toBe(false);
    });

    it('failing manual mutation', async () => {
        try {
            await adminClient.query(CREATE_ADMIN2, {
                emailAddress: 'test3',
                fail: true,
            });
            fail('Should have thrown');
        } catch (e: any) {
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
        } catch (e: any) {
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
        } catch (e: any) {
            expect(e.message).toContain('Failed!');
        }

        const { verify } = await adminClient.query(VERIFY_TEST);

        expect(verify.admins.length).toBe(2);
        expect(verify.users.length).toBe(3);
        expect(!!verify.admins.find((a: any) => a.emailAddress === 'test5')).toBe(false);
        expect(!!verify.users.find((u: any) => u.identifier === 'test5')).toBe(false);
    });

    itIfDb(['postgres', 'mysql'])(
        'failing mutation inside connection.withTransaction() wrapper with context and promise concurrent execution',
        async () => {
            try {
                await adminClient.query(CREATE_N_ADMINS2, {
                    emailAddress: 'testN-',
                    failFactor: 0.4,
                    n: 10,
                });
                fail('Should have thrown');
            } catch (e) {
                expect(e.message).toMatch(
                    /^Failed!|Query runner already released. Cannot run queries anymore.$/,
                );
            }

            const { verify } = await adminClient.query(VERIFY_TEST);

            expect(verify.admins.length).toBe(2);
            expect(verify.users.length).toBe(3);
            expect(!!verify.admins.find((a: any) => a.emailAddress.includes('testN'))).toBe(false);
            expect(!!verify.users.find((u: any) => u.identifier.includes('testN'))).toBe(false);
        },
    );

    it('failing mutation inside connection.withTransaction() wrapper without request context', async () => {
        try {
            await adminClient.query(CREATE_ADMIN5, {
                emailAddress: 'test5',
                fail: true,
                noContext: true,
            });
            fail('Should have thrown');
        } catch (e: any) {
            expect(e.message).toContain('Failed!');
        }

        const { verify } = await adminClient.query(VERIFY_TEST);

        expect(verify.admins.length).toBe(2);
        expect(verify.users.length).toBe(3);
        expect(!!verify.admins.find((a: any) => a.emailAddress === 'test5')).toBe(false);
        expect(!!verify.users.find((u: any) => u.identifier === 'test5')).toBe(false);
    });

    it('non-failing mutation inside connection.withTransaction() wrapper with failing nested transactions and request context', async () => {
        await adminClient.query(CREATE_N_ADMINS3, {
            emailAddress: 'testNestedTransactionsN-',
            failFactor: 0.5,
            n: 2,
        });

        const { verify } = await adminClient.query(VERIFY_TEST);

        expect(verify.admins.length).toBe(3);
        expect(verify.users.length).toBe(4);
        expect(
            verify.admins.filter((a: any) => a.emailAddress.includes('testNestedTransactionsN')),
        ).toHaveLength(1);
        expect(
            verify.users.filter((u: any) => u.identifier.includes('testNestedTransactionsN')),
        ).toHaveLength(1);
    });

    it('event do not publish after transaction rollback', async () => {
        TransactionTestPlugin.reset();
        try {
            await adminClient.query(CREATE_N_ADMINS, {
                emailAddress: TRIGGER_NO_OPERATION,
                failFactor: 0.5,
                n: 2,
            });
            fail('Should have thrown');
        } catch (e) {
            expect(e.message).toContain('Failed!');
        }

        // Wait a bit to see an events in handler
        await new Promise(resolve => setTimeout(resolve, 100));

        expect(TransactionTestPlugin.callHandler).not.toHaveBeenCalled();
        expect(TransactionTestPlugin.errorHandler).not.toHaveBeenCalled();
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

const CREATE_N_ADMINS = gql`
    mutation CreateNTestAdmins($emailAddress: String!, $failFactor: Float!, $n: Int!) {
        createNTestAdministrators(emailAddress: $emailAddress, failFactor: $failFactor, n: $n)
    }
`;

const CREATE_N_ADMINS2 = gql`
    mutation CreateNTestAdmins2($emailAddress: String!, $failFactor: Float!, $n: Int!) {
        createNTestAdministrators2(emailAddress: $emailAddress, failFactor: $failFactor, n: $n)
    }
`;

const CREATE_N_ADMINS3 = gql`
    mutation CreateNTestAdmins3($emailAddress: String!, $failFactor: Float!, $n: Int!) {
        createNTestAdministrators3(emailAddress: $emailAddress, failFactor: $failFactor, n: $n)
    }
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
