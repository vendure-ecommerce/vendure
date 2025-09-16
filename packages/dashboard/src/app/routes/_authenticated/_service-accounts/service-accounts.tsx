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

const NameHeader = () => <Trans>Name</Trans>;
const RolesHeader = () => <Trans>Roles</Trans>;
const IdentifierHeader = () => <Trans>Identifier</Trans>;

function NameCell({ row }: Readonly<{ row: any }>) {
    const first = row.original.firstName || '';
    const last = row.original.lastName || '';
    const fallback = row.original.user.roles[0]?.code || 'Service account';
    const label = (first || last) ? `${first} ${last}`.trim() : fallback;
    return <DetailPageButton id={row.original.id} label={label} />;
}

function RolesCell({ row }: Readonly<{ row: any }>) {
    return (
        <div className="flex flex-wrap gap-2">
            {row.original.user.roles.map((role: any) => (
                <Badge variant="secondary" key={role.id}>
                    <RoleCodeLabel code={role.code} />
                </Badge>
            ))}
        </div>
    );
}

function IdentifierCell({ row }: Readonly<{ row: any }>) {
    return <div>{row.original.emailAddress}</div>;
}

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
                const filter = { ...(variables.options?.filter ?? {}), isServiceAccount: { eq: true } };
                return { ...variables, options: { ...(variables.options ?? {}), filter } };
            }}
            onSearchTermChange={searchTerm => {
                return {
                    firstName: { contains: searchTerm },
                    lastName: { contains: searchTerm },
                    emailAddress: { contains: searchTerm },
                };
            }}
            additionalColumns={{
                name: {
                    header: NameHeader,
                    cell: NameCell,
                },
                roles: {
                    header: RolesHeader,
                    cell: RolesCell,
                },
            }}
            customizeColumns={{
                emailAddress: {
                    id: 'Identifier',
                    header: IdentifierHeader,
                    cell: IdentifierCell,
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
