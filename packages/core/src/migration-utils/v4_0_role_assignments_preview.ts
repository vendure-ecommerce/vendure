// TODO: Remove this file once v4.0 has been stable for a while. It is a one-time
// migration helper and will not be needed after all users have upgraded past v4.0.
import { CUSTOMER_ROLE_CODE, SUPER_ADMIN_ROLE_CODE } from '@vendure/common/lib/shared-constants';
import { QueryRunner } from 'typeorm';

/**
 * @description
 * The intended behavior changes {@link migrateRoleAssignmentData} will cause for a given
 * database, as reported by {@link previewRoleAssignmentMigration}.
 *
 * @docsCategory migration
 * @docsPage previewRoleAssignmentMigration
 * @since 4.0.0
 */
export interface RoleAssignmentMigrationPreview {
    /**
     * @description
     * Per Channel, how many Customers lose or gain the Customer role's permissions. Pre-v4,
     * every holder of the Customer role held its permissions on every Channel the role was
     * assigned to, regardless of membership. In v4, Customers hold `Authenticated` on their
     * member Channels only. Counts are of Customer-role grants: a User may still hold the
     * same permissions through another Role.
     */
    customerChannelChanges: Array<{
        channelId: string;
        channelCode: string;
        customersLosingAccess: number;
        customersGainingAccess: number;
    }>;
    /**
     * @description
     * Permissions the legacy Customer role carried beyond `Authenticated`. v4 removes the
     * Customer role, so Customers lose these on every Channel.
     */
    customerRoleDroppedPermissions: string[];
    /**
     * @description
     * Roles which are held by Users but assigned to no Channel. They granted nothing
     * pre-v4 and produce no assignment rows, so their holders lose nothing, but the
     * holdings disappear.
     */
    rolesWithoutChannels: Array<{ roleId: string; roleCode: string; holderCount: number }>;
}

/**
 * @description
 * Reports, without writing anything, how the v4 role-assignment migration will change
 * effective permissions for the Users of this database. Run it after upgrading the Vendure
 * packages to v4 and **before** running the migration, while the database still has its
 * pre-v4 shape. It is safe to run against a production database.
 *
 * Only intended behavior changes are reported; whether the migration copies the data
 * correctly is verified by {@link migrateRoleAssignmentData} itself.
 *
 * ```ts
 * import { formatRoleAssignmentMigrationPreview, previewRoleAssignmentMigration } from '\@vendure/core';
 *
 * const queryRunner = dataSource.createQueryRunner();
 * const preview = await previewRoleAssignmentMigration(queryRunner);
 * console.log(formatRoleAssignmentMigrationPreview(preview));
 * await queryRunner.release();
 * ```
 *
 * @since 4.0.0
 * @docsCategory migration
 * @docsPage previewRoleAssignmentMigration
 * @docsWeight 0
 */
