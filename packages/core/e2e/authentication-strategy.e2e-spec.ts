/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ErrorCode, HistoryEntryType } from '@vendure/common/lib/generated-types';
import { pick } from '@vendure/common/lib/pick';
import {
    Customer,
    mergeConfig,
    NativeAuthenticationStrategy,
    TransactionalConnection,
    User,
} from '@vendure/core';
import { createErrorResultGuard, createTestEnvironment, ErrorResultGuard } from '@vendure/testing';
import path from 'path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { TEST_SETUP_TIMEOUT_MS, testConfig } from '../../../e2e-common/test-config';

import {
    TestAuthenticationStrategy,
    TestAuthenticationStrategy2,
    TestSSOStrategyAdmin,
    TestSSOStrategyAdminAvatarSync,
    TestSSOStrategyShop,
    TestUnverifiedEmailStrategy,
    VALID_AUTH_TOKEN,
} from './fixtures/test-authentication-strategies';
import { currentUserFragment, customerFragment } from './graphql/fragments-admin';
import { FragmentOf } from './graphql/graphql-admin';
import {
    attemptLoginDocument,
    authenticateDocument,
    createCustomerDocument,
    deleteCustomerDocument,
    getActiveAdministratorAvatarDocument,
    getCustomerHistoryDocument,
    getCustomerListDocument,
    getCustomersDocument,
    getCustomerUserAuthDocument,
    MeDocument,
    updateCustomerDocument,
} from './graphql/shared-definitions';
import {
    addItemToOrderDocument,
    registerAccountDocument,
    setCustomerDocument,
} from './graphql/shop-definitions';
import { assertThrowsWithMessage } from './utils/assert-throws-with-message';

type CurrentUserFragmentType = FragmentOf<typeof currentUserFragment>;
const currentUserGuard: ErrorResultGuard<CurrentUserFragmentType> = createErrorResultGuard(
    input => input.identifier != null,
);

type CustomerFragmentType = FragmentOf<typeof customerFragment>;
const customerGuard: ErrorResultGuard<CustomerFragmentType> = createErrorResultGuard(
    input => input.emailAddress != null,
);

