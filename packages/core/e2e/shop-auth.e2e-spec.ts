/* tslint:disable:no-non-null-assertion */
import { OnModuleInit } from '@nestjs/common';
import { ErrorCode, RegisterCustomerInput } from '@vendure/common/lib/generated-shop-types';
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
import { createErrorResultGuard, createTestEnvironment, ErrorResultGuard } from '@vendure/testing';
import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import path from 'path';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { testConfig, TEST_SETUP_TIMEOUT_MS } from '../../../e2e-common/test-config';

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
    CurrentUserShopFragment,
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
        this.eventBus.ofType(AccountRegistrationEvent).subscribe(event => {
            sendEmailFn(event);
        });
        this.eventBus.ofType(PasswordResetEvent).subscribe(event => {
            sendEmailFn(event);
        });
        this.eventBus.ofType(IdentifierChangeRequestEvent).subscribe(event => {
            sendEmailFn(event);
        });
        this.eventBus.ofType(IdentifierChangeEvent).subscribe(event => {
            sendEmailFn(event);
        });
    }
}

const successErrorGuard: ErrorResultGuard<{ success: boolean }> = createErrorResultGuard<{
    success: boolean;
}>(input => input.success != null);

const currentUserErrorGuard: ErrorResultGuard<CurrentUserShopFragment> = createErrorResultGuard<
    CurrentUserShopFragment