export async function previewRoleAssignmentMigration(
    queryRunner: QueryRunner,
): Promise<RoleAssignmentMigrationPreview> {
    // TypeORM applies the entityPrefix to join tables too
    const prefix = queryRunner.connection.options.entityPrefix ?? '';
    const hasLegacyTables =
        (await queryRunner.hasTable(`${prefix}user_roles_role`)) &&
        (await queryRunner.hasTable(`${prefix}role_channels_channel`));
    if (!hasLegacyTables) {
        throw new Error(
            'The user_roles_role and role_channels_channel tables do not exist. Run ' +
                'previewRoleAssignmentMigration() before running the v4 migration.',
        );
    }
    const esc = (name: string) => queryRunner.connection.driver.escape(name);
    const table = (name: string) => esc(`${prefix}${name}`);
    const customerRoleId = `(SELECT ${esc('id')} FROM ${table('role')} WHERE ${esc('code')} = '${CUSTOMER_ROLE_CODE}')`;

    const channelRows: Array<{ id: string | number; code: string }> = await queryRunner.query(
        `SELECT ${esc('id')}, ${esc('code')} FROM ${table('channel')}`,
    );
    const losingRows: ChannelCountRow[] = await queryRunner.query(
        `SELECT rc.${esc('channelId')} AS ${esc('channelId')}, COUNT(*) AS ${esc('count')}
         FROM ${table('user_roles_role')} ur
         INNER JOIN ${table('role_channels_channel')} rc ON rc.${esc('roleId')} = ur.${esc('roleId')}
         WHERE ur.${esc('roleId')} = ${customerRoleId}
         AND NOT EXISTS (
             SELECT 1 FROM ${table('customer')} cu
             INNER JOIN ${table('customer_channels_channel')} ccc ON ccc.${esc('customerId')} = cu.${esc('id')}
             WHERE cu.${esc('userId')} = ur.${esc('userId')}
             AND cu.${esc('deletedAt')} IS NULL
             AND ccc.${esc('channelId')} = rc.${esc('channelId')}
         )
         GROUP BY rc.${esc('channelId')}`,
    );
    const gainingRows: ChannelCountRow[] = await queryRunner.query(
        `SELECT ccc.${esc('channelId')} AS ${esc('channelId')}, COUNT(*) AS ${esc('count')}
         FROM ${table('customer')} cu
         INNER JOIN ${table('customer_channels_channel')} ccc ON ccc.${esc('customerId')} = cu.${esc('id')}
         WHERE cu.${esc('deletedAt')} IS NULL
         AND cu.${esc('userId')} IS NOT NULL
         AND NOT EXISTS (
             SELECT 1 FROM ${table('user_roles_role')} ur
             INNER JOIN ${table('role_channels_channel')} rc ON rc.${esc('roleId')} = ur.${esc('roleId')}
             WHERE ur.${esc('userId')} = cu.${esc('userId')}
             AND ur.${esc('roleId')} = ${customerRoleId}
             AND rc.${esc('channelId')} = ccc.${esc('channelId')}
         )
         GROUP BY ccc.${esc('channelId')}`,
    );
    const customerRoleRows: Array<{ permissions: string | null }> = await queryRunner.query(
        `SELECT ${esc('permissions')} FROM ${table('role')} WHERE ${esc('code')} = '${CUSTOMER_ROLE_CODE}'`,
    );
    const rolesWithoutChannelsRows: Array<{
        roleId: string | number;
        roleCode: string;
        holderCount: string | number;
    }> = await queryRunner.query(
        `SELECT r.${esc('id')} AS ${esc('roleId')}, r.${esc('code')} AS ${esc('roleCode')},
                    COUNT(*) AS ${esc('holderCount')}
             FROM ${table('role')} r
             INNER JOIN ${table('user_roles_role')} ur ON ur.${esc('roleId')} = r.${esc('id')}
             WHERE r.${esc('code')} NOT IN ('${CUSTOMER_ROLE_CODE}', '${SUPER_ADMIN_ROLE_CODE}')
             AND NOT EXISTS (
                 SELECT 1 FROM ${table('role_channels_channel')} rc WHERE rc.${esc('roleId')} = r.${esc('id')}
             )
             GROUP BY r.${esc('id')}, r.${esc('code')}`,
    );

    const losing = toCountMap(losingRows);
    const gaining = toCountMap(gainingRows);
    const customerChannelChanges = channelRows
        .map(channel => ({
            channelId: String(channel.id),
            channelCode: channel.code,
            customersLosingAccess: losing.get(String(channel.id)) ?? 0,
            customersGainingAccess: gaining.get(String(channel.id)) ?? 0,
        }))
        .filter(change => change.customersLosingAccess > 0 || change.customersGainingAccess > 0);
    // Role.permissions is a simple-array column: comma-joined permission names
    const customerRolePermissions = customerRoleRows[0]?.permissions?.split(',') ?? [];

    return {
        customerChannelChanges,
        customerRoleDroppedPermissions: customerRolePermissions.filter(
            permission => permission !== 'Authenticated',
        ),
        rolesWithoutChannels: rolesWithoutChannelsRows.map(row => ({
            roleId: String(row.roleId),
            roleCode: row.roleCode,
            holderCount: Number(row.holderCount),
        })),
    };
}

/**
 * @description
 * Renders a {@link RoleAssignmentMigrationPreview} as a human-readable report.
 *
 * @since 4.0.0
 * @docsCategory migration
 * @docsPage previewRoleAssignmentMigration
 */