describe('AuthenticationStrategy', () => {
    const { server, adminClient, shopClient } = createTestEnvironment(
        mergeConfig(testConfig(), {
            authOptions: {
                shopAuthenticationStrategy: [
                    new NativeAuthenticationStrategy(),
                    new TestAuthenticationStrategy(),
                    new TestAuthenticationStrategy2(),
                    new TestSSOStrategyShop(),
                    new TestUnverifiedEmailStrategy(),
                ],
                adminAuthenticationStrategy: [
                    new NativeAuthenticationStrategy(),
                    new TestSSOStrategyAdmin(),
                    new TestSSOStrategyAdminAvatarSync(),
                ],
            },
        }),
    );

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

    describe('external auth', () => {
        const userData = {
            email: 'test@email.com',
            firstName: 'Cixin',
            lastName: 'Liu',
        };
        let newCustomerId: string;

        it('fails with a bad token', async () => {
            const { authenticate } = await shopClient.query(authenticateDocument, {
                input: {
                    test_strategy: {
                        token: 'bad-token',
                    },
                },
            });

            expect(authenticate.message).toBe('The provided credentials are invalid');
            expect(authenticate.errorCode).toBe(ErrorCode.INVALID_CREDENTIALS_ERROR);
            expect(authenticate.authenticationError).toBe('');
        });

        it('fails with an expired token', async () => {
            const { authenticate } = await shopClient.query(authenticateDocument, {
                input: {
                    test_strategy: {
                        token: 'expired-token',
                    },
                },
            });

            expect(authenticate.message).toBe('The provided credentials are invalid');
            expect(authenticate.errorCode).toBe(ErrorCode.INVALID_CREDENTIALS_ERROR);
            expect(authenticate.authenticationError).toBe('Expired token');
        });

        it('creates a new Customer with valid token', async () => {
            const { customers: before } = await adminClient.query(getCustomersDocument);
            expect(before.totalItems).toBe(1);

            const { authenticate } = await shopClient.query(authenticateDocument, {
                input: {
                    test_strategy: {
                        token: VALID_AUTH_TOKEN,
                        userData,
                    },
                },
            });
            currentUserGuard.assertSuccess(authenticate);

            expect(authenticate.identifier).toEqual(userData.email);

            const { customers: after } = await adminClient.query(getCustomersDocument);
            expect(after.totalItems).toBe(2);
            expect(after.items.map(i => i.emailAddress)).toEqual([
                'hayden.zieme12@hotmail.com',
                userData.email,
            ]);
            newCustomerId = after.items[1].id;
        });

        it('creates customer history entry', async () => {
            const { customer } = await adminClient.query(getCustomerHistoryDocument, {
                id: newCustomerId,
            });

            expect(
                customer?.history.items.sort((a, b) => (a.id > b.id ? 1 : -1)).map(pick(['type', 'data'])),
            ).toEqual([
                {
                    type: HistoryEntryType.CUSTOMER_REGISTERED,
                    data: {
                        strategy: 'test_strategy',
                    },
                },
                {
                    type: HistoryEntryType.CUSTOMER_VERIFIED,
                    data: {
                        strategy: 'test_strategy',
                    },
                },
            ]);
        });

        it('user authenticationMethod populated', async () => {
            const { customer } = await adminClient.query(getCustomerUserAuthDocument, {
                id: newCustomerId,
            });

            expect(customer?.user?.authenticationMethods.length).toBe(1);
            expect(customer?.user?.authenticationMethods[0].strategy).toBe('test_strategy');
        });

        it('creates authenticated session', async () => {
            const { me } = await shopClient.query(MeDocument);

            expect(me?.identifier).toBe(userData.email);
        });

        it('log out', async () => {
            await shopClient.asAnonymousUser();
        });

        it('logging in again re-uses created User & Customer', async () => {
            const { authenticate } = await shopClient.query(authenticateDocument, {
                input: {
                    test_strategy: {
                        token: VALID_AUTH_TOKEN,
                        userData,
                    },
                },
            });
            currentUserGuard.assertSuccess(authenticate);
            expect(authenticate.identifier).toEqual(userData.email);

            const { customers: after } = await adminClient.query(getCustomersDocument);
            expect(after.totalItems).toBe(2);
            expect(after.items.map(i => i.emailAddress)).toEqual([
                'hayden.zieme12@hotmail.com',
                userData.email,
            ]);
        });

        // https://github.com/vendurehq/vendure/issues/695
        it('multiple external auth strategies to not interfere with one another', async () => {
            const EXPECTED_CUSTOMERS = [
                {
                    emailAddress: 'hayden.zieme12@hotmail.com',
                    id: 'T_1',
                },
                {
                    emailAddress: 'test@email.com',
                    id: 'T_2',
                },
            ];

            const { customers: customers1 } = await adminClient.query(getCustomersDocument);
            expect(customers1.items).toEqual(EXPECTED_CUSTOMERS);
            const { authenticate: auth1 } = await shopClient.query(authenticateDocument, {
                input: {
                    test_strategy2: {
                        token: VALID_AUTH_TOKEN,
                        email: userData.email,
                    },
                },
            });

            currentUserGuard.assertSuccess(auth1);
            expect(auth1.identifier).toBe(userData.email);

            const { customers: customers2 } = await adminClient.query(getCustomersDocument);
            expect(customers2.items).toEqual(EXPECTED_CUSTOMERS);

            await shopClient.asAnonymousUser();

            const { authenticate: auth2 } = await shopClient.query(authenticateDocument, {
                input: {
                    test_strategy: {
                        token: VALID_AUTH_TOKEN,
                        userData,
                    },
                },
            });

            currentUserGuard.assertSuccess(auth2);
            expect(auth2.identifier).toBe(userData.email);

            const { customers: customers3 } = await adminClient.query(getCustomersDocument);
            expect(customers3.items).toEqual(EXPECTED_CUSTOMERS);
        });

        it('registerCustomerAccount with external email', async () => {
            const successErrorGuard: ErrorResultGuard<{ success: boolean }> = createErrorResultGuard(
                input => input.success != null,
            );

            const { registerCustomerAccount } = await shopClient.query(registerAccountDocument, {
                input: {
                    emailAddress: userData.email,
                },
            });
            successErrorGuard.assertSuccess(registerCustomerAccount);

            expect(registerCustomerAccount.success).toBe(true);
            const { customer } = await adminClient.query(getCustomerUserAuthDocument, {
                id: newCustomerId,
            });

            expect(customer?.user?.authenticationMethods.length).toBe(3);
            expect(customer?.user?.authenticationMethods.map(m => m.strategy)).toEqual([
                'test_strategy',
                'test_strategy2',
                'native',
            ]);

            const { customer: customer2 } = await adminClient.query(getCustomerHistoryDocument, {
                id: newCustomerId,
                options: {
                    skip: 4,
                },
            });

            expect(customer2?.history.items.map(pick(['type', 'data']))).toEqual([
                {
                    type: HistoryEntryType.CUSTOMER_REGISTERED,
                    data: {
                        strategy: 'native',
                    },
                },
            ]);
        });

        // https://github.com/vendurehq/vendure/issues/926
        it('Customer and Admin external auth does not reuse same User for different strategies', async () => {
            const emailAddress = 'hello@test-domain.com';
            await adminClient.asAnonymousUser();
            const { authenticate: adminAuth } = await adminClient.query(authenticateDocument, {
                input: {
                    test_sso_strategy_admin: {
                        email: emailAddress,
                    },
                },
            });
            currentUserGuard.assertSuccess(adminAuth);

            const { activeAdministrator } = await adminClient.query(getActiveAdministratorAvatarDocument);
            expect(activeAdministrator?.avatar).toMatchObject({
                mimeType: 'image/png',
            });
            expect(activeAdministrator?.avatar?.source).toContain('external-profile.png');

            const { authenticate: shopAuth } = await shopClient.query(authenticateDocument, {
                input: {
                    test_sso_strategy_shop: {
                        email: emailAddress,
                    },
                },
            });
            currentUserGuard.assertSuccess(shopAuth);

            expect(adminAuth.id).not.toBe(shopAuth.id);
        });

        // A strategy runs while the request is still anonymous, so setAdministratorAvatar() cannot
        // read the Administrator through a permission-scoped lookup.
        it('a strategy can synchronize the Administrator avatar during authentication', async () => {
            const emailAddress = 'avatar-sync@test-domain.com';
            await adminClient.asAnonymousUser();
            const { authenticate: firstLogin } = await adminClient.query(authenticateDocument, {
                input: {
                    test_sso_strategy_admin_avatar_sync: {
                        email: emailAddress,
                        avatarFilename: 'first-profile.png',
                    },
                },
            });
            currentUserGuard.assertSuccess(firstLogin);

            const { activeAdministrator: afterFirstLogin } = await adminClient.query(
                getActiveAdministratorAvatarDocument,
            );
            expect(afterFirstLogin?.avatar).toMatchObject({
                mimeType: 'image/png',
            });
            expect(afterFirstLogin?.avatar?.source).toContain('first-profile.png');

            // Logging in again syncs a new image, which replaces the one already stored.
            await adminClient.asAnonymousUser();
            const { authenticate: secondLogin } = await adminClient.query(authenticateDocument, {
                input: {
                    test_sso_strategy_admin_avatar_sync: {
                        email: emailAddress,
                        avatarFilename: 'second-profile.png',
                    },
                },
            });
            currentUserGuard.assertSuccess(secondLogin);

            const { activeAdministrator: afterSecondLogin } = await adminClient.query(
                getActiveAdministratorAvatarDocument,
            );
            expect(afterSecondLogin?.avatar?.source).toContain('second-profile.png');
            expect(afterSecondLogin?.avatar?.id).not.toBe(afterFirstLogin?.avatar?.id);
        });
    });

    // GHSA-6j36-r6pr-59x4 — an external auth strategy that forwards an unverified email must not be
    // able to link to (and thereby take over) a pre-existing account with the same email address.
    describe('account-takeover protection (GHSA-6j36-r6pr-59x4)', () => {
        const victimEmail = 'victim-ghsa@test.com';
        let victimCustomerId: string;

        beforeAll(async () => {
            const { createCustomer } = await adminClient.query(createCustomerDocument, {
                input: { firstName: 'Victim', lastName: 'User', emailAddress: victimEmail },
                password: 'victim-password',
            });
            customerGuard.assertSuccess(createCustomer);
            victimCustomerId = createCustomer.id;
        });

        it(
            'rejects linking an unverified external identity to an existing account',
            assertThrowsWithMessage(
                () =>
                    shopClient.query(authenticateDocument, {
                        input: { test_unverified_strategy: { email: victimEmail } },
                    }),
                'Cannot link an unverified external authentication method to an existing account',
            ),
        );

        it('does not attach the external auth method to the victim account', async () => {
            const { customer } = await adminClient.query(getCustomerUserAuthDocument, {
                id: victimCustomerId,
            });
            const strategies = customer?.user?.authenticationMethods.map(m => m.strategy) ?? [];
            expect(strategies).not.toContain('test_unverified_strategy');
        });

        it('still allows new-account creation from an unverified external email', async () => {
            // The guard is scoped to the linking case only: a brand-new email (no pre-existing
            // account) must still be able to create an account even when verified === false.
            const newEmail = 'fresh-unverified-ghsa@test.com';
            await shopClient.asAnonymousUser();
            const { authenticate } = await shopClient.query(authenticateDocument, {
                input: { test_unverified_strategy: { email: newEmail } },
            });
            currentUserGuard.assertSuccess(authenticate);
            expect(authenticate.identifier).toBe(newEmail);
        });
    });

    // #5559 — external logins should store the email address in lowercase and match it regardless of case
    describe('email address case of external logins', () => {
        async function getCustomersByEmail(emailAddress: string) {
            const { customers } = await adminClient.query(getCustomerListDocument, {
                options: { filter: { emailAddress: { contains: emailAddress } } },
            });
            return customers.items;
        }

        // Simulates a Customer which an external login saved with capital letters before this fix
        async function setStoredEmailAddress(customer: CustomerFragmentType, emailAddress: string) {
            const { rawConnection } = server.app.get(TransactionalConnection);
            await rawConnection
                .getRepository(Customer)
                .update(customer.id.replace('T_', ''), { emailAddress });
            await rawConnection
                .getRepository(User)
                .update(customer.user!.id.replace('T_', ''), { identifier: emailAddress });
        }

        it('stores the email address of a new Customer in lowercase', async () => {
            await shopClient.asAnonymousUser();
            const { authenticate } = await shopClient.query(authenticateDocument, {
                input: { test_sso_strategy_shop: { email: 'Case.Test@test-domain.com' } },
            });
            currentUserGuard.assertSuccess(authenticate);

            expect(authenticate.identifier).toBe('case.test@test-domain.com');
            const customers = await getCustomersByEmail('case.test@test-domain.com');
            expect(customers.map(c => c.emailAddress)).toEqual(['case.test@test-domain.com']);
        });

        it('links a login with the same email address in different case to the existing Customer', async () => {
            await shopClient.asAnonymousUser();
            const { authenticate: first } = await shopClient.query(authenticateDocument, {
                input: { test_sso_strategy_shop: { email: 'Case.Test@test-domain.com' } },
            });
            currentUserGuard.assertSuccess(first);

            await shopClient.asAnonymousUser();
            const { authenticate: second } = await shopClient.query(authenticateDocument, {
                input: { test_sso_strategy_shop: { email: 'case.test@test-domain.com' } },
            });
            currentUserGuard.assertSuccess(second);

            expect(second.id).toBe(first.id);
            const customers = await getCustomersByEmail('case.test@test-domain.com');
            expect(customers).toHaveLength(1);

            // Both logins are recorded in the history of the one Customer
            const { customer } = await adminClient.query(getCustomerHistoryDocument, {
                id: customers[0].id,
                options: { filter: { type: { eq: HistoryEntryType.CUSTOMER_REGISTERED } } },
            });
            expect(customer?.history.items.map(i => i.data)).toEqual([
                { strategy: 'test_sso_strategy_shop' },
                { strategy: 'test_sso_strategy_shop' },
            ]);
        });

        it('finds an existing Customer whose email address was stored with capital letters', async () => {
            const { createCustomer } = await adminClient.query(createCustomerDocument, {
                input: {
                    firstName: 'Legacy',
                    lastName: 'Case',
                    emailAddress: 'legacy.login@test-domain.com',
                },
            });
            customerGuard.assertSuccess(createCustomer);
            await setStoredEmailAddress(createCustomer, 'Legacy.Login@test-domain.com');

            await shopClient.asAnonymousUser();
            const { authenticate } = await shopClient.query(authenticateDocument, {
                input: { test_sso_strategy_shop: { email: 'legacy.login@test-domain.com' } },
            });
            currentUserGuard.assertSuccess(authenticate);

            const customers = await getCustomersByEmail('legacy.login@test-domain.com');
            expect(customers.map(c => c.id)).toEqual([createCustomer.id]);
            expect(customers[0].user?.id).toBe(authenticate.id);
        });

        it('is not hidden by a guest Customer with the same email address', async () => {
            // A guest checkout creates a Customer without a User
            await shopClient.asAnonymousUser();
            await shopClient.query(addItemToOrderDocument, { productVariantId: 'T_1', quantity: 1 });
            await shopClient.query(setCustomerDocument, {
                input: { firstName: 'Guest', lastName: 'Case', emailAddress: 'guest.case@test-domain.com' },
            });
            const { createCustomer } = await adminClient.query(createCustomerDocument, {
                input: {
                    firstName: 'Registered',
                    lastName: 'Case',
                    emailAddress: 'temp.guest@test-domain.com',
                },
            });
            customerGuard.assertSuccess(createCustomer);
            await setStoredEmailAddress(createCustomer, 'Guest.Case@test-domain.com');

            await shopClient.asAnonymousUser();
            const { authenticate } = await shopClient.query(authenticateDocument, {
                input: { test_sso_strategy_shop: { email: 'guest.case@test-domain.com' } },
            });
            currentUserGuard.assertSuccess(authenticate);

            expect(authenticate.id).toBe(createCustomer.user?.id);
            expect(await getCustomersByEmail('guest.case@test-domain.com')).toHaveLength(2);
        });

        it('links the oldest of several Customers with the same email address in different case', async () => {
            const { createCustomer: lowerId } = await adminClient.query(createCustomerDocument, {
                input: { firstName: 'Lower', lastName: 'Case', emailAddress: 'temp.lower@test-domain.com' },
            });
            customerGuard.assertSuccess(lowerId);
            const { createCustomer: higherId } = await adminClient.query(createCustomerDocument, {
                input: { firstName: 'Higher', lastName: 'Case', emailAddress: 'temp.higher@test-domain.com' },
            });
            customerGuard.assertSuccess(higherId);
            await setStoredEmailAddress(lowerId, 'Several.Case@test-domain.com');
            await setStoredEmailAddress(higherId, 'several.case@test-domain.com');
            // Make the Customer with the higher id the older one, so that the order of the ids
            // does not decide the result
            const { rawConnection } = server.app.get(TransactionalConnection);
            await rawConnection
                .getRepository(Customer)
                .update(higherId.id.replace('T_', ''), { createdAt: new Date('2020-01-01') });

            await shopClient.asAnonymousUser();
            const { authenticate } = await shopClient.query(authenticateDocument, {
                input: { test_sso_strategy_shop: { email: 'SEVERAL.CASE@test-domain.com' } },
            });
            currentUserGuard.assertSuccess(authenticate);

            expect(authenticate.id).toBe(higherId.user?.id);
        });

        it('rejects linking an unverified login whose email address differs only in case', async () => {
            const { createCustomer } = await adminClient.query(createCustomerDocument, {
                input: { firstName: 'Case', lastName: 'Victim', emailAddress: 'case.victim@test-domain.com' },
                password: 'victim-password',
            });
            customerGuard.assertSuccess(createCustomer);

            await shopClient.asAnonymousUser();
            await expect(
                shopClient.query(authenticateDocument, {
                    input: { test_unverified_strategy: { email: 'Case.Victim@test-domain.com' } },
                }),
            ).rejects.toThrow(
                'Cannot link an unverified external authentication method to an existing account',
            );
        });

        it('can save a Customer whose email address was stored with capital letters', async () => {
            // Two Customers whose email addresses differ only in case, as created by external logins
            // before this fix
            const { createCustomer: lowercase } = await adminClient.query(createCustomerDocument, {
                input: {
                    firstName: 'Lower',
                    lastName: 'Case',
                    emailAddress: 'duplicate.case@test-domain.com',
                },
            });
            customerGuard.assertSuccess(lowercase);
            const { createCustomer: capitalized } = await adminClient.query(createCustomerDocument, {
                input: { firstName: 'Upper', lastName: 'Case', emailAddress: 'temp.case@test-domain.com' },
            });
            customerGuard.assertSuccess(capitalized);
            await setStoredEmailAddress(capitalized, 'Duplicate.Case@test-domain.com');

            const { updateCustomer } = await adminClient.query(updateCustomerDocument, {
                input: {
                    id: capitalized.id,
                    emailAddress: 'Duplicate.Case@test-domain.com',
                    firstName: 'Changed',
                },
            });
            customerGuard.assertSuccess(updateCustomer);

            expect(updateCustomer.firstName).toBe('Changed');
            // The email address, the User identifier and the history all use the lowercase form
            expect(updateCustomer.emailAddress).toBe('duplicate.case@test-domain.com');
            expect(updateCustomer.user?.identifier).toBe('duplicate.case@test-domain.com');
            const { customer } = await adminClient.query(getCustomerHistoryDocument, {
                id: capitalized.id,
                options: { filter: { type: { eq: HistoryEntryType.CUSTOMER_DETAIL_UPDATED } } },
            });
            expect(customer?.history.items.map(i => i.data.input.emailAddress)).toEqual([
                'duplicate.case@test-domain.com',
            ]);
        });

        it('still rejects changing the email address to one used by another Customer', async () => {
            const { createCustomer: existing } = await adminClient.query(createCustomerDocument, {
                input: { firstName: 'Taken', lastName: 'Case', emailAddress: 'taken.case@test-domain.com' },
            });
            customerGuard.assertSuccess(existing);
            const { createCustomer } = await adminClient.query(createCustomerDocument, {
                input: { firstName: 'Other', lastName: 'Case', emailAddress: 'other.case@test-domain.com' },
            });
            customerGuard.assertSuccess(createCustomer);

            const { updateCustomer } = await adminClient.query(updateCustomerDocument, {
                input: { id: createCustomer.id, emailAddress: 'Taken.Case@test-domain.com' },
            });
            customerGuard.assertErrorResult(updateCustomer);

            expect(updateCustomer.errorCode).toBe(ErrorCode.EMAIL_ADDRESS_CONFLICT_ERROR);
        });
    });

    describe('native auth', () => {
        const testEmailAddress = 'test-person@testdomain.com';

        // https://github.com/vendurehq/vendure/issues/486#issuecomment-704991768
        it('allows login for an email address which is shared by a previously-deleted Customer', async () => {
            const { createCustomer: result1 } = await adminClient.query(createCustomerDocument, {
                input: {
                    firstName: 'Test',
                    lastName: 'Person',
                    emailAddress: testEmailAddress,
                },
                password: 'password1',
            });
            customerGuard.assertSuccess(result1);

            await adminClient.query(deleteCustomerDocument, {
                id: result1.id,
            });

            const { createCustomer: result2 } = await adminClient.query(createCustomerDocument, {
                input: {
                    firstName: 'Test',
                    lastName: 'Person',
                    emailAddress: testEmailAddress,
                },
                password: 'password2',
            });
            customerGuard.assertSuccess(result2);

            const { authenticate } = await shopClient.query(authenticateDocument, {
                input: {
                    native: {
                        username: testEmailAddress,
                        password: 'password2',
                    },
                },
            });
            currentUserGuard.assertSuccess(authenticate);

            expect(pick(authenticate, ['id', 'identifier'])).toEqual({
                id: result2.user!.id,
                identifier: result2.emailAddress,
            });
        });
    });
});

describe('No NativeAuthStrategy on Shop API', () => {
    const { server, adminClient, shopClient } = createTestEnvironment(
        mergeConfig(testConfig(), {
            authOptions: {
                shopAuthenticationStrategy: [new TestAuthenticationStrategy()],
            },
        }),
    );

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

    // https://github.com/vendurehq/vendure/issues/2282
    it('can log in to Admin API', async () => {
        const { login } = await adminClient.query(attemptLoginDocument, {
            username: 'superadmin',
            password: 'superadmin',
        });

        currentUserGuard.assertSuccess(login);
        expect(login.identifier).toBe('superadmin');
    });
});
