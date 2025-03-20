import { addCustomFields } from '@/framework/document-introspection/add-custom-fields.js';
import { ListPage } from '@/framework/page/list-page.js';
import { createFileRoute } from '@tanstack/react-router';
import { ResultOf } from 'gql.tada';
import { CustomerStatusBadge } from './components/customer-status-badge.js';
import { customerListDocument } from './customers.graphql.js';
import { Button } from '@/components/ui/button.js';
import { Link } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/_customers/customers')({
    component: CustomerListPage,
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
                        const value = cell.getValue() as ResultOf<
                            typeof customerListDocument
                        >['customers']['items'][number]['user'];
                        const status = value ? (value.verified ? 'verified' : 'registered') : 'guest';
                        return <CustomerStatusBadge status={status} />;
                    },
                },
            }}
            additionalColumns={{
                name: {
                    header: 'Name',
                    cell: ({ row }) => {
                        const value = `${row.original.firstName} ${row.original.lastName}`;
                        return (
                            <Button asChild variant="ghost">
                                <Link
                                    to="/_authenticated/_customers/customers/$id"
                                    params={{ id: row.original.id }}
                                >
                                    {value}
                                </Link>
                            </Button>
                        );
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
