import { ChannelRolePlugin, mergeConfig } from '@vendure/core';
import { createTestEnvironment, registerInitializer, SqljsInitializer } from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';
import { afterAll, beforeAll, describe, it } from 'vitest';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { TEST_SETUP_TIMEOUT_MS, testConfig } from '../../../e2e-common/test-config';

registerInitializer('sqljs', new SqljsInitializer(path.join(__dirname, '__data__'), 1000));

describe('RolePermissionResolverStrategy with ChannelRolePermissionResolverStrategy', () => {
    const { server, adminClient } = createTestEnvironment(
        mergeConfig(testConfig(), {
            plugins: [ChannelRolePlugin.init({})],
        }),
    );

    beforeAll(async () => {
        await server.init({
            initialData,
            customerCount: 1,
        });
        await adminClient.asSuperAdmin();
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    describe('Create Admin', () => {
        it('Successfully create admin', async ({ skip }) => {
            // TODO this doesnt work yet
            skip();
            return;
            const x = await adminClient.query(gql`
                mutation {
                    createAdministrator(
                        input: {
                            emailAddress: "NewAdmin"
                            firstName: "New"
                            lastName: "Admin"
                            password: "password"
                            channelRoles: [{ channelId: 69, roleId: 420 }]
                            roleIds: [] # TODO get rid off this requirement
                        }
                    ) {
                        id
                        firstName
                        lastName
                        emailAddress
                        user {
                            id
                            identifier
                            lastLogin
                        }
                    }
                }
            `);
        });

        it('Fail to create admin due to non-existent role', async ({ skip }) => {
            skip();
        });

        it('Fail to create admin due to non-existent channel', async ({ skip }) => {
            skip();
        });
    });

    describe('Update Admin', () => {
        it('Successfully assign new role to admin user', ({ skip }) => {
            skip();
        });

        it('Fail to assign new role to admin user due to non-existent channel', ({ skip }) => {
            skip();
        });

        it('Fail to assign new role to admin user due to non-existent role', ({ skip }) => {
            skip();
        });
    });
});
