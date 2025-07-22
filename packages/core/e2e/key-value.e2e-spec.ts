import {
    CurrencyCode,
    KeyValueEntry,
    KeyValueService,
    LanguageCode,
    mergeConfig,
    Permission,
    TransactionalConnection,
} from '@vendure/core';
import { createTestEnvironment, E2E_DEFAULT_CHANNEL_TOKEN } from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { TEST_SETUP_TIMEOUT_MS, testConfig } from '../../../e2e-common/test-config';

import { KeyValueTestPlugin } from './fixtures/test-plugins/key-value-test-plugin';
import {
    CreateAdministratorMutation,
    CreateAdministratorMutationVariables,
    CreateChannelMutation,
    CreateChannelMutationVariables,
    CreateRoleMutation,
    CreateRoleMutationVariables,
    GetKeyValueQuery,
    GetKeyValueQueryVariables,
    GetKeyValuesQuery,
    GetKeyValuesQueryVariables,
    SetKeyValueMutation,
    SetKeyValueMutationVariables,
    SetKeyValuesMutation,
    SetKeyValuesMutationVariables,
} from './graphql/generated-e2e-admin-types';
import { CREATE_ADMINISTRATOR, CREATE_CHANNEL, CREATE_ROLE } from './graphql/shared-definitions';

