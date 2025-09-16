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
import { serviceAccountListDocument } from './service-accounts.graphql.js';

export const Route = createFileRoute('/_authenticated/_service-accounts/service-accounts')({
    component: ServiceAccountListPage,
    loader: () => ({ breadcrumb: () => <Trans>Service Accounts</Trans> }),
});

function ServiceAccountListPage() {
    return (
        <ListPage
            pageId="service-account-list"
            title={<Trans>Service Accounts</Trans>}
            listQuery={serviceAccountListDocument}
            route={Route}
            transformVariables={variables => {
                const filter = { ...(variables.options?.filter ?? {}), isServiceAccount: { eq: true } } as any;
                return { ...variables, options: { ...(variables.options ?? {}), filter } } as any;
            }}
            onSearchTermChange={searchTerm => {
                return {
                    firstName: { contains: searchTerm },
                    lastName: { contains: searchTerm },
                    emailAddress: { contains: searchTerm },
                } as any;
            }}
            additionalColumns={{
                name: {
                    header: () => <Trans>Name</Trans>,
                    cell: ({ row }) => {
                        const first = (row.original as any).firstName || '';
                        const last = (row.original as any).lastName || '';
                        const fallback = row.original.user.roles[0]?.code || 'Service account';
                        const label = (first || last) ? `${first} ${last}`.trim() : fallback;
                        return <DetailPageButton id={row.original.id} label={label} />;
                    },
                },
                roles: {
                    header: () => <Trans>Roles</Trans>,
                    cell: ({ row }) => (
                        <div className="flex flex-wrap gap-2">
                            {row.original.user.roles.map(role => (
                                <Badge variant="secondary" key={role.id}>
                                    <RoleCodeLabel code={role.code} />
                                </Badge>
                            ))}
                        </div>
                    ),
                },
            }}
            customizeColumns={{
                emailAddress: {
                    id: 'Identifier',
                    header: () => <Trans>Identifier</Trans>,
                    cell: ({ row }) => <div>{row.original.emailAddress}</div>,
                },
            }}
            defaultVisibility={{ emailAddress: true }}
            defaultColumnOrder={['name', 'emailAddress', 'roles']}
        >
            <PageActionBarRight>
                <PermissionGuard requires={['CreateAdministrator']}>
                    <Button asChild>
                        <Link to="./new">
                            <PlusIcon />
                            <Trans>New Service Account</Trans>
                        </Link>
                    </Button>
                </PermissionGuard>
            </PageActionBarRight>
        </ListPage>
    );
}
