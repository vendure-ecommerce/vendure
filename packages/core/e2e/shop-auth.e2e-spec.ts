/* tslint:disable:no-non-null-assertion */
import { OnModuleInit } from '@nestjs/common';
import { RegisterCustomerInput } from '@vendure/common/lib/generated-shop-types';
import { pick } from '@vendure/common/lib/pick';
import {
    AccountRegistrationEvent,
    EventBus,
    EventBusModule,
    IdentifierChangeEvent,
    IdentifierChangeRequestEvent,
    mergeConfig,
    PasswordResetEvent,
    VendurePlugin,
} from '@vendure/core';
import { createTestEnvironment } from '@vendure/testing';
import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import path from 'path';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { TEST_SETUP_TIMEOUT_MS, testConfig } from '../../../e2e-common/test-config';

import {
    CreateAdministrator,
    CreateRole,
    GetCustomer,
    GetCustomerHistory,
    GetCustomerList,
    HistoryEntryType,
    Permission,
} from './graphql/generated-e2e-admin-types';
import {
    GetActiveCustomer,
    RefreshToken,
    Register,
    RequestPasswordReset,
    RequestUpdateEmailAddress,
    ResetPassword,
    UpdateEmailAddress,
    Verify,
} from './graphql/generated-e2e-shop-types';
import {
    CREATE_ADMINISTRATOR,
    CREATE_ROLE,
    GET_CUSTOMER,
    GET_CUSTOMER_HISTORY,
    GET_CUSTOMER_LIST,
} from './graphql/shared-definitions';
import {
    GET_ACTIVE_CUSTOMER,
    REFRESH_TOKEN,
    REGISTER_ACCOUNT,
    REQUEST_PASSWORD_RESET,
    REQUEST_UPDATE_EMAIL_ADDRESS,
    RESET_PASSWORD,
    UPDATE_EMAIL_ADDRESS,
    VERIFY_EMAIL,
} from './graphql/shop-definitions';
import { assertThrowsWithMessage } from './utils/assert-throws-with-message';

let sendEmailFn: jest.Mock;

/**
 * This mock plugin simulates an EmailPlugin which would send emails
 * on the registration & password reset events.
 */
@VendurePlugin({
    imports: [EventBusModule],
})
class TestEmailPlugin implements OnModuleInit {
    constructor(private eventBus: EventBus) {}
    onModuleInit() {
        this.eventBus.ofType(AccountRegistrationEvent).subscribe((event) => {
            sendEmailFn(event);
        });
        this.eventBus.ofType(PasswordResetEvent).subscribe((event) => {
            sendEmailFn(event);
        });
        this.eventBus.ofType(IdentifierChangeRequestEvent).subscribe((event) => {
            sendEmailFn(event);
        });
        this.eventBus.ofType(IdentifierChangeEvent).subscribe((event) => {
            sendEmailFn(event);
        });
    }
}

