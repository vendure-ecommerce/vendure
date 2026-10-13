/* eslint-disable no-console */
// TODO: Remove this file once v4.0 has been stable for a while. It is a one-time
// migration helper and will not be needed after all users have upgraded past v4.0.
import {
    CUSTOMER_ROLE_CODE,
    DEFAULT_CHANNEL_CODE,
    ROLE_EDITOR_ROLE_CODE,
    ROLE_EDITOR_ROLE_DESCRIPTION,
    SUPER_ADMIN_ROLE_CODE,
} from '@vendure/common/lib/shared-constants';
import { QueryRunner } from 'typeorm';

/**
 * @description
 * Populates the new `role_assignment` table from the pre-v4 `user_roles_role` and
 * `role_channels_channel` join tables. In the old model a User received each of their
 * Roles' permissions on every Channel the Role was assigned to, so the effective grants
 * are the cross product of the two join tables, which this helper writes out as explicit
 * `(user, role, channel)` rows.
 *
 * Two Roles are treated specially:
 *
 * - **Customer role**: no rows are written, and the role row itself is **deleted** — v4
 *   removes the Customer role entirely. Customer permissions are derived at check time
 *   from the Customer's channel memberships (`Authenticated` on every member Channel), so
 *   migrating the old rows (which granted every customer permissions on every Channel)
 *   would both reintroduce that permission leak and write one row per customer per
 *   channel. If your instance broadened the Customer role's permissions via a direct
 *   repository write, be aware that this customization has no v4 equivalent: the row and
 *   its permissions array are gone after migrating, and customers hold exactly
 *   `Authenticated` on their member Channels.
 * - **SuperAdmin role**: holders receive exactly one row, on the default Channel, whatever
 *   `role_channels_channel` records for the role. In v4 the SuperAdmin Role is held on every
 *   Channel or not at all: access is derived at check time from that single row, which
 *   stands for all Channels (see `RoleAssignment`).
 *
 * The RoleEditor system role (which bundles the Role CRUD permissions) is created if
 * absent. It is not granted to anyone: an Administrator who held `CreateRole`, `ReadRole`,
 * `UpdateRole` or `DeleteRole` through a pre-v4 Role keeps those permissions through the
 * migrated assignment rows of that Role, and every other Administrator has to be granted
 * RoleEditor explicitly by an actor who may grant it.
 *
 * The SuperAdmin role's stored permissions array also gains the new Role CRUD
 * permissions. Pre-v4 versions re-synced that array with all assignable permissions on
 * boot; v4 derives SuperAdmin permissions at check time and no longer re-syncs, so
 * without this step a migrated instance would present a stale permission list on the
 * SuperAdmin role.
 *
 * Call this from your migration's `up()` method **after** the `role_assignment` table
 * has been created and **before** `user_roles_role` and `role_channels_channel` are
 * dropped. If it runs out of order, the queries reference a table which does not exist
 * and the migration fails.
 *
 * After copying, the helper verifies that `role_assignment` holds exactly the grants the
 * legacy tables describe under these rules, and throws if any row is missing or extra. The
 * check runs before the Customer role is deleted, so a failed migration leaves the legacy
 * data intact. To review the intended behavior changes for your data before migrating,
 * see {@link previewRoleAssignmentMigration}.
 *
 * The helper is idempotent: rows which already exist are left as-is, so it is safe to
 * re-run, e.g. after a partial failure on MySQL (where DDL is non-transactional) or as
 * the delta pass of a staged rollout in which the bulk of the data was copied while the
 * previous version was still serving traffic.
 *
 * ```ts
 * import { MigrationInterface, QueryRunner } from 'typeorm';
 * import { migrateRoleAssignmentData } from '\@vendure/core';
 *
 * export class RoleAssignments1234567890 implements MigrationInterface {
 *     public async up(queryRunner: QueryRunner): Promise<any> {
 *         // --- Auto-generated DDL starts here ---
 *         // (Create role_assignment table and FK constraints)
 *         // ...
 *
 *         // --- Populate new table with existing data ---
 *         await migrateRoleAssignmentData(queryRunner);
 *
 *         // --- Auto-generated DDL continues ---
 *         // (Drop user_roles_role and role_channels_channel tables)
 *         // ...
 *     }
 *
 *     public async down(queryRunner: QueryRunner): Promise<any> {
 *         // Auto-generated reverse DDL
 *     }
 * }
 * ```
 *
 * @returns the number of `role_assignment` rows inserted.
 * @since 4.0.0
 * @docsCategory migration
 */
