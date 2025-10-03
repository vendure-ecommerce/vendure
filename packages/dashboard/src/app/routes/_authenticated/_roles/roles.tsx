import { ChannelCodeLabel } from '@/vdb/components/shared/channel-code-label.js';
import { DetailPageButton } from '@/vdb/components/shared/detail-page-button.js';
import { PermissionGuard } from '@/vdb/components/shared/permission-guard.js';
import { RoleCodeLabel } from '@/vdb/components/shared/role-code-label.js';
import { Badge } from '@/vdb/components/ui/badge.js';
import { Button } from '@/vdb/components/ui/button.js';
import { CUSTOMER_ROLE_CODE, SUPER_ADMIN_ROLE_CODE } from '@/vdb/constants.js';
import { PageActionBarRight } from '@/vdb/framework/layout-engine/page-layout.js';
import { ListPage } from '@/vdb/framework/page/list-page.js';
import { Trans } from '@/vdb/lib/trans.js';
import { createFileRoute, Link } from '@tanstack/react-router';
import { LayersIcon, PlusIcon } from 'lucide-react';
import { ExpandablePermissions } from './components/expandable-permissions.js';
import { DeleteRolesBulkAction } from './components/role-bulk-actions.js';
import { roleListQuery } from './roles.graphql.js';

export const Route = createFileRoute('/_authenticated/_roles/roles')({
    component: RoleListPage,
    loader: () => ({ breadcrumb: () => <Trans>Roles</Trans> }),
});

const SYSTEM_ROLES = [SUPER_ADMIN_ROLE_CODE, CUSTOMER_ROLE_CODE];

function RoleListPage() {
    return (
        <ListPage
            pageId="role-list"
            title="Roles"
            listQuery={roleListQuery}
            route={Route}
            defaultVisibility={{
                description: true,
                code: true,
                channels: true,
                permissions: true,
            }}
            customizeColumns={{
                code: {
                    header: 'Code',
                    cell: ({ row }) => {
                        return (
                            <DetailPageButton
                                id={row.original.id}
                                label={<RoleCodeLabel code={row.original.code} />}
                                disabled={SYSTEM_ROLES.includes(row.original.code)}
                            />
                        );
                    },
                },
                permissions: {
                    header: 'Permissions',
                    cell: ({ row }) => {
                        if (SYSTEM_ROLES.includes(row.original.code)) {
                            return (
                                <span className="text-muted-foreground">
                                    <Trans>This is a default Role and cannot be modified</Trans>
                                </span>
                            );
                        }

                        return <ExpandablePermissions role={row.original} />;
                    },
                },
                channels: {
                    header: 'Channels',
                    cell: ({ row }) => {
                        if (SYSTEM_ROLES.includes(row.original.code)) {
                            return null;
                        }

                        return (
                            <div className="flex flex-wrap gap-2">
                                {row.original.channels.map(channel => (
                                    <Badge variant="secondary" key={channel.code}>
                                        <LayersIcon /> <ChannelCodeLabel code={channel.code} />
                                    </Badge>
                                ))}
                            </div>
                        );
                    },
                },
            }}
            bulkActions={[
                {
                    component: DeleteRolesBulkAction,
                    order: 500,
                },
            ]}
        >
            <PageActionBarRight>
                <PermissionGuard requires={['CreateAdministrator']}>
                    <Button asChild>
                        <Link to="./new">
                            <PlusIcon className="mr-2 h-4 w-4" />
                            New Role
                        </Link>
                    </Button>
                </PermissionGuard>
            </PageActionBarRight>
        </ListPage>
    );
}