export function formatRoleAssignmentMigrationPreview(preview: RoleAssignmentMigrationPreview): string {
    const lines: string[] = [
        'Role assignment migration preview',
        '=================================',
        'Nothing has been changed. This shows how permissions will change when',
        'migrateRoleAssignmentData() runs.',
    ];
    const channelChanges = [...preview.customerChannelChanges].sort((a, b) =>
        compareIds(a.channelId, b.channelId),
    );
    const totalLosing = channelChanges.reduce((sum, change) => sum + change.customersLosingAccess, 0);
    const totalGaining = channelChanges.reduce((sum, change) => sum + change.customersGainingAccess, 0);

    lines.push(
        '',
        'Summary',
        ...formatKeyValues([
            ['Channels with customer access changes', formatCount(channelChanges.length)],
            ['Customer channel accesses removed', formatCount(totalLosing)],
            ['Customer channel accesses added', formatCount(totalGaining)],
            ['Customer role permissions dropped', formatCount(preview.customerRoleDroppedPermissions.length)],
            ['Roles assigned to no channel', formatCount(preview.rolesWithoutChannels.length)],
        ]),
    );
    if (
        channelChanges.length === 0 &&
        preview.customerRoleDroppedPermissions.length === 0 &&
        preview.rolesWithoutChannels.length === 0
    ) {
        lines.push('', 'No behavior changes: every User keeps their current permissions.');
        return lines.join('\n');
    }

    let section = 0;
    if (channelChanges.length) {
        lines.push(
            '',
            `${++section}. Customer access per channel`,
            '   Before v4, every customer could act on every channel the Customer role was assigned',
            '   to, whether or not they were a member. From v4, a customer can act only on the',
            '   channels they are a member of.',
            '',
            ...formatTable(
                ['Channel', 'Lose access', 'Gain access'],
                [
                    ...channelChanges.map(change => [
                        change.channelCode,
                        formatCount(change.customersLosingAccess),
                        formatCount(change.customersGainingAccess),
                    ]),
                    ['Total', formatCount(totalLosing), formatCount(totalGaining)],
                ],
            ),
            '',
            '   Lose access: customers the Customer role covered on this channel who are not members',
            '   of it (soft-deleted customers count as non-members).',
            '   Gain access: members of a channel the Customer role did not cover.',
            '   A user who is also an administrator may keep access through an admin role.',
            '',
            '   Before migrating, check that customer channel memberships are correct. A large',
            '   "Lose access" count on a channel your customers use means memberships are missing.',
        );
    }
    if (preview.customerRoleDroppedPermissions.length) {
        lines.push(
            '',
            `${++section}. Customer role permissions that will be dropped`,
            '   v4 has no Customer role. Customers hold only Authenticated on their member',
            '   channels, so these extra permissions are lost on every channel:',
            ...preview.customerRoleDroppedPermissions.map(permission => `   - ${permission}`),
        );
    }
    if (preview.rolesWithoutChannels.length) {
        const roles = [...preview.rolesWithoutChannels].sort((a, b) => a.roleCode.localeCompare(b.roleCode));
        lines.push(
            '',
            `${++section}. Roles assigned to no channel`,
            '   These roles granted nothing before v4, so their holders lose nothing. Their',
            '   holdings are not migrated; assign the roles per channel if they are still needed.',
            '',
            ...formatTable(
                ['Role', 'Id', 'Holders'],
                roles.map(role => [role.roleCode, role.roleId, formatCount(role.holderCount)]),
            ),
        );
    }
    return lines.join('\n');
}

/**
 * Renders label / value pairs indented by three spaces, values right-aligned in one column.
 */
function formatKeyValues(pairs: Array<[string, string]>): string[] {
    const labelWidth = Math.max(...pairs.map(([label]) => label.length));
    const valueWidth = Math.max(...pairs.map(([, value]) => value.length));
    return pairs.map(([label, value]) => `   ${label.padEnd(labelWidth)}   ${value.padStart(valueWidth)}`);
}

/**
 * Renders rows as a plain-text table, indented by three spaces. The first column is
 * left-aligned, the others right-aligned.
 */
function formatTable(headers: string[], rows: string[][]): string[] {
    const widths = headers.map((header, i) => Math.max(header.length, ...rows.map(row => row[i].length)));
    const formatRow = (row: string[]) =>
        '   ' +
        row.map((cell, i) => (i === 0 ? cell.padEnd(widths[i]) : cell.padStart(widths[i]))).join('   ');
    return [
        formatRow(headers),
        '   ' + widths.map(width => '-'.repeat(width)).join('   '),
        ...rows.map(formatRow),
    ];
}

function formatCount(count: number): string {
    return count.toLocaleString('en-US');
}

function compareIds(a: string, b: string): number {
    const aNumber = Number(a);
    const bNumber = Number(b);
    return Number.isNaN(aNumber) || Number.isNaN(bNumber) ? a.localeCompare(b) : aNumber - bNumber;
}

interface ChannelCountRow {
    channelId: string | number;
    count: string | number;
}

function toCountMap(rows: ChannelCountRow[]): Map<string, number> {
    return new Map(rows.map(row => [String(row.channelId), Number(row.count)]));
}