export async function migrateRoleAssignmentData(queryRunner: QueryRunner): Promise<number> {
    if (!(await queryRunner.hasTable('role_assignment'))) {
        throw new Error(
            'The role_assignment table does not exist. Call migrateRoleAssignmentData() after ' +
                'the part of your migration which creates the role_assignment table.',
        );
    }
    const hasUserRoles = await queryRunner.hasTable('user_roles_role');
    const hasRoleChannels = await queryRunner.hasTable('role_channels_channel');
    if (!hasUserRoles || !hasRoleChannels) {
        console.log(
            'The user_roles_role and/or role_channels_channel tables do not exist. ' +
                'Skipping role assignment data migration (already completed?).',
        );
        return 0;
    }

    const esc = (name: string) => queryRunner.connection.driver.escape(name);
    const idInsert = await getExplicitIdClauses(queryRunner);
    const countRows = async (): Promise<number> => {
        const rows: Array<{ count: string | number }> = await queryRunner.query(
            `SELECT COUNT(*) AS ${esc('count')} FROM ${esc('role_assignment')}`,
        );
        return Number(rows[0].count);
    };
    const countBefore = await countRows();

    // 1. Write out the cross product of user_roles_role and role_channels_channel for all
    // Roles except the Customer role, whose permissions are derived from channel membership,
    // and the SuperAdmin role, which step 2 writes as a single default-channel row.
    // 2. Write one row on the default Channel per SuperAdmin role holder. The row stands for
    // every Channel: SuperAdmin access is derived from it at check time.
    const pending = getPendingGrantQueries(queryRunner, idInsert.select);
    for (const pendingGrants of [pending.legacyGrants, pending.superAdminGrants]) {
        await queryRunner.query(
            `INSERT INTO ${esc('role_assignment')} (${idInsert.columns}${esc('userId')}, ${esc('roleId')}, ${esc('channelId')})
             ${pendingGrants}`,
        );
    }

    // Verify the copy before anything else is touched: the legacy tables are still intact at
    // this point, so a mismatch aborts the migration with the source data preserved.
    await verifyRoleAssignmentData(queryRunner);

    // 3. Create the RoleEditor role if it does not yet exist, so that a migrated instance
    // presents the same system roles as a fresh one before RoleService.initRoles() runs.
    const roleIdInsert = await getExplicitIdClauses(queryRunner, 'role');
    const roleCrudPermissions = ['CreateRole', 'ReadRole', 'UpdateRole', 'DeleteRole'];
    const roleEditorPermissions = ['Authenticated', ...roleCrudPermissions];
    const roleColumns =
        `${roleIdInsert.columns}${esc('createdAt')}, ${esc('updatedAt')}, ` +
        `${esc('code')}, ${esc('description')}, ${esc('permissions')}`;
    const roleValues =
        `${roleIdInsert.select}CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '${ROLE_EDITOR_ROLE_CODE}', ` +
        `'${ROLE_EDITOR_ROLE_DESCRIPTION}', '${roleEditorPermissions.join(',')}'`;
    await queryRunner.query(
        `INSERT INTO ${esc('role')} (${roleColumns})
         SELECT ${roleValues}
         FROM (SELECT 1 AS ${esc('one')}) AS tmp
         WHERE NOT EXISTS (
             SELECT 1 FROM ${esc('role')} r WHERE r.${esc('code')} = '${ROLE_EDITOR_ROLE_CODE}'
         )`,
    );

    // 4. Append the new Role CRUD permissions to the SuperAdmin role's stored permissions
    // array. SuperAdmin access is derived at check time from the SuperAdmin permission, so
    // this changes nothing about what SuperAdmins can do — but pre-v4 versions re-synced
    // the stored array with all assignable permissions on boot and v4 no longer does, so
    // without this a migrated instance would present a stale permission list on the role.
    const superAdminRoleRows: Array<{ id: string | number; permissions: string }> = await queryRunner.query(
        `SELECT ${esc('id')}, ${esc('permissions')} FROM ${esc('role')}
             WHERE ${esc('code')} = '${SUPER_ADMIN_ROLE_CODE}'`,
    );
    for (const row of superAdminRoleRows) {
        const currentPermissions = row.permissions.split(',');
        const missingPermissions = roleCrudPermissions.filter(
            permission => !currentPermissions.includes(permission),
        );
        if (missingPermissions.length) {
            const idLiteral = typeof row.id === 'number' ? row.id : `'${row.id}'`;
            await queryRunner.query(
                `UPDATE ${esc('role')}
                 SET ${esc('permissions')} = '${[...currentPermissions, ...missingPermissions].join(',')}'
                 WHERE ${esc('id')} = ${idLiteral}`,
            );
        }
    }

    // 5. Delete the Customer role row — v4 removes the Customer role entirely (permissions
    // are membership-derived: Authenticated on every member Channel). The legacy join tables
    // still reference the role at this point, so their rows go first; both tables are
    // dropped by the surrounding migration right after this helper returns.
    const customerRoleRows: Array<{ id: string | number }> = await queryRunner.query(
        `SELECT ${esc('id')} FROM ${esc('role')} WHERE ${esc('code')} = '${CUSTOMER_ROLE_CODE}'`,
    );
    for (const row of customerRoleRows) {
        const idLiteral = typeof row.id === 'number' ? row.id : `'${row.id}'`;
        await queryRunner.query(
            `DELETE FROM ${esc('user_roles_role')} WHERE ${esc('roleId')} = ${idLiteral}`,
        );
        await queryRunner.query(
            `DELETE FROM ${esc('role_channels_channel')} WHERE ${esc('roleId')} = ${idLiteral}`,
        );
        await queryRunner.query(`DELETE FROM ${esc('role')} WHERE ${esc('id')} = ${idLiteral}`);
        console.log('Deleted the Customer role (customer permissions are membership-derived in v4).');
    }

    const insertedCount = (await countRows()) - countBefore;
    console.log(`Successfully migrated ${insertedCount} role assignments to the role_assignment table.`);
    return insertedCount;
}

