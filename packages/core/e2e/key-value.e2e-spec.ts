import { CurrencyCode, LanguageCode, mergeConfig } from '@vendure/core';
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
    GetKeyValueQuery,
    GetKeyValueQueryVariables,
    GetKeyValuesQuery,
    GetKeyValuesQueryVariables,
    SetKeyValueMutation,
    SetKeyValueMutationVariables,
    SetKeyValuesMutation,
    SetKeyValuesMutationVariables,
} from './graphql/generated-e2e-admin-types';
import { CREATE_ADMINISTRATOR, CREATE_CHANNEL } from './graphql/shared-definitions';

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
            expect(setKeyValue).toBe(true);

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
            expect(setKeyValues).toBe(true);

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

            // Try to set invalid theme value
            try {
                await adminClient.query<SetKeyValueMutation, SetKeyValueMutationVariables>(SET_KEY_VALUE, {
                    input: { key: 'test.validatedField', value: 'invalid-value' },
                });
                expect.fail('Should have thrown validation error');
            } catch (error) {
                expect((error as Error).message).toContain('Validation failed');
            }

            // Set valid value should work
            const { setKeyValue } = await adminClient.query<
                SetKeyValueMutation,
                SetKeyValueMutationVariables
            >(SET_KEY_VALUE, {
                input: { key: 'test.validatedField', value: 'valid-option' },
            });
            expect(setKeyValue).toBe(true);
        });
    });

    describe('Readonly fields', () => {
        it('should prevent modification of readonly fields', async () => {
            await adminClient.asSuperAdmin();

            try {
                await adminClient.query<SetKeyValueMutation, SetKeyValueMutationVariables>(SET_KEY_VALUE, {
                    input: { key: 'test.readonlyField', value: 'attempt-change' },
                });
                expect.fail('Should have thrown readonly error');
            } catch (error) {
                expect((error as Error).message).toContain('readonly');
            }
        });
    });

    describe('Permission handling', () => {
        it('should reject users without required permissions', async () => {
            await adminClient.asSuperAdmin();

            // Create a role with limited permissions (no CreateAdministrator permission)
            const { createRole } = await adminClient.query(
                gql`
                    mutation CreateRole($input: CreateRoleInput!) {
                        createRole(input: $input) {
                            id
                        }
                    }
                `,
                {
                    input: {
                        code: 'limited-role',
                        description: 'Limited permissions role',
                        permissions: ['Authenticated', 'ReadAdministrator'], // No CreateAdministrator
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

            // Try to set admin-only field - should fail silently or return false
            try {
                const { setKeyValue } = await adminClient.query<
                    SetKeyValueMutation,
                    SetKeyValueMutationVariables
                >(SET_KEY_VALUE, {
                    input: { key: 'test.adminOnlyField', value: 'denied-value' },
                });
                // The service should throw an error, but if it returns false that's also acceptable
                expect(setKeyValue).toBe(false);
            } catch (error) {
                expect((error as Error).message).toContain('Insufficient permissions');
            }
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
            expect(setKeyValue).toBe(true);

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

            try {
                await adminClient.query<SetKeyValueMutation, SetKeyValueMutationVariables>(SET_KEY_VALUE, {
                    input: { key: 'invalid.nonExistentKey', value: 'some-value' },
                });
                expect.fail('Should have thrown an error for invalid key');
            } catch (error) {
                expect((error as Error).message).toContain('not registered');
            }
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

            try {
                await adminClient.query<SetKeyValuesMutation, SetKeyValuesMutationVariables>(SET_KEY_VALUES, {
                    inputs: [
                        { key: 'test.bulk1', value: 'valid-value' },
                        { key: 'invalid.nonExistentKey', value: 'invalid-value' },
                    ],
                });
                expect.fail('Should have thrown an error for invalid key in bulk operation');
            } catch (error) {
                expect((error as Error).message).toContain('not registered');
            }
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
            try {
                await adminClient.query<SetKeyValuesMutation, SetKeyValuesMutationVariables>(SET_KEY_VALUES, {
                    inputs: [
                        { key: 'test.globalSetting', value: 'new-global-value' },
                        { key: 'test.adminOnlyField', value: 'denied-value' },
                    ],
                });
                expect.fail('Should have thrown permission error in bulk operation');
            } catch (error) {
                expect((error as Error).message).toContain('Insufficient permissions');
            }
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
        setKeyValue(input: $input)
    }
`;

const SET_KEY_VALUES = gql`
    mutation SetKeyValues($inputs: [KeyValueInput!]!) {
        setKeyValues(inputs: $inputs)
    }
`;
