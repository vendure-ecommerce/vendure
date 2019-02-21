import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import path from 'path';

import {
    CREATE_ADMINISTRATOR,
    CREATE_ROLE,
} from '../../admin-ui/src/app/data/definitions/administrator-definitions';
import { RegisterCustomerInput } from '../../shared/generated-shop-types';
import { CreateAdministrator, CreateRole, Permission } from '../../shared/generated-types';
import { NoopEmailGenerator } from '../src/config/email/noop-email-generator';
import { defaultEmailTypes } from '../src/email/default-email-types';

import { TEST_SETUP_TIMEOUT_MS } from './config/test-config';
import { TestAdminClient, TestShopClient } from './test-client';
import { TestServer } from './test-server';
import { assertThrowsWithMessage } from './test-utils';

let sendEmailFn: jest.Mock;
const emailOptions = {
    emailTemplatePath: 'src/email/templates',
    emailTypes: defaultEmailTypes,
    generator: new NoopEmailGenerator(),
    transport: {
        type: 'testing' as 'testing',
        onSend: ctx => sendEmailFn(ctx),
    },
};

describe('Shop auth & accounts', () => {
    const shopClient = new TestShopClient();
    const server = new TestServer();

    beforeAll(async () => {
        const token = await server.init(
            {
                productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-minimal.csv'),
                customerCount: 1,
            },
            {
                emailOptions,
            },
        );
        await shopClient.init();
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    describe('customer account creation', () => {
        const password = 'password';
        const emailAddress = 'test1@test.com';
        let verificationToken: string;

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
                const result = await shopClient.query(REGISTER_ACCOUNT, { input });
            }, 'Do not provide a password when `authOptions.requireVerification` is set to "true"'),
        );

        it('register a new account', async () => {
            const verificationTokenPromise = getVerificationTokenPromise();
            const input: RegisterCustomerInput = {
                firstName: 'Sean',
                lastName: 'Tester',
                emailAddress,
            };
            const result = await shopClient.query(REGISTER_ACCOUNT, { input });

            verificationToken = await verificationTokenPromise;

            expect(result.registerCustomerAccount).toBe(true);
            expect(sendEmailFn).toHaveBeenCalled();
            expect(verificationToken).toBeDefined();
        });

        it('issues a new token if attempting to register a second time', async () => {
            const sendEmail = new Promise<string>(resolve => {
                sendEmailFn.mockImplementation(ctx => {
                    resolve(ctx.event.user.verificationToken);
                });
            });
            const input: RegisterCustomerInput = {
                firstName: 'Sean',
                lastName: 'Tester',
                emailAddress,
            };
            const result = await shopClient.query(REGISTER_ACCOUNT, { input });

            const newVerificationToken = await sendEmail;

            expect(result.registerCustomerAccount).toBe(true);
            expect(sendEmailFn).toHaveBeenCalled();
            expect(newVerificationToken).not.toBe(verificationToken);

            verificationToken = newVerificationToken;
        });

        it('refreshCustomerVerification issues a new token', async () => {
            const sendEmail = new Promise<string>(resolve => {
                sendEmailFn.mockImplementation(ctx => {
                    resolve(ctx.event.user.verificationToken);
                });
            });
            const result = await shopClient.query(REFRESH_TOKEN, { emailAddress });

            const newVerificationToken = await sendEmail;

            expect(result.refreshCustomerVerification).toBe(true);
            expect(sendEmailFn).toHaveBeenCalled();
            expect(newVerificationToken).not.toBe(verificationToken);

            verificationToken = newVerificationToken;
        });

        it('refreshCustomerVerification does nothing with an unrecognized emailAddress', async () => {
            const result = await shopClient.query(REFRESH_TOKEN, {
                emailAddress: 'never-been-registered@test.com',
            });
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
                    shopClient.query(VERIFY_EMAIL, {
                        password,
                        token: 'bad-token',
                    }),
                `Verification token not recognized`,
            ),
        );

        it('verification succeeds with correct token', async () => {
            const result = await shopClient.query(VERIFY_EMAIL, {
                password,
                token: verificationToken,
            });

            expect(result.verifyCustomerAccount.user.identifier).toBe('test1@test.com');
        });

        it('registration silently fails if attempting to register an email already verified', async () => {
            const input: RegisterCustomerInput = {
                firstName: 'Dodgy',
                lastName: 'Hacker',
                emailAddress,
            };
            const result = await shopClient.query(REGISTER_ACCOUNT, { input });
            await waitForSendEmailFn();
            expect(result.registerCustomerAccount).toBe(true);
            expect(sendEmailFn).not.toHaveBeenCalled();
        });

        it(
            'verification fails if attempted a second time',
            assertThrowsWithMessage(
                () =>
                    shopClient.query(VERIFY_EMAIL, {
                        password,
                        token: verificationToken,
                    }),
                `Verification token not recognized`,
            ),
        );
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

        const identifier = `${code}@${Math.random()
            .toString(16)
            .substr(2, 8)}`;
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

describe('Expiring registration token', () => {
    const shopClient = new TestShopClient();
    const server = new TestServer();

    beforeAll(async () => {
        const token = await server.init(
            {
                productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-minimal.csv'),
                customerCount: 1,
            },
            {
                emailOptions,
                authOptions: {
                    verificationTokenDuration: '1ms',
                },
            },
        );
        await shopClient.init();
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
            const result = await shopClient.query(REGISTER_ACCOUNT, { input });

            const verificationToken = await verificationTokenPromise;

            expect(result.registerCustomerAccount).toBe(true);
            expect(sendEmailFn).toHaveBeenCalledTimes(1);
            expect(verificationToken).toBeDefined();

            await new Promise(resolve => setTimeout(resolve, 3));

            return shopClient.query(VERIFY_EMAIL, {
                password: 'test',
                token: verificationToken,
            });
        }, `Verification token has expired. Use refreshCustomerVerification to send a new token.`),
    );
});

describe('Registration without email verification', () => {
    const shopClient = new TestShopClient();
    const server = new TestServer();
    const userEmailAddress = 'glen.beardsley@test.com';

    beforeAll(async () => {
        const token = await server.init(
            {
                productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-minimal.csv'),
                customerCount: 1,
            },
            {
                emailOptions,
                authOptions: {
                    requireVerification: false,
                },
            },
        );
        await shopClient.init();
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
            const result = await shopClient.query(REGISTER_ACCOUNT, { input });
        }, 'A password must be provided when `authOptions.requireVerification` is set to "false"'),
    );

    it('register a new account with password', async () => {
        const input: RegisterCustomerInput = {
            firstName: 'Glen',
            lastName: 'Beardsley',
            emailAddress: userEmailAddress,
            password: 'test',
        };
        const result = await shopClient.query(REGISTER_ACCOUNT, { input });

        expect(result.registerCustomerAccount).toBe(true);
        expect(sendEmailFn).not.toHaveBeenCalled();
    });

    it('can login after registering', async () => {
        await shopClient.asUserWithCredentials(userEmailAddress, 'test');

        const result = await shopClient.query(
            gql`
                query {
                    me {
                        identifier
                    }
                }
            `,
        );
        expect(result.me.identifier).toBe(userEmailAddress);
    });
});

function getVerificationTokenPromise(): Promise<string> {
    return new Promise<string>(resolve => {
        sendEmailFn.mockImplementation(ctx => {
            resolve(ctx.event.user.verificationToken);
        });
    });
}

const REGISTER_ACCOUNT = gql`
    mutation Register($input: RegisterCustomerInput!) {
        registerCustomerAccount(input: $input)
    }
`;

const VERIFY_EMAIL = gql`
    mutation Verify($password: String!, $token: String!) {
        verifyCustomerAccount(password: $password, token: $token) {
            user {
                id
                identifier
            }
        }
    }
`;

const REFRESH_TOKEN = gql`
    mutation RefreshToken($emailAddress: String!) {
        refreshCustomerVerification(emailAddress: $emailAddress)
    }
`;