/**
 * The SELECTs yielding the `(userId, roleId, channelId)` triples which the legacy tables
 * grant but `role_assignment` does not yet contain. The migration inserts their results;
 * {@link verifyRoleAssignmentData} requires them to be empty afterwards. `idSelect` prefixes
 * the selected columns with a generated id where the INSERT must supply one.
 */
function getPendingGrantQueries(
    queryRunner: QueryRunner,
    idSelect = '',
): { legacyGrants: string; superAdminGrants: string } {
    const esc = (name: string) => queryRunner.connection.driver.escape(name);
    const notYetAssigned = (userId: string, roleId: string, channelId: string) =>
        `NOT EXISTS (
             SELECT 1 FROM ${esc('role_assignment')} ra
             WHERE ra.${esc('userId')} = ${userId}
             AND ra.${esc('roleId')} = ${roleId}
             AND ra.${esc('channelId')} = ${channelId}
         )`;
    return {
        legacyGrants: `SELECT ${idSelect}ur.${esc('userId')} AS ${esc('userId')}, ur.${esc('roleId')} AS ${esc('roleId')}, rc.${esc('channelId')} AS ${esc('channelId')}
             FROM ${esc('user_roles_role')} ur
             INNER JOIN ${esc('role_channels_channel')} rc ON rc.${esc('roleId')} = ur.${esc('roleId')}
             INNER JOIN ${esc('role')} r ON r.${esc('id')} = ur.${esc('roleId')}
             WHERE r.${esc('code')} NOT IN ('${CUSTOMER_ROLE_CODE}', '${SUPER_ADMIN_ROLE_CODE}')
             AND ${notYetAssigned(`ur.${esc('userId')}`, `ur.${esc('roleId')}`, `rc.${esc('channelId')}`)}`,
        superAdminGrants: `SELECT ${idSelect}ur.${esc('userId')} AS ${esc('userId')}, ur.${esc('roleId')} AS ${esc('roleId')}, c.${esc('id')} AS ${esc('channelId')}
             FROM ${esc('user_roles_role')} ur
             INNER JOIN ${esc('role')} r ON r.${esc('id')} = ur.${esc('roleId')}
             INNER JOIN ${esc('channel')} c ON c.${esc('code')} = '${DEFAULT_CHANNEL_CODE}'
             WHERE r.${esc('code')} = '${SUPER_ADMIN_ROLE_CODE}'
             AND ${notYetAssigned(`ur.${esc('userId')}`, `ur.${esc('roleId')}`, `c.${esc('id')}`)}`,
    };
}

const MAX_REPORTED_MISMATCHES = 20;

/**
 * Checks that `role_assignment` holds exactly the grants the legacy tables describe under
 * the v4 rules: every legacy triple except the Customer role's, and one default-channel
 * row per SuperAdmin holder. Throws, listing the offending triples, on any missing or
 * extra row. An extra row is most likely a grant which was revoked in the legacy tables
 * after an earlier pass of a staged rollout copied it.
 */
