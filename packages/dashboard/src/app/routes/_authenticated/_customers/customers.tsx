import { DetailPageButton } from '@/components/shared/detail-page-button.js';
import { PermissionGuard } from '@/components/shared/permission-guard.js';
import { Button } from '@/components/ui/button.js';
import { PageActionBarRight } from '@/framework/layout-engine/page-layout.js';
import { ListPage } from '@/framework/page/list-page.js';
import { Trans } from '@/lib/trans.js';
import { createFileRoute, Link } from '@tanstack/react-router';
import { PlusIcon } from 'lucide-react';
import { CustomerStatusBadge } from './components/customer-status-badge.js';
import { customerListDocument, deleteCustomerDocument } from './customers.graphql.js';

export const Route = createFileRoute('/_authenticated/_customers/customers')({
    component: CustomerListPage,
    loader: () => ({ breadcrumb: () => <Trans>Customers</Trans> }),
});

function CustomerListPage() {
    return (
        <ListPage
            title="Customers"
            pageId="customer-list"
            listQuery={customerListDocument}
            deleteMutation={deleteCustomerDocument}
            onSearchTermChange={searchTerm => {
                return {
                    lastName: {
                        contains: searchTerm,
                    },
                    emailAddress: {
                        contains: searchTerm,
                    },
                };
            }}
            transformVariables={variables => {
                return {
                    options: {
                        ...variables.options,
                        filterOperator: 'OR',
                    },
                };
            }}
            route={Route}
            customizeColumns={{
                user: {
                    header: 'Status',
                    cell: ({ cell }) => {
                        const value = cell.getValue();
                        return <CustomerStatusBadge user={value} />;
                    },
                },
            }}
            additionalColumns={{
                name: {
                    header: 'Name',
                    cell: ({ row }) => {
                        const value = `${row.original.firstName} ${row.original.lastName}`;
                        return <DetailPageButton id={row.original.id} label={value} />;
                    },
                },
            }}
            defaultColumnOrder={['name', 'emailAddress', 'user', 'createdAt']}
            defaultVisibility={{
                id: false,
                createdAt: false,
                updatedAt: false,
                firstName: false,
                lastName: false,
            }}
        >
            <PageActionBarRight>
                <PermissionGuard requires={['CreateCustomer']}>
                    <Button asChild>
                        <Link to="./new">
                            <PlusIcon />
                            <Trans>New Customer</Trans>
                        </Link>
                    </Button>
                </PermissionGuard>
            </PageActionBarRight>
        </ListPage>
    );
}