describe('Shop auth & accounts', () => {
    const { server, adminClient, shopClient } = createTestEnvironment(
        mergeConfig(testConfig, {
            plugins: [TestEmailPlugin as any],
        }),
    );

    beforeAll(async () => {
        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-minimal.csv'),
            customerCount: 2,
        });
        await adminClient.asSuperAdmin();
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    describe('customer account creation', () => {
        const password = 'password';
        const emailAddress = 'test1@test.com';
        let verificationToken: string;
        let newCustomerId: string;

        beforeEach(() => {
            sendEmailFn = jest.fn();
        });

        it(
            'errors if a password is provided',
            assertThrowsWithMessage(async () => {
                const input: RegisterCustomerInput = {
                    firstName: 'Sofia',
                    lastName: 'Green',
                    emailAddress: 'sofia.green@test.com',
                    password: 'test',
                };
                const result = await shopClient.query<Register.Mutation, Register.Variables>(
                    REGISTER_ACCOUNT,
                    { input },
                );
            }, 'Do not provide a password when `authOptions.requireVerification` is set to "true"'),
        );

        it('register a new account', async () => {
            const verificationTokenPromise = getVerificationTokenPromise();
            const input: RegisterCustomerInput = {
                firstName: 'Sean',
                lastName: 'Tester',
                phoneNumber: '123456',
                emailAddress,
            };
            const result = await shopClient.query<Register.Mutation, Register.Variables>(REGISTER_ACCOUNT, {
                input,
            });

            verificationToken = await verificationTokenPromise;

            expect(result.registerCustomerAccount).toBe(true);
            expect(sendEmailFn).toHaveBeenCalled();
            expect(verificationToken).toBeDefined();

            const { customers } = await adminClient.query<GetCustomerList.Query, GetCustomerList.Variables>(
                GET_CUSTOMER_LIST,
                {
                    options: {
                        filter: {
                            emailAddress: {
                                eq: emailAddress,
                            },
                        },
                    },
                },
            );

            expect(
                pick(customers.items[0], ['firstName', 'lastName', 'emailAddress', 'phoneNumber']),
            ).toEqual(input);
        });

        it('issues a new token if attempting to register a second time', async () => {
            const sendEmail = new Promise<string>((resolve) => {
                sendEmailFn.mockImplementation((event: AccountRegistrationEvent) => {
                    resolve(event.user.getNativeAuthenticationMethod().verificationToken!);
                });
            });
            const input: RegisterCustomerInput = {
                firstName: 'Sean',
                lastName: 'Tester',
                emailAddress,
            };
            const result = await shopClient.query<Register.Mutation, Register.Variables>(REGISTER_ACCOUNT, {
                input,
            });

            const newVerificationToken = await sendEmail;

            expect(result.registerCustomerAccount).toBe(true);
            expect(sendEmailFn).toHaveBeenCalled();
            expect(newVerificationToken).not.toBe(verificationToken);

            verificationToken = newVerificationToken;
        });

        it('refreshCustomerVerification issues a new token', async () => {
            const sendEmail = new Promise<string>((resolve) => {
                sendEmailFn.mockImplementation((event: AccountRegistrationEvent) => {
                    resolve(event.user.getNativeAuthenticationMethod().verificationToken!);
                });
            });
            const result = await shopClient.query<RefreshToken.Mutation, RefreshToken.Variables>(
                REFRESH_TOKEN,
                { emailAddress },
            );

            const newVerificationToken = await sendEmail;

            expect(result.refreshCustomerVerification).toBe(true);
            expect(sendEmailFn).toHaveBeenCalled();
            expect(newVerificationToken).not.toBe(verificationToken);

            verificationToken = newVerificationToken;
        });

        it('refreshCustomerVerification does nothing with an unrecognized emailAddress', async () => {
            const result = await shopClient.query<RefreshToken.Mutation, RefreshToken.Variables>(
                REFRESH_TOKEN,
                {
                    emailAddress: 'never-been-registered@test.com',
                },
            );
            await waitForSendEmailFn();
            expect(result.refreshCustomerVerification).toBe(true);
            expect(sendEmailFn).not.toHaveBeenCalled();
        });

        it('login fails before verification', async () => {
            try {
                await shopClient.asUserWithCredentials(emailAddress, '');
                fail('should have thrown');
            } catch (err) {
                expect(getErrorCode(err)).toBe('UNAUTHORIZED');
            }
        });

        it(
            'verification fails with wrong token',
            assertThrowsWithMessage(
                () =>
                    shopClient.query<Verify.Mutation, Verify.Variables>(VERIFY_EMAIL, {
                        password,
                        token: 'bad-token',
                    }),
                `Verification token not recognized`,
            ),
        );

        it('verification succeeds with correct token', async () => {
            const result = await shopClient.query<Verify.Mutation, Verify.Variables>(VERIFY_EMAIL, {
                password,
                token: verificationToken,
            });

            expect(result.verifyCustomerAccount.user.identifier).toBe('test1@test.com');
            const { activeCustomer } = await shopClient.query<GetActiveCustomer.Query>(GET_ACTIVE_CUSTOMER);
            newCustomerId = activeCustomer!.id;
        });

        it('registration silently fails if attempting to register an email already verified', async () => {
            const input: RegisterCustomerInput = {
                firstName: 'Dodgy',
                lastName: 'Hacker',
                emailAddress,
            };
            const result = await shopClient.query<Register.Mutation, Register.Variables>(REGISTER_ACCOUNT, {
                input,
            });
            await waitForSendEmailFn();
            expect(result.registerCustomerAccount).toBe(true);
            expect(sendEmailFn).not.toHaveBeenCalled();
        });

        it(
            'verification fails if attempted a second time',
            assertThrowsWithMessage(
                () =>
                    shopClient.query<Verify.Mutation, Verify.Variables>(VERIFY_EMAIL, {
                        password,
                        token: verificationToken,
                    }),
                `Verification token not recognized`,
            ),
        );

        it('customer history contains entries for registration & verification', async () => {
            const { customer } = await adminClient.query<
                GetCustomerHistory.Query,
                GetCustomerHistory.Variables
            >(GET_CUSTOMER_HISTORY, {
                id: newCustomerId,
            });

            expect(customer?.history.items.map(pick(['type', 'data']))).toEqual([
                {
                    type: HistoryEntryType.CUSTOMER_REGISTERED,
                    data: {
                        strategy: 'native',
                    },
                },
                {
                    // second entry because we register twice above
                    type: HistoryEntryType.CUSTOMER_REGISTERED,
                    data: {
                        strategy: 'native',
                    },
                },
                {
                    type: HistoryEntryType.CUSTOMER_VERIFIED,
                    data: {
                        strategy: 'native',
                    },
                },
            ]);
        });
    });

    describe('password reset', () => {
        let passwordResetToken: string;
        let customer: GetCustomer.Customer;

        beforeAll(async () => {
            const result = await adminClient.query<GetCustomer.Query, GetCustomer.Variables>(GET_CUSTOMER, {
                id: 'T_1',
            });
            customer = result.customer!;
        });

        beforeEach(() => {
            sendEmailFn = jest.fn();
        });

        it('requestPasswordReset silently fails with invalid identifier', async () => {
            const result = await shopClient.query<
                RequestPasswordReset.Mutation,
                RequestPasswordReset.Variables
            >(REQUEST_PASSWORD_RESET, {
                identifier: 'invalid-identifier',
            });

            await waitForSendEmailFn();
            expect(result.requestPasswordReset).toBe(true);
            expect(sendEmailFn).not.toHaveBeenCalled();
            expect(passwordResetToken).not.toBeDefined();
        });

        it('requestPasswordReset sends reset token', async () => {
            const passwordResetTokenPromise = getPasswordResetTokenPromise();
            const result = await shopClient.query<
                RequestPasswordReset.Mutation,
                RequestPasswordReset.Variables
            >(REQUEST_PASSWORD_RESET, {
                identifier: customer.emailAddress,
            });

            passwordResetToken = await passwordResetTokenPromise;

            expect(result.requestPasswordReset).toBe(true);
            expect(sendEmailFn).toHaveBeenCalled();
            expect(passwordResetToken).toBeDefined();
        });

        it(
            'resetPassword fails with wrong token',
            assertThrowsWithMessage(
                () =>
                    shopClient.query<ResetPassword.Mutation, ResetPassword.Variables>(RESET_PASSWORD, {
                        password: 'newPassword',
                        token: 'bad-token',
                    }),
                `Password reset token not recognized`,
            ),
        );

        it('resetPassword works with valid token', async () => {
            const result = await shopClient.query<ResetPassword.Mutation, ResetPassword.Variables>(
                RESET_PASSWORD,
                {
                    token: passwordResetToken,
                    password: 'newPassword',
                },
            );

            const loginResult = await shopClient.asUserWithCredentials(customer.emailAddress, 'newPassword');
            expect(loginResult.user.identifier).toBe(customer.emailAddress);
        });

        it('customer history for password reset', async () => {
            const result = await adminClient.query<GetCustomerHistory.Query, GetCustomerHistory.Variables>(
                GET_CUSTOMER_HISTORY,
                {
                    id: customer.id,
                    options: {
                        // skip CUSTOMER_ADDRESS_CREATED entry
                        skip: 3,
                    },
                },
            );

            expect(result.customer?.history.items.map(pick(['type', 'data']))).toEqual([
                {
                    type: HistoryEntryType.CUSTOMER_PASSWORD_RESET_REQUESTED,
                    data: {},
                },
                {
                    type: HistoryEntryType.CUSTOMER_PASSWORD_RESET_VERIFIED,
                    data: {},
                },
            ]);
        });
    });

    describe('updating emailAddress', () => {
        let emailUpdateToken: string;
        let customer: GetCustomer.Customer;
        const NEW_EMAIL_ADDRESS = 'new@address.com';
        const PASSWORD = 'newPassword';

        beforeAll(async () => {
            const result = await adminClient.query<GetCustomer.Query, GetCustomer.Variables>(GET_CUSTOMER, {
                id: 'T_1',
            });
            customer = result.customer!;
        });

        beforeEach(() => {
            sendEmailFn = jest.fn();
        });

        it('throws if not logged in', async () => {
            try {
                await shopClient.asAnonymousUser();
                await shopClient.query<
                    RequestUpdateEmailAddress.Mutation,
                    RequestUpdateEmailAddress.Variables
                >(REQUEST_UPDATE_EMAIL_ADDRESS, {
                    password: PASSWORD,
                    newEmailAddress: NEW_EMAIL_ADDRESS,
                });
                fail('should have thrown');
            } catch (err) {
                expect(getErrorCode(err)).toBe('FORBIDDEN');
            }
        });

        it('throws if password is incorrect', async () => {
            try {
                await shopClient.asUserWithCredentials(customer.emailAddress, PASSWORD);
                await shopClient.query<
                    RequestUpdateEmailAddress.Mutation,
                    RequestUpdateEmailAddress.Variables
                >(REQUEST_UPDATE_EMAIL_ADDRESS, {
                    password: 'bad password',
                    newEmailAddress: NEW_EMAIL_ADDRESS,
                });
                fail('should have thrown');
            } catch (err) {
                expect(getErrorCode(err)).toBe('UNAUTHORIZED');
            }
        });

        it(
            'throws if email address already in use',
            assertThrowsWithMessage(async () => {
                await shopClient.asUserWithCredentials(customer.emailAddress, PASSWORD);
                const result = await adminClient.query<GetCustomer.Query, GetCustomer.Variables>(
                    GET_CUSTOMER,
                    { id: 'T_2' },
                );
                const otherCustomer = result.customer!;

                await shopClient.query<
                    RequestUpdateEmailAddress.Mutation,
                    RequestUpdateEmailAddress.Variables
                >(REQUEST_UPDATE_EMAIL_ADDRESS, {
                    password: PASSWORD,
                    newEmailAddress: otherCustomer.emailAddress,
                });
            }, 'This email address is not available'),
        );

        it('triggers event with token', async () => {
            await shopClient.asUserWithCredentials(customer.emailAddress, PASSWORD);
            const emailUpdateTokenPromise = getEmailUpdateTokenPromise();

            await shopClient.query<RequestUpdateEmailAddress.Mutation, RequestUpdateEmailAddress.Variables>(
                REQUEST_UPDATE_EMAIL_ADDRESS,
                {
                    password: PASSWORD,
                    newEmailAddress: NEW_EMAIL_ADDRESS,
                },
            );

            const { identifierChangeToken, pendingIdentifier } = await emailUpdateTokenPromise;
            emailUpdateToken = identifierChangeToken!;

            expect(pendingIdentifier).toBe(NEW_EMAIL_ADDRESS);
            expect(emailUpdateToken).toBeTruthy();
        });

        it('cannot login with new email address before verification', async () => {
            try {
                await shopClient.asUserWithCredentials(NEW_EMAIL_ADDRESS, PASSWORD);
                fail('should have thrown');
            } catch (err) {
                expect(getErrorCode(err)).toBe('UNAUTHORIZED');
            }
        });

        it(
            'throws with bad token',
            assertThrowsWithMessage(async () => {
                await shopClient.query<UpdateEmailAddress.Mutation, UpdateEmailAddress.Variables>(
                    UPDATE_EMAIL_ADDRESS,
                    { token: 'bad token' },
                );
            }, 'Identifier change token not recognized'),
        );

        it('verify the new email address', async () => {
            const result = await shopClient.query<UpdateEmailAddress.Mutation, UpdateEmailAddress.Variables>(
                UPDATE_EMAIL_ADDRESS,
                { token: emailUpdateToken },
            );
            expect(result.updateCustomerEmailAddress).toBe(true);

            expect(sendEmailFn).toHaveBeenCalled();
            expect(sendEmailFn.mock.calls[0][0] instanceof IdentifierChangeEvent).toBe(true);
        });

        it('can login with new email address after verification', async () => {
            await shopClient.asUserWithCredentials(NEW_EMAIL_ADDRESS, PASSWORD);
            const { activeCustomer } = await shopClient.query<GetActiveCustomer.Query>(GET_ACTIVE_CUSTOMER);
            expect(activeCustomer!.id).toBe(customer.id);
            expect(activeCustomer!.emailAddress).toBe(NEW_EMAIL_ADDRESS);
        });

        it('cannot login with old email address after verification', async () => {
            try {
                await shopClient.asUserWithCredentials(customer.emailAddress, PASSWORD);
                fail('should have thrown');
            } catch (err) {
                expect(getErrorCode(err)).toBe('UNAUTHORIZED');
            }
        });

        it('customer history for email update', async () => {
            const result = await adminClient.query<GetCustomerHistory.Query, GetCustomerHistory.Variables>(
                GET_CUSTOMER_HISTORY,
                {
                    id: customer.id,
                    options: {
                        skip: 5,
                    },
                },
            );

            expect(result.customer?.history.items.map(pick(['type', 'data']))).toEqual([
                {
                    type: HistoryEntryType.CUSTOMER_EMAIL_UPDATE_REQUESTED,
                    data: {
                        newEmailAddress: 'new@address.com',
                        oldEmailAddress: 'hayden.zieme12@hotmail.com',
                    },
                },
                {
                    type: HistoryEntryType.CUSTOMER_EMAIL_UPDATE_VERIFIED,
                    data: {
                        newEmailAddress: 'new@address.com',
                        oldEmailAddress: 'hayden.zieme12@hotmail.com',
                    },
                },
            ]);
        });
    });

    async function assertRequestAllowed<V>(operation: DocumentNode, variables?: V) {
        try {
            const status = await shopClient.queryStatus(operation, variables);
            expect(status).toBe(200);
        } catch (e) {
            const errorCode = getErrorCode(e);
            if (!errorCode) {
                fail(`Unexpected failure: ${e}`);
            } else {
                fail(`Operation should be allowed, got status ${getErrorCode(e)}`);
            }
        }
    }

    async function assertRequestForbidden<V>(operation: DocumentNode, variables: V) {
        try {
            const status = await shopClient.query(operation, variables);
            fail(`Should have thrown`);
        } catch (e) {
            expect(getErrorCode(e)).toBe('FORBIDDEN');
        }
    }

    function getErrorCode(err: any): string {
        return err.response.errors[0].extensions.code;
    }

    async function createAdministratorWithPermissions(
        code: string,
        permissions: Permission[],
    ): Promise<{ identifier: string; password: string }> {
        const roleResult = await shopClient.query<CreateRole.Mutation, CreateRole.Variables>(CREATE_ROLE, {
            input: {
                code,
                description: '',
                permissions,
            },
        });

        const role = roleResult.createRole;

        const identifier = `${code}@${Math.random().toString(16).substr(2, 8)}`;
        const password = `test`;

        const adminResult = await shopClient.query<
            CreateAdministrator.Mutation,
            CreateAdministrator.Variables
        >(CREATE_ADMINISTRATOR, {
            input: {
                emailAddress: identifier,
                firstName: code,
                lastName: 'Admin',
                password,
                roleIds: [role.id],
            },
        });
        const admin = adminResult.createAdministrator;

        return {
            identifier,
            password,
        };
    }

    /**
     * A "sleep" function which allows the sendEmailFn time to get called.
     */
    function waitForSendEmailFn() {
        return new Promise((resolve) => setTimeout(resolve, 10));
    }
});