async function verifyRoleAssignmentData(queryRunner: QueryRunner): Promise<void> {
    const esc = (name: string) => queryRunner.connection.driver.escape(name);
    const pending = getPendingGrantQueries(queryRunner);
    const missing: Triple[] = [
        ...(await queryRunner.query(`${pending.legacyGrants} LIMIT ${MAX_REPORTED_MISMATCHES}`)),
        ...(await queryRunner.query(`${pending.superAdminGrants} LIMIT ${MAX_REPORTED_MISMATCHES}`)),
    ];
    const extra: Triple[] = await queryRunner.query(
        `SELECT ra.${esc('userId')}, ra.${esc('roleId')}, ra.${esc('channelId')}
         FROM ${esc('role_assignment')} ra
         LEFT JOIN ${esc('role')} r ON r.${esc('id')} = ra.${esc('roleId')}
         WHERE NOT (
             (COALESCE(r.${esc('code')}, '') NOT IN ('${CUSTOMER_ROLE_CODE}', '${SUPER_ADMIN_ROLE_CODE}')
                 AND EXISTS (
                     SELECT 1 FROM ${esc('user_roles_role')} ur
                     INNER JOIN ${esc('role_channels_channel')} rc ON rc.${esc('roleId')} = ur.${esc('roleId')}
                     WHERE ur.${esc('userId')} = ra.${esc('userId')}
                     AND ur.${esc('roleId')} = ra.${esc('roleId')}
                     AND rc.${esc('channelId')} = ra.${esc('channelId')}
                 ))
             OR (COALESCE(r.${esc('code')}, '') = '${SUPER_ADMIN_ROLE_CODE}'
                 AND ra.${esc('channelId')} IN (
                     SELECT c.${esc('id')} FROM ${esc('channel')} c WHERE c.${esc('code')} = '${DEFAULT_CHANNEL_CODE}'
                 )
                 AND EXISTS (
                     SELECT 1 FROM ${esc('user_roles_role')} ur
                     WHERE ur.${esc('userId')} = ra.${esc('userId')}
                     AND ur.${esc('roleId')} = ra.${esc('roleId')}
                 ))
         )
         LIMIT ${MAX_REPORTED_MISMATCHES}`,
    );
    if (missing.length === 0 && extra.length === 0) {
        return;
    }
    const format = (triples: Triple[]) =>
        triples.map(t => `  user ${t.userId}, role ${t.roleId}, channel ${t.channelId}`).join('\n');
    throw new Error(
        'Role assignment verification failed: role_assignment does not match the legacy ' +
            'user_roles_role and role_channels_channel tables. The legacy tables have not been ' +
            'modified. Showing up to ' +
            `${MAX_REPORTED_MISMATCHES} rows per kind.` +
            (missing.length ? `\nGranted by the legacy tables but missing:\n${format(missing)}` : '') +
            (extra.length ? `\nPresent but not granted by the legacy tables:\n${format(extra)}` : ''),
    );
}

interface Triple {
    userId: string | number;
    roleId: string | number;
    channelId: string | number;
}

/**
 * When the table's id column is neither auto-incremented nor covered by a database-side
 * default (the case for the uuid EntityIdStrategy on MySQL and SQLite, where TypeORM
 * generates uuids in the application layer), the INSERT ... SELECT must supply the id
 * itself.
 */
async function getExplicitIdClauses(
    queryRunner: QueryRunner,
    tableName = 'role_assignment',
): Promise<{ columns: string; select: string }> {
    const esc = (name: string) => queryRunner.connection.driver.escape(name);
    const table = await queryRunner.getTable(tableName);
    const idColumn = table?.findColumnByName('id');
    if (!idColumn) {
        throw new Error(`Could not inspect the id column of the ${tableName} table.`);
    }
    const isAutoIncrement = idColumn.isGenerated && idColumn.generationStrategy === 'increment';
    const hasDatabaseDefault = idColumn.default !== undefined && idColumn.default !== null;
    if (isAutoIncrement || hasDatabaseDefault) {
        return { columns: '', select: '' };
    }
    return { columns: `${esc('id')}, `, select: `${getUuidExpression(queryRunner)}, ` };
}

function getUuidExpression(queryRunner: QueryRunner): string {
    const type = queryRunner.connection.options.type;
    switch (type) {
        case 'mysql':
        case 'mariadb':
        case 'aurora-mysql':
            return 'UUID()';
        case 'postgres':
        case 'aurora-postgres':
        case 'cockroachdb':
            return 'gen_random_uuid()';
        case 'sqlite':
        case 'better-sqlite3':
        case 'sqljs':
            // uuid v4 recipe: randomblob() is non-deterministic, so it is evaluated per row
            return (
                "lower(hex(randomblob(4)) || '-' || hex(randomblob(2)) || '-4' || " +
                "substr(hex(randomblob(2)), 2) || '-' || substr('89ab', abs(random()) % 4 + 1, 1) || " +
                "substr(hex(randomblob(2)), 2) || '-' || hex(randomblob(6)))"
            );
        default:
            throw new Error(
                `migrateRoleAssignmentData() cannot generate uuid primary keys for the "${type}" driver. ` +
                    'Populate the role_assignment table manually in your migration.',
            );
    }
}
