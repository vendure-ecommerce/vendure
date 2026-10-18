import { CurrencyCode, LanguageCode, Permission } from '@vendure/common/lib/generated-types';
import {
    AuthenticatedSession,
    Channel,
    SessionService,
    TransactionalConnection,
    User,
} from '@vendure/core';
import {
    createErrorResultGuard,
    createTestEnvironment,
    ErrorResultGuard,
    SimpleGraphQLClient,
} from '@vendure/testing';
import path from 'path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { TEST_SETUP_TIMEOUT_MS, testConfig } from '../../../e2e-common/test-config';

import { channelFragment } from './graphql/fragments-admin';
import { FragmentOf, graphql } from './graphql/graphql-admin';
import {
    createAdministratorDocument,
    createChannelDocument,
    createRoleDocument,
    getProductListDocument,
} from './graphql/shared-definitions';
import { assertThrowsWithMessage } from './utils/assert-throws-with-message';

/**
 * Users can be assigned Channels directly. When they have any, those Channels replace the
 * Channels of their Roles.
 */
describe('User-level channels', () => {
    const config = testConfig();
    const { server, adminClient } = createTestEnvironment(config);

    const channelGuard: ErrorResultGuard<FragmentOf<typeof channelFragment>> = createErrorResultGuard(
        input => !!input.defaultLanguageCode,
    );

    const createChannel = async (code: string) => {
        const { createChannel: result } = await adminClient.query(createChannelDocument, {
            input: {
                code,
                token: `${code}-token`,
                defaultLanguageCode: LanguageCode.en,
                currencyCode: CurrencyCode.GBP,
                pricesIncludeTax: true,
                defaultShippingZoneId: 'T_1',
                defaultTaxZoneId: 'T_1',
            },
        });
        channelGuard.assertSuccess(result);
        return result;
    };

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

    describe('entity', () => {
        it('persists channels on a user and removes the link when the channel is deleted', async () => {
            const created = await createChannel('entity-channel');
            const channel = { id: Number(created.id.replace('T_', '')) };
            const connection = server.app.get(TransactionalConnection).rawConnection;
            const userRepo = connection.getRepository(User);

            const user = await userRepo.save(
                new User({ identifier: 'entity-user@test.com', verified: true, channels: [{ id: channel.id }] }),
            );
            const loaded = await userRepo.findOneOrFail({ where: { id: user.id }, relations: ['channels'] });
            expect(loaded.channels.map(c => c.code)).toEqual(['entity-channel']);

            await connection.getRepository(Channel).delete({ id: channel.id });

            const reloaded = await userRepo.findOneOrFail({ where: { id: user.id }, relations: ['channels'] });
            expect(reloaded.channels).toEqual([]);
        });
    });

    describe('isolation', () => {
        const password = 'test-password';
        const toDbId = (id: string) => Number(id.replace('T_', ''));
        let channelA: FragmentOf<typeof channelFragment>;
        let channelB: FragmentOf<typeof channelFragment>;
        let businessRoleId: string;

        const createAdmin = async (emailAddress: string) => {
            await adminClient.asSuperAdmin();
            const { createAdministrator } = await adminClient.query(createAdministratorDocument, {
                input: {
                    emailAddress,
                    firstName: 'Test',
                    lastName: 'Admin',
                    password,
                    roleIds: [businessRoleId],
                },
            });
            return createAdministrator;
        };

        const setUserChannels = async (emailAddress: string, channelIds: string[]) => {
            const userRepo = server.app.get(TransactionalConnection).rawConnection.getRepository(User);
            const user = await userRepo.findOneOrFail({ where: { identifier: emailAddress } });
            user.channels = channelIds.map(id => ({ id: toDbId(id) }) as Channel);
            await userRepo.save(user);
        };

        beforeAll(async () => {
            await adminClient.asSuperAdmin();
            channelA = await createChannel('isolation-a');
            channelB = await createChannel('isolation-b');
            const { createRole } = await adminClient.query(createRoleDocument, {
                input: {
                    code: 'business',
                    description: 'Reusable business role, bound to channel A',
                    permissions: [Permission.ReadCatalog],
                    channelIds: [channelA.id],
                },
            });
            businessRoleId = createRole.id;
        });

        it('a user with user-level channel B cannot access channel A, though their role grants it', async () => {
            const email = 'only-b@test.com';
            await createAdmin(email);
            await setUserChannels(email, [channelB.id]);

            const login = await adminClient.asUserWithCredentials(email, password);
            expect(login.channels.map((c: { token: string }) => c.token)).toEqual([channelB.token]);

            adminClient.setChannelToken(channelB.token);
            const { products } = await adminClient.query(getProductListDocument);
            expect(products.totalItems).toBeGreaterThanOrEqual(0);

            adminClient.setChannelToken(channelA.token);
            await assertThrowsWithMessage(
                () => adminClient.query(getProductListDocument),
                'You are not currently authorized to perform this action',
            )();
        });

        it('a user without user-level channels still gets their role channels', async () => {
            const email = 'role-only@test.com';
            await createAdmin(email);

            const login = await adminClient.asUserWithCredentials(email, password);
            expect(login.channels.map((c: { token: string }) => c.token)).toEqual([channelA.token]);
        });
    });

    describe('administrator API', () => {
        const password = 'test-password';
        let channelA: FragmentOf<typeof channelFragment>;
        let channelB: FragmentOf<typeof channelFragment>;
        let businessRoleId: string;

        const createAdministratorWithChannelsDocument = graphql(`
            mutation CreateAdministratorWithChannels($input: CreateAdministratorInput!) {
                createAdministrator(input: $input) {
                    id
                    user {
                        id
                        channels {
                            token
                        }
                    }
                }
            }
        `);
        const updateAdministratorWithChannelsDocument = graphql(`
            mutation UpdateAdministratorWithChannels($input: UpdateAdministratorInput!) {
                updateAdministrator(input: $input) {
                    id
                    user {
                        id
                        channels {
                            token
                        }
                    }
                }
            }
        `);

        const create = async (emailAddress: string, channelIds?: string[]) => {
            const { createAdministrator } = await adminClient.query(createAdministratorWithChannelsDocument, {
                input: {
                    emailAddress,
                    firstName: 'Test',
                    lastName: 'Admin',
                    password,
                    roleIds: [businessRoleId],
                    channelIds,
                },
            });
            return createAdministrator;
        };
        const loginTokens = async (emailAddress: string) => {
            const login = await adminClient.asUserWithCredentials(emailAddress, password);
            return login.channels.map((c: { token: string }) => c.token);
        };

        beforeAll(async () => {
            await adminClient.asSuperAdmin();
            channelA = await createChannel('api-a');
            channelB = await createChannel('api-b');
            const { createRole } = await adminClient.query(createRoleDocument, {
                input: {
                    code: 'api-business',
                    description: 'Reusable business role, bound to channel A',
                    permissions: [Permission.ReadCatalog],
                    channelIds: [channelA.id],
                },
            });
            businessRoleId = createRole.id;
        });

        it('createAdministrator with channelIds assigns user-level channels', async () => {
            const admin = await create('api-create@test.com', [channelB.id]);
            expect(admin.user.channels.map(c => c.token)).toEqual([channelB.token]);

            expect(await loginTokens('api-create@test.com')).toEqual([channelB.token]);
        });

        it('updateAdministrator replaces user-level channels', async () => {
            await adminClient.asSuperAdmin();
            const admin = await create('api-update@test.com', [channelB.id]);
            const { updateAdministrator } = await adminClient.query(updateAdministratorWithChannelsDocument, {
                input: { id: admin.id, channelIds: [channelA.id, channelB.id] },
            });
            expect(updateAdministrator.user.channels.map(c => c.token).sort()).toEqual(
                [channelA.token, channelB.token].sort(),
            );
        });

        it('updateAdministrator with an empty channelIds falls back to role channels', async () => {
            await adminClient.asSuperAdmin();
            const admin = await create('api-clear@test.com', [channelB.id]);
            await adminClient.query(updateAdministratorWithChannelsDocument, {
                input: { id: admin.id, channelIds: [] },
            });

            expect(await loginTokens('api-clear@test.com')).toEqual([channelA.token]);
        });

        it('updateAdministrator without channelIds leaves user-level channels untouched', async () => {
            await adminClient.asSuperAdmin();
            const admin = await create('api-untouched@test.com', [channelB.id]);
            await adminClient.query(updateAdministratorWithChannelsDocument, {
                input: { id: admin.id, firstName: 'Renamed' },
            });

            expect(await loginTokens('api-untouched@test.com')).toEqual([channelB.token]);
        });

        it('rejects assigning a channel the active user has no administrator permission on', async () => {
            await adminClient.asSuperAdmin();
            const { createRole } = await adminClient.query(createRoleDocument, {
                input: {
                    code: 'api-channel-a-admin',
                    description: 'Administers channel A only',
                    permissions: [
                        Permission.ReadCatalog,
                        Permission.CreateAdministrator,
                        Permission.ReadAdministrator,
                        Permission.UpdateAdministrator,
                    ],
                    channelIds: [channelA.id],
                },
            });
            await adminClient.query(createAdministratorDocument, {
                input: {
                    emailAddress: 'api-actor@test.com',
                    firstName: 'Actor',
                    lastName: 'Admin',
                    password,
                    roleIds: [createRole.id],
                },
            });
            await adminClient.asUserWithCredentials('api-actor@test.com', password);
            adminClient.setChannelToken(channelA.token);

            await assertThrowsWithMessage(
                () => create('api-forbidden@test.com', [channelB.id]),
                'Active user does not have sufficient permissions',
            )();
            // ...but assigning a channel they do administer is fine
            const ok = await create('api-allowed@test.com', [channelA.id]);
            expect(ok.user.channels.map(c => c.token)).toEqual([channelA.token]);
        });

        it('a change of user-level channels is visible to an already-cached session', async () => {
            await adminClient.asSuperAdmin();
            const admin = await create('api-session@test.com');
            const connection = server.app.get(TransactionalConnection).rawConnection;
            const sessionService = server.app.get(SessionService);

            // A second client, so that the SuperAdmin stays logged in while the user holds a session.
            const { port, adminApiPath } = config.apiOptions;
            const userClient = new SimpleGraphQLClient(config, `http://localhost:${port}/${adminApiPath}`);
            await userClient.asUserWithCredentials('api-session@test.com', password);
            const session = await connection
                .getRepository(AuthenticatedSession)
                .findOneOrFail({ where: { user: { identifier: 'api-session@test.com' } } });
            const before = await sessionService.getSessionFromToken(session.token);
            expect(before?.user?.channelPermissions.map(c => c.token)).toEqual([channelA.token]);

            await adminClient.query(updateAdministratorWithChannelsDocument, {
                input: { id: admin.id, channelIds: [channelB.id] },
            });

            const after = await sessionService.getSessionFromToken(session.token);
            expect(after?.user?.channelPermissions.map(c => c.token)).toEqual([channelB.token]);
        });
    });
});