>(input => input.identifier != null);

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

    describe('customer account creation with deferred password', () => {
        const password = 'password';
        const emailAddress = 'test1@test.com';
        let verificationToken: string;
        let newCustomerId: string;

        beforeEach(() => {
            sendEmailFn = jest.fn();
        });

        it('does not return error result on email address conflict', async () => {
            // To prevent account enumeration attacks
            const { customers } = await adminClient.query<GetCustomerList.Query>(GET_CUSTOMER_LIST);
            const input: RegisterCustomerInput = {
                firstName: 'Duplicate',
                lastName: 'Person',
                phoneNumber: '123456',
                emailAddress: customers.items[0].emailAddress,
            };
            const { registerCustomerAccount } = await shopClient.query<Register.Mutation, Register.Variables>(
                REGISTER_ACCOUNT,
                {
                    input,
                },
            );
            successErrorGuard.assertSuccess(registerCustomerAccount);
        });

        it('register a new account without password', async () => {
            const verificationTokenPromise = getVerificationTokenPromise();
            const input: RegisterCustomerInput = {
                firstName: 'Sean',
                lastName: 'Tester',
                phoneNumber: '123456',
                emailAddress,
            };
            const { registerCustomerAccount } = await shopClient.query<Register.Mutation, Register.Variables>(
                REGISTER_ACCOUNT,
                {
                    input,
                },
            );
            successErrorGuard.assertSuccess(registerCustomerAccount);

            verificationToken = await verificationTokenPromise;

            expect(registerCustomerAccount.success).toBe(true);
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
            const sendEmail = new Promise<string>(resolve => {
                sendEmailFn.mockImplementation((event: AccountRegistrationEvent) => {
                    resolve(event.user.getNativeAuthenticationMethod().verificationToken!);
                });
            });
            const input: RegisterCustomerInput = {
                firstName: 'Sean',
                lastName: 'Tester',
                emailAddress,
            };
            const { registerCustomerAccount } = await shopClient.query<Register.Mutation, Register.Variables>(
                REGISTER_ACCOUNT,
                {
                    input,
                },
            );
            successErrorGuard.assertSuccess(registerCustomerAccount);

            const newVerificationToken = await sendEmail;

            expect(registerCustomerAccount.success).toBe(true);
            expect(sendEmailFn).toHaveBeenCalled();
            expect(newVerificationToken).not.toBe(verificationToken);

            verificationToken = newVerificationToken;
        });

        it('refreshCustomerVerification issues a new token', async () => {
            const sendEmail = new Promise<string>(resolve => {
                sendEmailFn.mockImplementation((event: AccountRegistrationEvent) => {
                    resolve(event.user.getNativeAuthenticationMethod().verificationToken!);
                });
            });
            const { refreshCustomerVerification } = await shopClient.query<
                RefreshToken.Mutation,
                RefreshToken.Variables
            >(REFRESH_TOKEN, { emailAddress });
            successErrorGuard.assertSuccess(refreshCustomerVerification);
            const newVerificationToken = await sendEmail;

            expect(refreshCustomerVerification.success).toBe(true);
            expect(sendEmailFn).toHaveBeenCalled();
            expect(newVerificationToken).not.toBe(verificationToken);

            verificationToken = newVerificationToken;
        });

        it('refreshCustomerVerification does nothing with an unrecognized emailAddress', async () => {
            const { refreshCustomerVerification } = await shopClient.query<
                RefreshToken.Mutation,
                RefreshToken.Variables
            >(REFRESH_TOKEN, {
                emailAddress: 'never-been-registered@test.com',
            });
            successErrorGuard.assertSuccess(refreshCustomerVerification);
            await waitForSendEmailFn();

            expect(refreshCustomerVerification.success).toBe(true);
            expect(sendEmailFn).not.toHaveBeenCalled();
        });

        it('login fails before verification', async () => {
            const result = await shopClient.asUserWithCredentials(emailAddress, '');
            expect(result.errorCode).toBe(ErrorCode.INVALID_CREDENTIALS_ERROR);
        });

        it('verification fails with wrong token', async () => {
            const { verifyCustomerAccount } = await shopClient.query<Verify.Mutation, Verify.Variables>(
                VERIFY_EMAIL,
                {
                    password,
                    token: 'bad-token',
                },
            );
            currentUserErrorGuard.assertErrorResult(verifyCustomerAccount);

            expect(verifyCustomerAccount.message).toBe(`Verification token not recognized`);
            expect(verifyCustomerAccount.errorCode).toBe(ErrorCode.VERIFICATION_TOKEN_INVALID_ERROR);
        });

        it('verification fails with no password', async () => {
            const { verifyCustomerAccount } = await shopClient.query<Verify.Mutation, Verify.Variables>(
                VERIFY_EMAIL,
                {
                    token: verificationToken,
                },
            );
            currentUserErrorGuard.assertErrorResult(verifyCustomerAccount);

            expect(verifyCustomerAccount.message).toBe(`A password must be provided.`);
            expect(verifyCustomerAccount.errorCode).toBe(ErrorCode.MISSING_PASSWORD_ERROR);
        });

        it('verification succeeds with password and correct token', async () => {
            const { verifyCustomerAccount } = await shopClient.query<Verify.Mutation, Verify.Variables>(
                VERIFY_EMAIL,
                {
                    password,
                    token: verificationToken,
                },
            );
            currentUserErrorGuard.assertSuccess(verifyCustomerAccount);

            expect(verifyCustomerAccount.identifier).toBe('test1@test.com');
            const { activeCustomer } = await shopClient.query<GetActiveCustomer.Query>(GET_ACTIVE_CUSTOMER);
            newCustomerId = activeCustomer!.id;
        });

        it('registration silently fails if attempting to register an email already verified', async () => {
            const input: RegisterCustomerInput = {
                firstName: 'Dodgy',
                lastName: 'Hacker',
                emailAddress,
            };
            const { registerCustomerAccount } = await shopClient.query<Register.Mutation, Register.Variables>(
                REGISTER_ACCOUNT,
                {
                    input,
                },
            );
            successErrorGuard.assertSuccess(registerCustomerAccount);

            await waitForSendEmailFn();
            expect(registerCustomerAccount.success).toBe(true);
            expect(sendEmailFn).not.toHaveBeenCalled();
        });

        it('verification fails if attempted a second time', async () => {
            const { verifyCustomerAccount } = await shopClient.query<Verify.Mutation, Verify.Variables>(
                VERIFY_EMAIL,
                {
                    password,
                    token: verificationToken,
                },
            );
            currentUserErrorGuard.assertErrorResult(verifyCustomerAccount);

            expect(verifyCustomerAccount.message).toBe(`Verification token not recognized`);
            expect(verifyCustomerAccount.errorCode).toBe(ErrorCode.VERIFICATION_TOKEN_INVALID_ERROR);
        });

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

    describe('customer account creation with up-front password', () => {
        const password = 'password';
        const emailAddress = 'test2@test.com';
        let verificationToken: string;

        it('register a new account with password', async () => {
            const verificationTokenPromise = getVerificationTokenPromise();
            const input: RegisterCustomerInput = {
                firstName: 'Lu',
                lastName: 'Tester',
                phoneNumber: '443324',
                emailAddress,
                password,
            };
            const { registerCustomerAccount } = await shopClient.query<Register.Mutation, Register.Variables>(
                REGISTER_ACCOUNT,
                {
                    input,
                },
            );
            successErrorGuard.assertSuccess(registerCustomerAccount);

            verificationToken = await verificationTokenPromise;

            expect(registerCustomerAccount.success).toBe(true);
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
            ).toEqual(pick(input, ['firstName', 'lastName', 'emailAddress', 'phoneNumber']));
        });

        it('login fails before verification', async () => {
            const result = await shopClient.asUserWithCredentials(emailAddress, password);
            expect(result.errorCode).toBe(ErrorCode.NOT_VERIFIED_ERROR);
            expect(result.message).toBe('Please verify this email address before logging in');
        });

        it('verification fails with password', async () => {
            const { verifyCustomerAccount } = await shopClient.query<Verify.Mutation, Verify.Variables>(
                VERIFY_EMAIL,
                {
                    token: verificationToken,
                    password: 'new password',
                },
            );
            currentUserErrorGuard.assertErrorResult(verifyCustomerAccount);

            expect(verifyCustomerAccount.message).toBe(`A password has already been set during registration`);
            expect(verifyCustomerAccount.errorCode).toBe(ErrorCode.PASSWORD_ALREADY_SET_ERROR);
        });

        it('verification succeeds with no password and correct token', async () => {
            const { verifyCustomerAccount } = await shopClient.query<Verify.Mutation, Verify.Variables>(
                VERIFY_EMAIL,
                {
                    token: verificationToken,
                },
            );
            currentUserErrorGuard.assertSuccess(verifyCustomerAccount);

            expect(verifyCustomerAccount.identifier).toBe('test2@test.com');
            const { activeCustomer } = await shopClient.query<GetActiveCustomer.Query>(GET_ACTIVE_CUSTOMER);
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
            const { requestPasswordReset } = await shopClient.query<
                RequestPasswordReset.Mutation,
                RequestPasswordReset.Variables
            >(REQUEST_PASSWORD_RESET, {
                identifier: 'invalid-identifier',
            });
            successErrorGuard.assertSuccess(requestPasswordReset);

            await waitForSendEmailFn();
            expect(requestPasswordReset.success).toBe(true);
            expect(sendEmailFn).not.toHaveBeenCalled();
            expect(passwordResetToken).not.toBeDefined();
        });

        it('requestPasswordReset sends reset token', async () => {
            const passwordResetTokenPromise = getPasswordResetTokenPromise();
            const { requestPasswordReset } = await shopClient.query<
                RequestPasswordReset.Mutation,
                RequestPasswordReset.Variables
            >(REQUEST_PASSWORD_RESET, {
                identifier: customer.emailAddress,
            });
            successErrorGuard.assertSuccess(requestPasswordReset);

            passwordResetToken = await passwordResetTokenPromise;

            expect(requestPasswordReset.success).toBe(true);
            expect(sendEmailFn).toHaveBeenCalled();
            expect(passwordResetToken).toBeDefined();
        });

        it('resetPassword returns error result with wrong token', async () => {
            const { resetPassword } = await shopClient.query<ResetPassword.Mutation, ResetPassword.Variables>(
                RESET_PASSWORD,
                {
                    password: 'newPassword',
                    token: 'bad-token',
                },
            );
            currentUserErrorGuard.assertErrorResult(resetPassword);

            expect(resetPassword.message).toBe(`Password reset token not recognized`);
            expect(resetPassword.errorCode).toBe(ErrorCode.PASSWORD_RESET_TOKEN_INVALID_ERROR);
        });

        it('resetPassword works with valid token', async () => {
            const { resetPassword } = await shopClient.query<ResetPassword.Mutation, ResetPassword.Variables>(
                RESET_PASSWORD,
                {
                    token: passwordResetToken,
                    password: 'newPassword',
                },
            );
            currentUserErrorGuard.assertSuccess(resetPassword);

            expect(resetPassword.identifier).toBe(customer.emailAddress);

            const loginResult = await shopClient.asUserWithCredentials(customer.emailAddress, 'newPassword');
            expect(loginResult.identifier).toBe(customer.emailAddress);
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

        it('return error result if password is incorrect', async () => {
            await shopClient.asUserWithCredentials(customer.emailAddress, PASSWORD);
            const { requestUpdateCustomerEmailAddress } = await shopClient.query<
                RequestUpdateEmailAddress.Mutation,
                RequestUpdateEmailAddress.Variables
            >(REQUEST_UPDATE_EMAIL_ADDRESS, {
                password: 'bad password',
                newEmailAddress: NEW_EMAIL_ADDRESS,
            });
            successErrorGuard.assertErrorResult(requestUpdateCustomerEmailAddress);

            expect(requestUpdateCustomerEmailAddress.message).toBe('The provided credentials are invalid');
            expect(requestUpdateCustomerEmailAddress.errorCode).toBe(ErrorCode.INVALID_CREDENTIALS_ERROR);
        });

        it('return error result email address already in use', async () => {
            await shopClient.asUserWithCredentials(customer.emailAddress, PASSWORD);
            const result = await adminClient.query<GetCustomer.Query, GetCustomer.Variables>(GET_CUSTOMER, {
                id: 'T_2',
            });
            const otherCustomer = result.customer!;

            const { requestUpdateCustomerEmailAddress } = await shopClient.query<
                RequestUpdateEmailAddress.Mutation,
                RequestUpdateEmailAddress.Variables
            >(REQUEST_UPDATE_EMAIL_ADDRESS, {
                password: PASSWORD,
                newEmailAddress: otherCustomer.emailAddress,
            });
            successErrorGuard.assertErrorResult(requestUpdateCustomerEmailAddress);

            expect(requestUpdateCustomerEmailAddress.message).toBe('The email address is not available.');
            expect(requestUpdateCustomerEmailAddress.errorCode).toBe(ErrorCode.EMAIL_ADDRESS_CONFLICT_ERROR);
        });

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
            const result = await shopClient.asUserWithCredentials(NEW_EMAIL_ADDRESS, PASSWORD);

            expect(result.errorCode).toBe(ErrorCode.INVALID_CREDENTIALS_ERROR);
        });

        it('return error result for bad token', async () => {
            const { updateCustomerEmailAddress } = await shopClient.query<
                UpdateEmailAddress.Mutation,
                UpdateEmailAddress.Variables
            >(UPDATE_EMAIL_ADDRESS, { token: 'bad token' });
            successErrorGuard.assertErrorResult(updateCustomerEmailAddress);

            expect(updateCustomerEmailAddress.message).toBe('Identifier change token not recognized');
            expect(updateCustomerEmailAddress.errorCode).toBe(
                ErrorCode.IDENTIFIER_CHANGE_TOKEN_INVALID_ERROR,
            );
        });

        it('verify the new email address', async () => {
            const { updateCustomerEmailAddress } = await shopClient.query<
                UpdateEmailAddress.Mutation,
                UpdateEmailAddress.Variables
            >(UPDATE_EMAIL_ADDRESS, { token: emailUpdateToken });
            successErrorGuard.assertSuccess(updateCustomerEmailAddress);

            expect(updateCustomerEmailAddress.success).toBe(true);

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
            const result = await shopClient.asUserWithCredentials(customer.emailAddress, PASSWORD);

            expect(result.errorCode).toBe(ErrorCode.INVALID_CREDENTIALS_ERROR);
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
        return new Promise(resolve => setTimeout(resolve, 10));
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

    it('attempting to verify after token has expired throws', async () => {
        const verificationTokenPromise = getVerificationTokenPromise();
        const input: RegisterCustomerInput = {
            firstName: 'Barry',
            lastName: 'Wallace',
            emailAddress: 'barry.wallace@test.com',
        };
        const { registerCustomerAccount } = await shopClient.query<Register.Mutation, Register.Variables>(
            REGISTER_ACCOUNT,
            {
                input,
            },
        );
        successErrorGuard.assertSuccess(registerCustomerAccount);

        const verificationToken = await verificationTokenPromise;

        expect(registerCustomerAccount.success).toBe(true);
        expect(sendEmailFn).toHaveBeenCalledTimes(1);
        expect(verificationToken).toBeDefined();

        await new Promise(resolve => setTimeout(resolve, 3));

        const { verifyCustomerAccount } = await shopClient.query<Verify.Mutation, Verify.Variables>(
            VERIFY_EMAIL,
            {
                password: 'test',
                token: verificationToken,
            },
        );
        currentUserErrorGuard.assertErrorResult(verifyCustomerAccount);

        expect(verifyCustomerAccount.message).toBe(
            `Verification token has expired. Use refreshCustomerVerification to send a new token.`,
        );
        expect(verifyCustomerAccount.errorCode).toBe(ErrorCode.VERIFICATION_TOKEN_EXPIRED_ERROR);
    });

    it('attempting to reset password after token has expired returns error result', async () => {
        const { customer } = await adminClient.query<GetCustomer.Query, GetCustomer.Variables>(GET_CUSTOMER, {
            id: 'T_1',
        });

        const passwordResetTokenPromise = getPasswordResetTokenPromise();
        const { requestPasswordReset } = await shopClient.query<
            RequestPasswordReset.Mutation,
            RequestPasswordReset.Variables
        >(REQUEST_PASSWORD_RESET, {
            identifier: customer!.emailAddress,
        });
        successErrorGuard.assertSuccess(requestPasswordReset);

        const passwordResetToken = await passwordResetTokenPromise;

        expect(requestPasswordReset.success).toBe(true);
        expect(sendEmailFn).toHaveBeenCalledTimes(1);
        expect(passwordResetToken).toBeDefined();

        await new Promise(resolve => setTimeout(resolve, 3));

        const { resetPassword } = await shopClient.query<ResetPassword.Mutation, ResetPassword.Variables>(
            RESET_PASSWORD,
            {
                password: 'test',
                token: passwordResetToken,
            },
        );

        currentUserErrorGuard.assertErrorResult(resetPassword);

        expect(resetPassword.message).toBe(`Password reset token has expired`);
        expect(resetPassword.errorCode).toBe(ErrorCode.PASSWORD_RESET_TOKEN_EXPIRED_ERROR);
    });
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

    it('Returns error result if no password is provided', async () => {
        const input: RegisterCustomerInput = {
            firstName: 'Glen',
            lastName: 'Beardsley',
            emailAddress: userEmailAddress,
        };
        const { registerCustomerAccount } = await shopClient.query<Register.Mutation, Register.Variables>(
            REGISTER_ACCOUNT,
            {
                input,
            },
        );
        successErrorGuard.assertErrorResult(registerCustomerAccount);

        expect(registerCustomerAccount.message).toBe('A password must be provided.');
        expect(registerCustomerAccount.errorCode).toBe(ErrorCode.MISSING_PASSWORD_ERROR);
    });

    it('register a new account with password', async () => {
        const input: RegisterCustomerInput = {
            firstName: 'Glen',
            lastName: 'Beardsley',
            emailAddress: userEmailAddress,
            password: 'test',
        };
        const { registerCustomerAccount } = await shopClient.query<Register.Mutation, Register.Variables>(
            REGISTER_ACCOUNT,
            {
                input,
            },
        );
        successErrorGuard.assertSuccess(registerCustomerAccount);

        expect(registerCustomerAccount.success).toBe(true);
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
        successErrorGuard.assertSuccess(requestUpdateCustomerEmailAddress);

        expect(requestUpdateCustomerEmailAddress.success).toBe(true);
        expect(sendEmailFn).toHaveBeenCalledTimes(1);
        expect(sendEmailFn.mock.calls[0][0] instanceof IdentifierChangeEvent).toBe(true);

        const { activeCustomer } = await shopClient.query<GetActiveCustomer.Query>(GET_ACTIVE_CUSTOMER);
        expect(activeCustomer!.emailAddress).toBe(NEW_EMAIL_ADDRESS);
    });
});

function getVerificationTokenPromise(): Promise<string> {
    return new Promise<any>(resolve => {
        sendEmailFn.mockImplementation((event: AccountRegistrationEvent) => {
            resolve(event.user.getNativeAuthenticationMethod().verificationToken);
        });
    });
}

function getPasswordResetTokenPromise(): Promise<string> {
    return new Promise<any>(resolve => {
        sendEmailFn.mockImplementation((event: PasswordResetEvent) => {
            resolve(event.user.getNativeAuthenticationMethod().passwordResetToken);
        });
    });
}

function getEmailUpdateTokenPromise(): Promise<{
    identifierChangeToken: string | null;
    pendingIdentifier: string | null;
}> {
    return new Promise(resolve => {
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