describe('Expiring tokens', () => {
    const { server, adminClient, shopClient } = createTestEnvironment(
        mergeConfig(testConfig, {
            plugins: [TestEmailPlugin as any],
            authOptions: {
                verificationTokenDuration: '1ms',
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

    beforeEach(() => {
        sendEmailFn = jest.fn();
    });

    afterAll(async () => {
        await server.destroy();
    });

    it(
        'attempting to verify after token has expired throws',
        assertThrowsWithMessage(async () => {
            const verificationTokenPromise = getVerificationTokenPromise();
            const input: RegisterCustomerInput = {
                firstName: 'Barry',
                lastName: 'Wallace',
                emailAddress: 'barry.wallace@test.com',
            };
            const result = await shopClient.query<Register.Mutation, Register.Variables>(REGISTER_ACCOUNT, {
                input,
            });

            const verificationToken = await verificationTokenPromise;

            expect(result.registerCustomerAccount).toBe(true);
            expect(sendEmailFn).toHaveBeenCalledTimes(1);
            expect(verificationToken).toBeDefined();

            await new Promise((resolve) => setTimeout(resolve, 3));

            return shopClient.query(VERIFY_EMAIL, {
                password: 'test',
                token: verificationToken,
            });
        }, `Verification token has expired. Use refreshCustomerVerification to send a new token.`),
    );

    it(
        'attempting to reset password after token has expired throws',
        assertThrowsWithMessage(async () => {
            const { customer } = await adminClient.query<GetCustomer.Query, GetCustomer.Variables>(
                GET_CUSTOMER,
                { id: 'T_1' },
            );

            const passwordResetTokenPromise = getPasswordResetTokenPromise();
            const result = await shopClient.query<
                RequestPasswordReset.Mutation,
                RequestPasswordReset.Variables
            >(REQUEST_PASSWORD_RESET, {
                identifier: customer!.emailAddress,
            });

            const passwordResetToken = await passwordResetTokenPromise;

            expect(result.requestPasswordReset).toBe(true);
            expect(sendEmailFn).toHaveBeenCalledTimes(1);
            expect(passwordResetToken).toBeDefined();

            await new Promise((resolve) => setTimeout(resolve, 3));

            return shopClient.query<ResetPassword.Mutation, ResetPassword.Variables>(RESET_PASSWORD, {
                password: 'test',
                token: passwordResetToken,
            });
        }, `Password reset token has expired.`),
    );
});

describe('Registration without email verification', () => {
    const { server, shopClient } = createTestEnvironment(
        mergeConfig(testConfig, {
            plugins: [TestEmailPlugin as any],
            authOptions: {
                requireVerification: false,
            },
        }),
    );
    const userEmailAddress = 'glen.beardsley@test.com';

    beforeAll(async () => {
        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-minimal.csv'),
            customerCount: 1,
        });
    }, TEST_SETUP_TIMEOUT_MS);

    beforeEach(() => {
        sendEmailFn = jest.fn();
    });

    afterAll(async () => {
        await server.destroy();
    });

    it(
        'errors if no password is provided',
        assertThrowsWithMessage(async () => {
            const input: RegisterCustomerInput = {
                firstName: 'Glen',
                lastName: 'Beardsley',
                emailAddress: userEmailAddress,
            };
            const result = await shopClient.query<Register.Mutation, Register.Variables>(REGISTER_ACCOUNT, {
                input,
            });
        }, 'A password must be provided when `authOptions.requireVerification` is set to "false"'),
    );

    it('register a new account with password', async () => {
        const input: RegisterCustomerInput = {
            firstName: 'Glen',
            lastName: 'Beardsley',
            emailAddress: userEmailAddress,
            password: 'test',
        };
        const result = await shopClient.query<Register.Mutation, Register.Variables>(REGISTER_ACCOUNT, {
            input,
        });

        expect(result.registerCustomerAccount).toBe(true);
        expect(sendEmailFn).not.toHaveBeenCalled();
    });

    it('can login after registering', async () => {
        await shopClient.asUserWithCredentials(userEmailAddress, 'test');

        const result = await shopClient.query(
            gql`
                query GetMe {
                    me {
                        identifier
                    }
                }
            `,
        );
        expect(result.me.identifier).toBe(userEmailAddress);
    });
});

describe('Updating email address without email verification', () => {
    const { server, adminClient, shopClient } = createTestEnvironment(
        mergeConfig(testConfig, {
            plugins: [TestEmailPlugin as any],
            authOptions: {
                requireVerification: false,
            },
        }),
    );
    let customer: GetCustomer.Customer;
    const NEW_EMAIL_ADDRESS = 'new@address.com';

    beforeAll(async () => {
        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-minimal.csv'),
            customerCount: 1,
        });
        await adminClient.asSuperAdmin();
        const result = await adminClient.query<GetCustomer.Query, GetCustomer.Variables>(GET_CUSTOMER, {
            id: 'T_1',
        });
        customer = result.customer!;
    }, TEST_SETUP_TIMEOUT_MS);

    beforeEach(() => {
        sendEmailFn = jest.fn();
    });

    afterAll(async () => {
        await server.destroy();
    });

    it('updates email address', async () => {
        await shopClient.asUserWithCredentials(customer.emailAddress, 'test');
        const { requestUpdateCustomerEmailAddress } = await shopClient.query<
            RequestUpdateEmailAddress.Mutation,
            RequestUpdateEmailAddress.Variables
        >(REQUEST_UPDATE_EMAIL_ADDRESS, {
            password: 'test',
            newEmailAddress: NEW_EMAIL_ADDRESS,
        });

        expect(requestUpdateCustomerEmailAddress).toBe(true);
        expect(sendEmailFn).toHaveBeenCalledTimes(1);
        expect(sendEmailFn.mock.calls[0][0] instanceof IdentifierChangeEvent).toBe(true);

        const { activeCustomer } = await shopClient.query<GetActiveCustomer.Query>(GET_ACTIVE_CUSTOMER);
        expect(activeCustomer!.emailAddress).toBe(NEW_EMAIL_ADDRESS);
    });
});

function getVerificationTokenPromise(): Promise<string> {
    return new Promise<any>((resolve) => {
        sendEmailFn.mockImplementation((event: AccountRegistrationEvent) => {
            resolve(event.user.getNativeAuthenticationMethod().verificationToken);
        });
    });
}

function getPasswordResetTokenPromise(): Promise<string> {
    return new Promise<any>((resolve) => {
        sendEmailFn.mockImplementation((event: PasswordResetEvent) => {
            resolve(event.user.getNativeAuthenticationMethod().passwordResetToken);
        });
    });
}

function getEmailUpdateTokenPromise(): Promise<{
    identifierChangeToken: string | null;
    pendingIdentifier: string | null;
}> {
    return new Promise((resolve) => {
        sendEmailFn.mockImplementation((event: IdentifierChangeRequestEvent) => {
            resolve(
                pick(event.user.getNativeAuthenticationMethod(), [
                    'identifierChangeToken',
                    'pendingIdentifier',
                ]),
            );
        });
    });
}
