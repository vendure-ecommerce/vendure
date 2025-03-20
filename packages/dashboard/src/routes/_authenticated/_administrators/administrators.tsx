import { ListPage } from '@/framework/page/list-page.js';
import { Link, createFileRoute } from '@tanstack/react-router';
import { addCustomFields } from '@/framework/document-introspection/add-custom-fields.js';
import { administratorListQuery } from './administrators.graphql.js';
import { Trans } from '@lingui/react/macro';
import { DetailPageButton } from '@/components/shared/detail-page-button.js';
import { PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button.js';
import { PermissionGuard } from '@/components/shared/permission-guard.js';
import { PageActionBar } from '@/framework/layout-engine/page-layout.js';
export const Route = createFileRoute('/_authenticated/_administrators/administrators')({
    component: AdministratorListPage,
    loader: () => ({ breadcrumb: () => <Trans>Administrators</Trans> }),
});

function AdministratorListPage() {
    return (
        <ListPage
            title="Administrators"
            listQuery={addCustomFields(administratorListQuery)}
            route={Route}
            onSearchTermChange={searchTerm => {
                return {
                    firstName: { contains: searchTerm },
                    lastName: { contains: searchTerm },
                    emailAddress: { contains: searchTerm },
                };
            }}
            additionalColumns={[
                {
                    id: 'name',
                    header: 'Name',
                    cell: ({ row }) => (
                        <DetailPageButton
                            id={row.original.id}
                            label={`${row.original.firstName} ${row.original.lastName}`}
                        />
                    ),
                },
                {
                    id: 'roles',
                    header: 'Roles',
                    cell: ({ row }) => {
                        return row.original.user.roles.map((role: any) => role.name).join(', ');
                    },
                },
            ]}
            defaultVisibility={{
                emailAddress: true,
            }}
        >
            <PageActionBar>
                <PermissionGuard requires={['CreateAdministrator']}>
                    <Button asChild>
                        <Link to="./new">
                            <PlusIcon className="mr-2 h-4 w-4" />
                            New Administrator
                        </Link>
                    </Button>
                </PermissionGuard>
            </PageActionBar>
        </ListPage>
    );
}
