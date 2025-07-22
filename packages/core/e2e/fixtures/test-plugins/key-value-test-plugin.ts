import { KeyValueScopes, Permission, VendurePlugin } from '@vendure/core';

/**
 * Test plugin that registers various key-value fields for testing different
 * scoping, validation, and permission scenarios.
 */
@VendurePlugin({
    configuration: config => {
        config.keyValueFields = {
            ...config.keyValueFields,
            test: [
                {
                    name: 'globalSetting',
                    scope: KeyValueScopes.global,
                },
                {
                    name: 'userSetting',
                    scope: KeyValueScopes.user,
                },
                {
                    name: 'channelSetting',
                    scope: KeyValueScopes.channel,
                },
                {
                    name: 'userAndChannelSetting',
                    scope: KeyValueScopes.userAndChannel,
                },
                {
                    name: 'readonlyField',
                    scope: KeyValueScopes.global,
                    readonly: true,
                },
                {
                    name: 'validatedField',
                    scope: KeyValueScopes.global,
                    validate: value => {
                        if (!['valid-option', 'another-option'].includes(value)) {
                            return 'Value must be valid-option or another-option';
                        }
                    },
                },
                {
                    name: 'complexData',
                    scope: KeyValueScopes.global,
                },
                {
                    name: 'bulk1',
                    scope: KeyValueScopes.global,
                },
                {
                    name: 'bulk2',
                    scope: KeyValueScopes.global,
                },
                {
                    name: 'adminOnlyField',
                    scope: KeyValueScopes.global,
                    requiresPermission: Permission.CreateAdministrator,
                },
            ],
        };
        return config;
    },
})
export class KeyValueTestPlugin {}