describe('KeyValue system', () => {
    const { server, adminClient } = createTestEnvironment(
        mergeConfig(testConfig(), {
            plugins: [KeyValueTestPlugin],
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

    describe('Global scoped fields', () => {
        it('should set and get a global value', async () => {
            const { setKeyValue } = await adminClient.query<
                SetKeyValueMutation,
                SetKeyValueMutationVariables
            >(SET_KEY_VALUE, {
                input: { key: 'test.globalSetting', value: 'global-value' },
            });
            expect(setKeyValue.result).toBe(true);
            expect(setKeyValue.key).toBe('test.globalSetting');
            expect(setKeyValue.error).toBeNull();

            const { getKeyValue } = await adminClient.query<GetKeyValueQuery, GetKeyValueQueryVariables>(
                GET_KEY_VALUE,
                {
                    key: 'test.globalSetting',
                },
            );
            expect(getKeyValue).toBe('global-value');
        });

        it('should return same global value from different contexts', async () => {
            // Create another user
            await adminClient.query<CreateAdministratorMutation, CreateAdministratorMutationVariables>(
                CREATE_ADMINISTRATOR,
                {
                    input: {
                        firstName: 'Test',
                        lastName: 'Admin',
                        emailAddress: 'test@test.com',
                        password: 'password',
                        roleIds: ['1'], // SuperAdmin role
                    },
                },
            );

            // Login as the new user and check global value
            await adminClient.asUserWithCredentials('test@test.com', 'password');

            const { getKeyValue } = await adminClient.query<GetKeyValueQuery, GetKeyValueQueryVariables>(
                GET_KEY_VALUE,
                {
                    key: 'test.globalSetting',
                },
            );
            expect(getKeyValue).toBe('global-value');
        });
    });

    describe('User scoped fields', () => {
        beforeAll(async () => {
            await adminClient.asSuperAdmin();
        });

        it('should store separate values per user', async () => {
            // Set value as superadmin
            await adminClient.query<SetKeyValueMutation, SetKeyValueMutationVariables>(SET_KEY_VALUE, {
                input: { key: 'test.userSetting', value: 'superadmin-value' },
            });

            // Create and switch to another user
            await adminClient.query<CreateAdministratorMutation, CreateAdministratorMutationVariables>(
                CREATE_ADMINISTRATOR,
                {
                    input: {
                        firstName: 'Test2',
                        lastName: 'Admin2',
                        emailAddress: 'test2@test.com',
                        password: 'password',
                        roleIds: ['1'],
                    },
                },
            );

            await adminClient.asUserWithCredentials('test2@test.com', 'password');

            // Should not see superadmin's value
            const { getKeyValue: emptyValue } = await adminClient.query<
                GetKeyValueQuery,
                GetKeyValueQueryVariables
            >(GET_KEY_VALUE, {
                key: 'test.userSetting',
            });
            expect(emptyValue).toBeNull();

            // Set different value for this user
            await adminClient.query<SetKeyValueMutation, SetKeyValueMutationVariables>(SET_KEY_VALUE, {
                input: { key: 'test.userSetting', value: 'test2-value' },
            });

            const { getKeyValue: userValue } = await adminClient.query<
                GetKeyValueQuery,
                GetKeyValueQueryVariables
            >(GET_KEY_VALUE, {
                key: 'test.userSetting',
            });
            expect(userValue).toBe('test2-value');

            // Switch back to superadmin and verify original value
            await adminClient.asSuperAdmin();
            const { getKeyValue: superadminValue } = await adminClient.query<
                GetKeyValueQuery,
                GetKeyValueQueryVariables
            >(GET_KEY_VALUE, {
                key: 'test.userSetting',
            });
            expect(superadminValue).toBe('superadmin-value');
        });
    });

    describe('Channel scoped fields', () => {
        const testChannelToken = 'test-channel-token';

        it('should store separate values per channel', async () => {
            await adminClient.asSuperAdmin();

            // Set value in default channel
            await adminClient.query<SetKeyValueMutation, SetKeyValueMutationVariables>(SET_KEY_VALUE, {
                input: { key: 'test.channelSetting', value: 'default-channel-value' },
            });

            const defaultZoneId = 'T_1';
            // Create a new channel
            const { createChannel } = await adminClient.query<
                CreateChannelMutation,
                CreateChannelMutationVariables
            >(CREATE_CHANNEL, {
                input: {
                    code: 'test-channel',
                    token: testChannelToken,
                    defaultLanguageCode: LanguageCode.en,
                    currencyCode: CurrencyCode.USD,
                    pricesIncludeTax: false,
                    defaultShippingZoneId: defaultZoneId,
                    defaultTaxZoneId: defaultZoneId,
                },
            });

            // Switch to new channel
            adminClient.setChannelToken(testChannelToken);

            // Should not see default channel's value
            const { getKeyValue: emptyValue } = await adminClient.query<
                GetKeyValueQuery,
                GetKeyValueQueryVariables
            >(GET_KEY_VALUE, {
                key: 'test.channelSetting',
            });
            expect(emptyValue).toBeNull();

            // Set different value for this channel
            await adminClient.query<SetKeyValueMutation, SetKeyValueMutationVariables>(SET_KEY_VALUE, {
                input: { key: 'test.channelSetting', value: 'test-channel-value' },
            });

            const { getKeyValue: channelValue } = await adminClient.query<
                GetKeyValueQuery,
                GetKeyValueQueryVariables
            >(GET_KEY_VALUE, {
                key: 'test.channelSetting',
            });
            expect(channelValue).toBe('test-channel-value');

            // Switch back to default channel and verify original value
            adminClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);

            const { getKeyValue: defaultValue } = await adminClient.query<
                GetKeyValueQuery,
                GetKeyValueQueryVariables
            >(GET_KEY_VALUE, {
                key: 'test.channelSetting',
            });
            expect(defaultValue).toBe('default-channel-value');
        });
    });

    describe('User and channel scoped fields', () => {
        const testChannelToken = 'test-channel-token';
        it('should store separate values per user per channel', async () => {
            await adminClient.asSuperAdmin();

            // Set value as superadmin in default channel
            await adminClient.query<SetKeyValueMutation, SetKeyValueMutationVariables>(SET_KEY_VALUE, {
                input: { key: 'test.userAndChannelSetting', value: 'superadmin-default' },
            });

            // Switch to test channel
            adminClient.setChannelToken(testChannelToken);
            // Should not see default channel value
            const { getKeyValue: emptyValue } = await adminClient.query<
                GetKeyValueQuery,
                GetKeyValueQueryVariables
            >(GET_KEY_VALUE, {
                key: 'test.userAndChannelSetting',
            });
            expect(emptyValue).toBeNull();

            // Set different value for superadmin in test channel
            await adminClient.query<SetKeyValueMutation, SetKeyValueMutationVariables>(SET_KEY_VALUE, {
                input: { key: 'test.userAndChannelSetting', value: 'superadmin-test' },
            });

            // Switch to test2 user in test channel
            await adminClient.asUserWithCredentials('test2@test.com', 'password');
            adminClient.setChannelToken(testChannelToken);

            // Should not see superadmin's value
            const { getKeyValue: emptyUserValue } = await adminClient.query<
                GetKeyValueQuery,
                GetKeyValueQueryVariables
            >(GET_KEY_VALUE, {
                key: 'test.userAndChannelSetting',
            });
            expect(emptyUserValue).toBeNull();

            // Set value for test2 user in test channel
            await adminClient.query<SetKeyValueMutation, SetKeyValueMutationVariables>(SET_KEY_VALUE, {
                input: { key: 'test.userAndChannelSetting', value: 'test2-test' },
            });

            // Verify all combinations maintain separate values
            const { getKeyValue: test2TestValue } = await adminClient.query<
                GetKeyValueQuery,
                GetKeyValueQueryVariables
            >(GET_KEY_VALUE, {
                key: 'test.userAndChannelSetting',
            });
            expect(test2TestValue).toBe('test2-test');

            // Switch back to superadmin in test channel
            await adminClient.asSuperAdmin();
            adminClient.setChannelToken(testChannelToken);
            const { getKeyValue: superadminTestValue } = await adminClient.query<
                GetKeyValueQuery,
                GetKeyValueQueryVariables
            >(GET_KEY_VALUE, {
                key: 'test.userAndChannelSetting',
            });
            expect(superadminTestValue).toBe('superadmin-test');

            // Switch to default channel
            adminClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);
            const { getKeyValue: superadminDefaultValue } = await adminClient.query<
                GetKeyValueQuery,
                GetKeyValueQueryVariables
            >(GET_KEY_VALUE, {
                key: 'test.userAndChannelSetting',
            });
            expect(superadminDefaultValue).toBe('superadmin-default');
        });
    });

    describe('Bulk operations', () => {
        it('should get multiple values', async () => {
            await adminClient.asSuperAdmin();
            adminClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);

            const result = await adminClient.query<GetKeyValuesQuery, GetKeyValuesQueryVariables>(
                GET_KEY_VALUES,
                {
                    keys: ['test.globalSetting', 'test.userSetting'],
                },
            );

            expect(result.getKeyValues).toEqual({
                'test.globalSetting': 'global-value',
                'test.userSetting': 'superadmin-value',
            });
        });

        it('should set multiple values', async () => {
            await adminClient.asSuperAdmin();

            const { setKeyValues } = await adminClient.query<
                SetKeyValuesMutation,
                SetKeyValuesMutationVariables
            >(SET_KEY_VALUES, {
                inputs: [
                    { key: 'test.bulk1', value: 'bulk-value-1' },
                    { key: 'test.bulk2', value: 'bulk-value-2' },
                ],
            });
            expect(setKeyValues).toHaveLength(2);
            expect(setKeyValues[0].result).toBe(true);
            expect(setKeyValues[0].key).toBe('test.bulk1');
            expect(setKeyValues[1].result).toBe(true);
            expect(setKeyValues[1].key).toBe('test.bulk2');

            const result = await adminClient.query<GetKeyValuesQuery, GetKeyValuesQueryVariables>(
                GET_KEY_VALUES,
                {
                    keys: ['test.bulk1', 'test.bulk2'],
                },
            );

            expect(result.getKeyValues).toEqual({
                'test.bulk1': 'bulk-value-1',
                'test.bulk2': 'bulk-value-2',
            });
        });
    });

    describe('Complex data types', () => {
        it('should handle JSON objects', async () => {
            await adminClient.asSuperAdmin();

            const complexData = {
                nested: {
                    array: [1, 2, 3],
                    boolean: true,
                    null: null,
                },
                string: 'test',
            };

            await adminClient.query<SetKeyValueMutation, SetKeyValueMutationVariables>(SET_KEY_VALUE, {
                input: { key: 'test.complexData', value: complexData },
            });

            const { getKeyValue } = await adminClient.query<GetKeyValueQuery, GetKeyValueQueryVariables>(
                GET_KEY_VALUE,
                {
                    key: 'test.complexData',
                },
            );

            expect(getKeyValue).toEqual(complexData);
        });
    });

    describe('Validation', () => {
        it('should validate values according to field config', async () => {
            await adminClient.asSuperAdmin();

            // Try to set invalid theme value - should return structured error result
            const invalidResult = await adminClient.query<SetKeyValueMutation, SetKeyValueMutationVariables>(
                SET_KEY_VALUE,
                {
                    input: { key: 'test.validatedField', value: 'invalid-value' },
                },
            );
            expect(invalidResult.setKeyValue.result).toBe(false);
            expect(invalidResult.setKeyValue.key).toBe('test.validatedField');
            expect(invalidResult.setKeyValue.error).toContain('Validation failed');

            // Set valid value should work
            const { setKeyValue } = await adminClient.query<
                SetKeyValueMutation,
                SetKeyValueMutationVariables
            >(SET_KEY_VALUE, {
                input: { key: 'test.validatedField', value: 'valid-option' },
            });
            expect(setKeyValue.result).toBe(true);
            expect(setKeyValue.error).toBeNull();
        });
    });

    describe('Readonly fields', () => {
        it('should prevent modification of readonly fields', async () => {
            await adminClient.asSuperAdmin();

            const { setKeyValue } = await adminClient.query<
                SetKeyValueMutation,
                SetKeyValueMutationVariables
            >(SET_KEY_VALUE, {
                input: { key: 'test.readonlyField', value: 'attempt-change' },
            });
            expect(setKeyValue.result).toBe(false);
            expect(setKeyValue.key).toBe('test.readonlyField');
            expect(setKeyValue.error).toContain('readonly');
        });
    });

    describe('Permission handling', () => {
        it('should reject users without required permissions', async () => {
            await adminClient.asSuperAdmin();

            // Create a role with limited permissions (no CreateAdministrator permission)
            const { createRole } = await adminClient.query<CreateRoleMutation, CreateRoleMutationVariables>(
                CREATE_ROLE,
                {
                    input: {
                        code: 'limited-role',
                        description: 'Limited permissions role',
                        permissions: [Permission.Authenticated, Permission.ReadAdministrator], // No CreateAdministrator
                    },
                },
            );

            // Create a user with limited permissions
            await adminClient.query<CreateAdministratorMutation, CreateAdministratorMutationVariables>(
                CREATE_ADMINISTRATOR,
                {
                    input: {
                        firstName: 'Limited',
                        lastName: 'User',
                        emailAddress: 'limited@test.com',
                        password: 'password',
                        roleIds: [createRole.id],
                    },
                },
            );

            // Switch to limited user
            await adminClient.asUserWithCredentials('limited@test.com', 'password');

            // Try to access admin-only field - should get null (no access)
            const { getKeyValue: deniedValue } = await adminClient.query<
                GetKeyValueQuery,
                GetKeyValueQueryVariables
            >(GET_KEY_VALUE, {
                key: 'test.adminOnlyField',
            });
            expect(deniedValue).toBeNull();

            // Try to set admin-only field - should return structured error result
            const { setKeyValue } = await adminClient.query<
                SetKeyValueMutation,
                SetKeyValueMutationVariables
            >(SET_KEY_VALUE, {
                input: { key: 'test.adminOnlyField', value: 'denied-value' },
            });
            expect(setKeyValue.result).toBe(false);
            expect(setKeyValue.key).toBe('test.adminOnlyField');
            expect(setKeyValue.error).toContain('Insufficient permissions');
        });

        it('should allow users with required permissions', async () => {
            await adminClient.asSuperAdmin();

            // SuperAdmin should have all permissions
            const { setKeyValue } = await adminClient.query<
                SetKeyValueMutation,
                SetKeyValueMutationVariables
            >(SET_KEY_VALUE, {
                input: { key: 'test.adminOnlyField', value: 'admin-value' },
            });
            expect(setKeyValue.result).toBe(true);
            expect(setKeyValue.key).toBe('test.adminOnlyField');
            expect(setKeyValue.error).toBeNull();

            const { getKeyValue } = await adminClient.query<GetKeyValueQuery, GetKeyValueQueryVariables>(
                GET_KEY_VALUE,
                {
                    key: 'test.adminOnlyField',
                },
            );
            expect(getKeyValue).toBe('admin-value');
        });
    });

    describe('Invalid key handling', () => {
        it('should gracefully handle getting invalid keys', async () => {
            await adminClient.asSuperAdmin();

            try {
                await adminClient.query<GetKeyValueQuery, GetKeyValueQueryVariables>(GET_KEY_VALUE, {
                    key: 'invalid.nonExistentKey',
                });
                expect.fail('Should have thrown an error for invalid key');
            } catch (error) {
                expect((error as Error).message).toContain('not registered');
            }
        });

        it('should gracefully handle setting invalid keys', async () => {
            await adminClient.asSuperAdmin();

            const { setKeyValue } = await adminClient.query<
                SetKeyValueMutation,
                SetKeyValueMutationVariables
            >(SET_KEY_VALUE, {
                input: { key: 'invalid.nonExistentKey', value: 'some-value' },
            });
            expect(setKeyValue.result).toBe(false);
            expect(setKeyValue.key).toBe('invalid.nonExistentKey');
            expect(setKeyValue.error).toContain('not registered');
        });
    });

    describe('Bulk operations with mixed keys', () => {
        it('should handle bulk get with one valid, one invalid key', async () => {
            await adminClient.asSuperAdmin();

            try {
                await adminClient.query<GetKeyValuesQuery, GetKeyValuesQueryVariables>(GET_KEY_VALUES, {
                    keys: ['test.globalSetting', 'invalid.nonExistentKey'],
                });
                expect.fail('Should have thrown an error for invalid key in bulk operation');
            } catch (error) {
                expect((error as Error).message).toContain('not registered');
            }
        });

        it('should handle bulk set with one valid, one invalid key', async () => {
            await adminClient.asSuperAdmin();

            const { setKeyValues } = await adminClient.query<
                SetKeyValuesMutation,
                SetKeyValuesMutationVariables
            >(SET_KEY_VALUES, {
                inputs: [
                    { key: 'test.bulk1', value: 'valid-value' },
                    { key: 'invalid.nonExistentKey', value: 'invalid-value' },
                ],
            });

            expect(setKeyValues).toHaveLength(2);
            expect(setKeyValues[0].result).toBe(true);
            expect(setKeyValues[0].key).toBe('test.bulk1');
            expect(setKeyValues[0].error).toBeNull();

            expect(setKeyValues[1].result).toBe(false);
            expect(setKeyValues[1].key).toBe('invalid.nonExistentKey');
            expect(setKeyValues[1].error).toContain('not registered');
        });

        it('should handle bulk operations with permission-restricted keys', async () => {
            await adminClient.asSuperAdmin();

            // First set a value as admin
            await adminClient.query<SetKeyValueMutation, SetKeyValueMutationVariables>(SET_KEY_VALUE, {
                input: { key: 'test.adminOnlyField', value: 'admin-bulk-value' },
            });

            // Switch to limited user
            await adminClient.asUserWithCredentials('limited@test.com', 'password');

            // Try bulk get with mix of accessible and restricted keys
            const { getKeyValues } = await adminClient.query<GetKeyValuesQuery, GetKeyValuesQueryVariables>(
                GET_KEY_VALUES,
                {
                    keys: ['test.globalSetting', 'test.adminOnlyField'],
                },
            );

            // Should only return values for accessible keys
            expect(getKeyValues).toEqual({
                'test.globalSetting': 'global-value',
                // adminOnlyField should be omitted due to permissions
            });

            // Try bulk set with mix of accessible and restricted keys
            const { setKeyValues } = await adminClient.query<
                SetKeyValuesMutation,
                SetKeyValuesMutationVariables
            >(SET_KEY_VALUES, {
                inputs: [
                    { key: 'test.globalSetting', value: 'new-global-value' },
                    { key: 'test.adminOnlyField', value: 'denied-value' },
                ],
            });

            expect(setKeyValues).toHaveLength(2);
            expect(setKeyValues[0].result).toBe(true);
            expect(setKeyValues[0].key).toBe('test.globalSetting');
            expect(setKeyValues[0].error).toBeNull();

            expect(setKeyValues[1].result).toBe(false);
            expect(setKeyValues[1].key).toBe('test.adminOnlyField');
            expect(setKeyValues[1].error).toContain('Insufficient permissions');
        });
    });

    describe('Orphaned entries cleanup', () => {
        let keyValueService: KeyValueService;

        beforeAll(async () => {
            await adminClient.asSuperAdmin();
            // Get the KeyValueService directly from the application
            try {
                keyValueService = server.app.get(KeyValueService);
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error('Failed to get KeyValueService:', error);
                // Try getting it from the service module
                keyValueService = server.app.get('KeyValueService');
            }
        });

        it('should identify orphaned entries', async () => {
            // Insert some orphaned entries directly into the database
            const connection = server.app.get(TransactionalConnection);
            const repo = connection.rawConnection.getRepository(KeyValueEntry);

            // Create entries with keys that don't have field definitions
            await repo.save([
                {
                    key: 'orphaned.oldSetting1',
                    value: 'old-value-1',
                    scope: '',
                    updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
                },
                {
                    key: 'orphaned.oldSetting2',
                    value: { complex: 'object', array: [1, 2, 3] },
                    scope: 'user:123',
                    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
                },
                {
                    key: 'orphaned.recentSetting',
                    value: 'recent-value',
                    scope: '',
                    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
                },
            ]);

            // Test finding orphaned entries older than 7 days
            const orphanedEntries = await keyValueService.findOrphanedEntries({
                olderThan: '7d',
                maxDeleteCount: 100,
            });

            expect(orphanedEntries.length).toBe(2); // Should find the 8-day and 10-day old entries
            expect(orphanedEntries.map(e => e.key)).toEqual(
                expect.arrayContaining(['orphaned.oldSetting1', 'orphaned.oldSetting2']),
            );
            expect(orphanedEntries.find(e => e.key === 'orphaned.oldSetting1')?.scope).toBe('');
            expect(orphanedEntries.find(e => e.key === 'orphaned.oldSetting2')?.scope).toBe('user:123');
            expect(orphanedEntries.find(e => e.key === 'orphaned.oldSetting2')?.valuePreview).toContain(
                'complex',
            );
        });

        it('should perform dry-run cleanup', async () => {
            const result = await keyValueService.cleanupOrphanedEntries({
                olderThan: '7d',
                dryRun: true,
                maxDeleteCount: 100,
            });

            expect(result.dryRun).toBe(true);
            expect(result.deletedCount).toBe(2); // Should find 2 entries to delete
            expect(result.deletedEntries.length).toBeLessThanOrEqual(10); // Sample entries

            // Verify entries are still in database (dry run shouldn't delete)
            const connection = server.app.get(TransactionalConnection);
            const repo = connection.rawConnection.getRepository(KeyValueEntry);
            const remainingEntries = await repo.find({
                where: [{ key: 'orphaned.oldSetting1' }, { key: 'orphaned.oldSetting2' }],
            });
            expect(remainingEntries.length).toBe(2);
        });

        it('should actually cleanup orphaned entries', async () => {
            const result = await keyValueService.cleanupOrphanedEntries({
                olderThan: '7d',
                dryRun: false,
                maxDeleteCount: 100,
                batchSize: 50,
            });

            expect(result.dryRun).toBe(false);
            expect(result.deletedCount).toBe(2);
            expect(result.deletedEntries.length).toBeLessThanOrEqual(10);

            // Verify entries are actually deleted from database
            const connection = server.app.get(TransactionalConnection);
            const repo = connection.rawConnection.getRepository(KeyValueEntry);
            const remainingEntries = await repo.find({
                where: [{ key: 'orphaned.oldSetting1' }, { key: 'orphaned.oldSetting2' }],
            });
            expect(remainingEntries.length).toBe(0);

            // Recent entry should still exist (not old enough)
            const recentEntry = await repo.findOne({ where: { key: 'orphaned.recentSetting' } });
            expect(recentEntry).not.toBeNull();
        });

        it('should respect age thresholds with ms package formats', async () => {
            // Create entries of different ages
            const connection = server.app.get(TransactionalConnection);
            const repo = connection.rawConnection.getRepository(KeyValueEntry);

            await repo.save([
                {
                    key: 'orphaned.veryOld',
                    value: 'very-old',
                    scope: '',
                    updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
                },
                {
                    key: 'orphaned.somewhartOld',
                    value: 'somewhat-old',
                    scope: '',
                    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
                },
            ]);

            // Test different ms package formats
            const old10d = await keyValueService.findOrphanedEntries({ olderThan: '10d' });
            expect(old10d.map(e => e.key)).toContain('orphaned.veryOld');
            expect(old10d.map(e => e.key)).not.toContain('orphaned.somewhartOld');

            const old3d = await keyValueService.findOrphanedEntries({ olderThan: '3 days' });
            expect(old3d.map(e => e.key)).toContain('orphaned.veryOld');
            expect(old3d.map(e => e.key)).toContain('orphaned.somewhartOld');

            const old1w = await keyValueService.findOrphanedEntries({ olderThan: '1w' });
            expect(old1w.map(e => e.key)).toContain('orphaned.veryOld');
            expect(old1w.map(e => e.key)).not.toContain('orphaned.somewhartOld');

            // Cleanup
            await keyValueService.cleanupOrphanedEntries({ olderThan: '1d' });
        });
    });
});

const GET_KEY_VALUE = gql`
    query GetKeyValue($key: String!) {
        getKeyValue(key: $key)
    }
`;

const GET_KEY_VALUES = gql`
    query GetKeyValues($keys: [String!]!) {
        getKeyValues(keys: $keys)
    }
`;

const SET_KEY_VALUE = gql`
    mutation SetKeyValue($input: KeyValueInput!) {
        setKeyValue(input: $input) {
            key
            result
            error
        }
    }
`;

const SET_KEY_VALUES = gql`
    mutation SetKeyValues($inputs: [KeyValueInput!]!) {
        setKeyValues(inputs: $inputs) {
            key
            result
            error
        }
    }
`;
