import { DetailPageButton } from '@/components/shared/detail-page-button.js';
import { addCustomFields } from '@/framework/document-introspection/add-custom-fields.js';
import { ListPage } from '@/framework/page/list-page.js';
import { createFileRoute } from '@tanstack/react-router';
import { CustomerStatusBadge } from './components/customer-status-badge.js';
import { customerListDocument } from './customers.graphql.js';
import { Trans } from '@lingui/react/macro';
export const Route = createFileRoute('/_authenticated/_customers/customers')({
    component: CustomerListPage,
    loader: () => ({ breadcrumb: () => <Trans>Customers</Trans> }),
});

export function CustomerListPage() {
    return (
        <ListPage
            title="Customers"
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
            listQuery={addCustomFields(customerListDocument)}
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
        />
    );
}
