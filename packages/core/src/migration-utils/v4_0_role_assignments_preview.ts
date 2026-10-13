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
    const hasLegacyTables =
        (await queryRunner.hasTable('user_roles_role')) &&
        (await queryRunner.hasTable('role_channels_channel'));
    if (!hasLegacyTables) {
        throw new Error(
            'The user_roles_role and role_channels_channel tables do not exist. Run ' +
                'previewRoleAssignmentMigration() before running the v4 migration.',
        );
    }
    const esc = (name: string) => queryRunner.connection.driver.escape(name);
    const customerRoleId = `(SELECT ${esc('id')} FROM ${esc('role')} WHERE ${esc('code')} = '${CUSTOMER_ROLE_CODE}')`;

    const channelRows: Array<{ id: string | number; code: string }> = await queryRunner.query(
        `SELECT ${esc('id')}, ${esc('code')} FROM ${esc('channel')}`,
    );
    const losingRows: ChannelCountRow[] = await queryRunner.query(
        `SELECT rc.${esc('channelId')} AS ${esc('channelId')}, COUNT(*) AS ${esc('count')}
         FROM ${esc('user_roles_role')} ur
         INNER JOIN ${esc('role_channels_channel')} rc ON rc.${esc('roleId')} = ur.${esc('roleId')}
         WHERE ur.${esc('roleId')} = ${customerRoleId}
         AND NOT EXISTS (
             SELECT 1 FROM ${esc('customer')} cu
             INNER JOIN ${esc('customer_channels_channel')} ccc ON ccc.${esc('customerId')} = cu.${esc('id')}
             WHERE cu.${esc('userId')} = ur.${esc('userId')}
             AND cu.${esc('deletedAt')} IS NULL
             AND ccc.${esc('channelId')} = rc.${esc('channelId')}
         )
         GROUP BY rc.${esc('channelId')}`,
    );
    const gainingRows: ChannelCountRow[] = await queryRunner.query(
        `SELECT ccc.${esc('channelId')} AS ${esc('channelId')}, COUNT(*) AS ${esc('count')}
         FROM ${esc('customer')} cu
         INNER JOIN ${esc('customer_channels_channel')} ccc ON ccc.${esc('customerId')} = cu.${esc('id')}
         WHERE cu.${esc('deletedAt')} IS NULL
         AND cu.${esc('userId')} IS NOT NULL
         AND NOT EXISTS (
             SELECT 1 FROM ${esc('user_roles_role')} ur
             INNER JOIN ${esc('role_channels_channel')} rc ON rc.${esc('roleId')} = ur.${esc('roleId')}
             WHERE ur.${esc('userId')} = cu.${esc('userId')}
             AND ur.${esc('roleId')} = ${customerRoleId}
             AND rc.${esc('channelId')} = ccc.${esc('channelId')}
         )
         GROUP BY ccc.${esc('channelId')}`,
    );
    const customerRoleRows: Array<{ permissions: string | null }> = await queryRunner.query(
        `SELECT ${esc('permissions')} FROM ${esc('role')} WHERE ${esc('code')} = '${CUSTOMER_ROLE_CODE}'`,
    );
    const rolesWithoutChannelsRows: Array<{
        roleId: string | number;
        roleCode: string;
        holderCount: string | number;
    }> = await queryRunner.query(
        `SELECT r.${esc('id')} AS ${esc('roleId')}, r.${esc('code')} AS ${esc('roleCode')},
                    COUNT(*) AS ${esc('holderCount')}
             FROM ${esc('role')} r
             INNER JOIN ${esc('user_roles_role')} ur ON ur.${esc('roleId')} = r.${esc('id')}
             WHERE r.${esc('code')} NOT IN ('${CUSTOMER_ROLE_CODE}', '${SUPER_ADMIN_ROLE_CODE}')
             AND NOT EXISTS (
                 SELECT 1 FROM ${esc('role_channels_channel')} rc WHERE rc.${esc('roleId')} = r.${esc('id')}
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
    const lines: string[] = [];
    if (preview.customerChannelChanges.length) {
        lines.push(
            'Customer access changes (Customers now hold permissions on their member Channels only; ' +
                'verify that Customer channel memberships are accurate before migrating):',
            ...preview.customerChannelChanges.map(
                change =>
                    `  - Channel "${change.channelCode}": ${change.customersLosingAccess} lose access, ` +
                    `${change.customersGainingAccess} gain access`,
            ),
        );
    }
    if (preview.customerRoleDroppedPermissions.length) {
        lines.push(
            'The Customer role carries permissions beyond Authenticated, which Customers lose ' +
                `on every Channel: ${preview.customerRoleDroppedPermissions.join(', ')}`,
        );
    }
    if (preview.rolesWithoutChannels.length) {
        lines.push(
            'Roles assigned to no Channel (they grant nothing, and their holdings are not migrated):',
            ...preview.rolesWithoutChannels.map(
                role => `  - "${role.roleCode}" (id ${role.roleId}): ${role.holderCount} holder(s)`,
            ),
        );
    }
    return lines.length
        ? lines.join('\n')
        : 'No behavior changes: every User keeps their current permissions.';
}

interface ChannelCountRow {
    channelId: string | number;
    count: string | number;
}

function toCountMap(rows: ChannelCountRow[]): Map<string, number> {
    return new Map(rows.map(row => [String(row.channelId), Number(row.count)]));
}
