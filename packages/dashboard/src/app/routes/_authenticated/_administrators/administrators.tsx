import { DetailPageButton } from '@/vdb/components/shared/detail-page-button.js';
import { PermissionGuard } from '@/vdb/components/shared/permission-guard.js';
import { RoleCodeLabel } from '@/vdb/components/shared/role-code-label.js';
import { Badge } from '@/vdb/components/ui/badge.js';
import { Button } from '@/vdb/components/ui/button.js';
import { PageActionBarRight } from '@/vdb/framework/layout-engine/page-layout.js';
import { ListPage } from '@/vdb/framework/page/list-page.js';
import { Trans } from '@/vdb/lib/trans.js';
import { createFileRoute, Link } from '@tanstack/react-router';
import { PlusIcon } from 'lucide-react';
import { administratorListDocument } from './administrators.graphql.js';
import { DeleteAdministratorsBulkAction } from './components/administrator-bulk-actions.js';

export const Route = createFileRoute('/_authenticated/_administrators/administrators')({
    component: AdministratorListPage,
    loader: () => ({ breadcrumb: () => <Trans>Administrators</Trans> }),
});

function AdministratorListPage() {
    return (
        <ListPage
            pageId="administrator-list"
            title="Administrators"
            listQuery={administratorListDocument}
            route={Route}
            onSearchTermChange={searchTerm => {
                return {
                    firstName: { contains: searchTerm },
                    lastName: { contains: searchTerm },
                    emailAddress: { contains: searchTerm },
                };
            }}
            additionalColumns={{
                name: {
                    header: 'Name',
                    cell: ({ row }) => (
                        <DetailPageButton
                            id={row.original.id}
                            label={`${row.original.firstName} ${row.original.lastName}`}
                        />
                    ),
                },
                roles: {
                    header: 'Roles',
                    cell: ({ row }) => {
                        return (
                            <div className="flex flex-wrap gap-2">
                                {row.original.user.roles.map(role => {
                                    return (
                                        <Badge variant="secondary" key={role.id}>
                                            <RoleCodeLabel code={role.code} />
                                        </Badge>
                                    );
                                })}
                            </div>
                        );
                    },
                },
            }}
            customizeColumns={{
                emailAddress: {
                    id: 'Identifier',
                    header: () => <Trans>Identifier</Trans>,
                    cell: ({ row }) => {
                        return <div>{row.original.emailAddress}</div>;
                    },
                },
            }}
            defaultVisibility={{
                emailAddress: true,
            }}
            defaultColumnOrder={['name', 'emailAddress', 'roles']}
            bulkActions={[
                {
                    component: DeleteAdministratorsBulkAction,
                    order: 500,
                },
            ]}
        >
            <PageActionBarRight>
                <PermissionGuard requires={['CreateAdministrator']}>
                    <Button asChild>
                        <Link to="./new">
                            <PlusIcon />
                            New Administrator
                        </Link>
                    </Button>
                </PermissionGuard>
            </PageActionBarRight>
        </ListPage>
    );
}
