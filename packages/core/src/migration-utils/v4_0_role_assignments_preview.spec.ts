import { DataSource, QueryRunner } from 'typeorm';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
    formatRoleAssignmentMigrationPreview,
    previewRoleAssignmentMigration,
} from './v4_0_role_assignments_preview';

describe('previewRoleAssignmentMigration()', () => {
    let dataSource: DataSource;
    let queryRunner: QueryRunner;

    beforeEach(async () => {
        dataSource = new DataSource({ type: 'better-sqlite3', database: ':memory:' });
        await dataSource.initialize();
        queryRunner = dataSource.createQueryRunner();
        await createLegacySchema();
    });

    afterEach(async () => {
        await queryRunner.release();
        await dataSource.destroy();
    });

    async function createLegacySchema() {
        await queryRunner.query(
            `CREATE TABLE "role" ("id" integer PRIMARY KEY AUTOINCREMENT, "code" varchar NOT NULL,
             "permissions" text NOT NULL)`,
        );
        await queryRunner.query(
            `CREATE TABLE "channel" ("id" integer PRIMARY KEY AUTOINCREMENT, "code" varchar NOT NULL)`,
        );
        await queryRunner.query(
            `CREATE TABLE "customer" ("id" integer PRIMARY KEY AUTOINCREMENT, "deletedAt" datetime,
             "userId" integer)`,
        );
        await queryRunner.query(
            `CREATE TABLE "customer_channels_channel" ("customerId" integer NOT NULL,
             "channelId" integer NOT NULL, PRIMARY KEY ("customerId", "channelId"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "user_roles_role" ("userId" integer NOT NULL, "roleId" integer NOT NULL,
             PRIMARY KEY ("userId", "roleId"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "role_channels_channel" ("roleId" integer NOT NULL, "channelId" integer NOT NULL,
             PRIMARY KEY ("roleId", "channelId"))`,
        );
        await queryRunner.query(
            `INSERT INTO "channel" ("id", "code") VALUES
             (1, '__default_channel__'), (2, 'second'), (3, 'programmatic')`,
        );
        await queryRunner.query(
            `INSERT INTO "role" ("id", "code", "permissions") VALUES
             (1, '__super_admin_role__', 'SuperAdmin'),
             (2, '__customer_role__', 'Authenticated'),
             (3, 'sales', 'Authenticated,ReadOrder')`,
        );
        // The Customer role is assigned to channels 1 and 2; channel 3 was created
        // programmatically and never received it.
        await queryRunner.query(
            `INSERT INTO "role_channels_channel" ("roleId", "channelId") VALUES (1, 1), (2, 1), (2, 2), (3, 2)`,
        );
    }

    it('reports no changes when Customer memberships match the Customer role channels', async () => {
        await queryRunner.query(
            `INSERT INTO "user_roles_role" ("userId", "roleId") VALUES (1, 1), (2, 3), (3, 2)`,
        );
        await queryRunner.query(`INSERT INTO "customer" ("id", "userId") VALUES (1, 3)`);
        await queryRunner.query(
            `INSERT INTO "customer_channels_channel" ("customerId", "channelId") VALUES (1, 1), (1, 2)`,
        );

        const preview = await previewRoleAssignmentMigration(queryRunner);

        expect(preview).toEqual({
            customerChannelChanges: [],
            customerRoleDroppedPermissions: [],
            rolesWithoutChannels: [],
        });
        expect(formatRoleAssignmentMigrationPreview(preview)).toBe(
            'No behavior changes: every User keeps their current permissions.',
        );
    });

    it('counts Customers losing non-member channels and gaining member channels', async () => {
        // user 3: member of channel 1 only, so loses channel 2
        // user 4: member of channels 1 and 3, so loses channel 2 and gains channel 3
        // user 5: deleted Customer, so loses channels 1 and 2
        await queryRunner.query(
            `INSERT INTO "user_roles_role" ("userId", "roleId") VALUES (3, 2), (4, 2), (5, 2)`,
        );
        await queryRunner.query(
            `INSERT INTO "customer" ("id", "userId", "deletedAt") VALUES
             (1, 3, NULL), (2, 4, NULL), (3, 5, datetime('now'))`,
        );
        await queryRunner.query(
            `INSERT INTO "customer_channels_channel" ("customerId", "channelId") VALUES
             (1, 1), (2, 1), (2, 3), (3, 1), (3, 2)`,
        );

        const preview = await previewRoleAssignmentMigration(queryRunner);

        expect(preview.customerChannelChanges).toEqual([
            {
                channelId: '1',
                channelCode: '__default_channel__',
                customersLosingAccess: 1,
                customersGainingAccess: 0,
            },
            { channelId: '2', channelCode: 'second', customersLosingAccess: 3, customersGainingAccess: 0 },
            {
                channelId: '3',
                channelCode: 'programmatic',
                customersLosingAccess: 0,
                customersGainingAccess: 1,
            },
        ]);
    });

    it('reports Customer role permissions beyond Authenticated', async () => {
        await queryRunner.query(
            `UPDATE "role" SET "permissions" = 'Authenticated,ReadCatalog' WHERE "code" = '__customer_role__'`,
        );

        const preview = await previewRoleAssignmentMigration(queryRunner);

        expect(preview.customerRoleDroppedPermissions).toEqual(['ReadCatalog']);
    });

    it('reports held roles assigned to no channel', async () => {
        await queryRunner.query(
            `INSERT INTO "role" ("id", "code", "permissions") VALUES (4, 'orphan', 'ReadOrder')`,
        );
        await queryRunner.query(`INSERT INTO "user_roles_role" ("userId", "roleId") VALUES (2, 4), (6, 4)`);

        const preview = await previewRoleAssignmentMigration(queryRunner);

        expect(preview.rolesWithoutChannels).toEqual([{ roleId: '4', roleCode: 'orphan', holderCount: 2 }]);
    });

    it('throws when the legacy tables no longer exist', async () => {
        await queryRunner.query(`DROP TABLE "user_roles_role"`);

        await expect(previewRoleAssignmentMigration(queryRunner)).rejects.toThrow(
            'Run previewRoleAssignmentMigration() before running the v4 migration',
        );
    });
});
