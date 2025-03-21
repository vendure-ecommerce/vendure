import { createFileRoute } from '@tanstack/react-router';
import { Trans } from '@lingui/react/macro';
import { addCustomFields } from '@/framework/document-introspection/add-custom-fields.js';
import { roleListQuery } from './roles.graphql.js';
import { ListPage } from '@/framework/page/list-page.js';
import { ExpandablePermissions } from './components/expandable-permissions.js';
import { Badge } from '@/components/ui/badge.js';
import { LayersIcon } from 'lucide-react';

export const Route = createFileRoute('/_authenticated/_roles/roles')({
    component: RoleListPage,
    loader: () => ({ breadcrumb: () => <Trans>Roles</Trans> }),
});

const SYSTEM_ROLES = ['__super_admin_role__', '__customer_role__'];

function RoleListPage() {
    return (
        <ListPage
            title="Roles"
            listQuery={addCustomFields(roleListQuery)}
            route={Route}
            defaultVisibility={{
                description: true,
                code: true,
                channels: true,
                permissions: true,
            }}
            customizeColumns={{
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
                                        <LayersIcon /> {channel.code}
                                    </Badge>
                                ))}
                            </div>
                        );
                    },
                },
            }}
        />
    );
}
