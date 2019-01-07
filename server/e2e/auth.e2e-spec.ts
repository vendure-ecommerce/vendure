import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import path from 'path';

import {
    CREATE_ADMINISTRATOR,
    CREATE_ROLE,
} from '../../admin-ui/src/app/data/definitions/administrator-definitions';
import { ATTEMPT_LOGIN } from '../../admin-ui/src/app/data/definitions/auth-definitions';
import {
    CREATE_PRODUCT,
    GET_PRODUCT_LIST,
    UPDATE_PRODUCT,
} from '../../admin-ui/src/app/data/definitions/product-definitions';
import {
    CreateAdministrator,
    CreateProductMutationArgs,
    CreateRole,
    LoginMutationArgs,
    Permission,
    RegisterCustomerInput,
    UpdateProductMutationArgs,
} from '../../shared/generated-types';
import { SUPER_ADMIN_USER_IDENTIFIER, SUPER_ADMIN_USER_PASSWORD } from '../../shared/shared-constants';
import { NoopEmailGenerator } from '../src/config/email/noop-email-generator';
import { defaultEmailTypes } from '../src/email/default-email-types';

import { TEST_SETUP_TIMEOUT_MS } from './config/test-config';
import { TestClient } from './test-client';
import { TestServer } from './test-server';

describe('Authorization & permissions', () => {
    const client = new TestClient();
    const server = new TestServer();
    let sendEmailFn: jest.Mock;

    beforeAll(async () => {
        const token = await server.init(
            {
                productCount: 1,
                customerCount: 1,
            },
            {
                emailOptions: {
                    emailTemplatePath: 'src/email/templates',
                    emailTypes: defaultEmailTypes,
                    generator: new NoopEmailGenerator(),
                    transport: {
                        type: 'testing',
                        onSend: ctx => sendEmailFn(ctx),
                    },
                },
            },
        );
        await client.init();
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    beforeEach(() => {
        sendEmailFn = jest.fn();
    });

    describe('admin permissions', () => {
        describe('Anonymous user', () => {
            beforeAll(async () => {
                await client.asAnonymousUser();
            });

            it('can attempt login', async () => {
                await assertRequestAllowed<LoginMutationArgs>(ATTEMPT_LOGIN, {
                    username: SUPER_ADMIN_USER_IDENTIFIER,
                    password: SUPER_ADMIN_USER_PASSWORD,
                    rememberMe: false,
                });
            });
        });

        describe('ReadCatalog', () => {
            beforeAll(async () => {
                await client.asSuperAdmin();
                const { identifier, password } = await createAdministratorWithPermissions('ReadCatalog', [
                    Permission.ReadCatalog,
                ]);
                await client.asUserWithCredentials(identifier, password);
            });

            it('can read', async () => {
                await assertRequestAllowed(GET_PRODUCT_LIST);
            });

            it('cannot uppdate', async () => {
                await assertRequestForbidden<UpdateProductMutationArgs>(UPDATE_PRODUCT, {
                    input: {
                        id: '1',
                        translations: [],
                    },
                });
            });

            it('cannot create', async () => {
                await assertRequestForbidden<CreateProductMutationArgs>(CREATE_PRODUCT, {
                    input: {
                        translations: [],
                    },
                });
            });
        });

        describe('CRUD on Customers', () => {
            beforeAll(async () => {
                await client.asSuperAdmin();
                const { identifier, password } = await createAdministratorWithPermissions('CRUDCustomer', [
                    Permission.CreateCustomer,
                    Permission.ReadCustomer,
                    Permission.UpdateCustomer,
                    Permission.DeleteCustomer,
                ]);
                await client.asUserWithCredentials(identifier, password);
            });

            it('can create', async () => {
                await assertRequestAllowed(
                    gql`
                        mutation CreateCustomer($input: CreateCustomerInput!) {
                            createCustomer(input: $input) {
                                id
                            }
                        }
                    `,
                    { input: { emailAddress: '', firstName: '', lastName: '' } },
                );
            });

            it('can read', async () => {
                await assertRequestAllowed(gql`
                    query {
                        customers {
                            totalItems
                        }
                    }
                `);
            });
        });
    });

    describe('customer account creation', () => {
        const password = 'password';
        const emailAddress = 'test1@test.com';
        let verificationToken: string;

        it('register a new account', async () => {
            const verificationTokenPromise = getVerificationTokenPromise();
            const input: RegisterCustomerInput = {
                firstName: 'Sean',
                lastName: 'Tester',
                emailAddress,
            };
            const result = await client.query(REGISTER_ACCOUNT, { input });

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
            const result = await client.query(REGISTER_ACCOUNT, { input });

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
            const result = await client.query(REFRESH_TOKEN, { emailAddress });

            const newVerificationToken = await sendEmail;

            expect(result.refreshCustomerVerification).toBe(true);
            expect(sendEmailFn).toHaveBeenCalled();
            expect(newVerificationToken).not.toBe(verificationToken);

            verificationToken = newVerificationToken;
        });
        it('refreshCustomerVerification does nothing with an unrecognized emailAddress', async () => {
            const result = await client.query(REFRESH_TOKEN, {
                emailAddress: 'never-been-registered@test.com',
            });

            expect(result.refreshCustomerVerification).toBe(true);
            expect(sendEmailFn).not.toHaveBeenCalled();
        });

        it('login fails before verification', async () => {
            try {
                await client.asUserWithCredentials(emailAddress, '');
                fail('should have thrown');
            } catch (err) {
                expect(getErrorCode(err)).toBe('UNAUTHORIZED');
            }
        });

        it('verification fails with wrong token', async () => {
            try {
                await client.query(VERIFY_EMAIL, {
                    password,
                    token: 'bad-token',
                });
                fail('should have thrown');
            } catch (err) {
                expect(err.message).toEqual(expect.stringContaining(`Verification token not recognized`));
            }
        });

        it('verification succeeds with correct token', async () => {
            const result = await client.query(VERIFY_EMAIL, {
                password,
                token: verificationToken,
            });

            expect(result.verifyCustomerAccount.user.identifier).toBe('test1@test.com');
        });

        it('verification fails if attempted a second time', async () => {
            try {
                await client.query(VERIFY_EMAIL, {
                    password,
                    token: verificationToken,
                });
                fail('should have thrown');
            } catch (err) {
                expect(err.message).toEqual(expect.stringContaining(`Verification token not recognized`));
            }
        });
    });

    function getVerificationTokenPromise(): Promise<string> {
        return new Promise<string>(resolve => {
            sendEmailFn.mockImplementation(ctx => {
                resolve(ctx.event.user.verificationToken);
            });
        });
    }

    async function assertRequestAllowed<V>(operation: DocumentNode, variables?: V) {
        try {
            const status = await client.queryStatus(operation, variables);
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
            const status = await client.query(operation, variables);
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
        const roleResult = await client.query<CreateRole.Mutation, CreateRole.Variables>(CREATE_ROLE, {
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

        const adminResult = await client.query<CreateAdministrator.Mutation, CreateAdministrator.Variables>(
            CREATE_ADMINISTRATOR,
            {
                input: {
                    emailAddress: identifier,
                    firstName: code,
                    lastName: 'Admin',
                    password,
                    roleIds: [role.id],
                },
            },
        );
        const admin = adminResult.createAdministrator;

        return {
            identifier,
            password,
        };
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
});
