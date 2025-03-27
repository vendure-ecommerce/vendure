import { CustomerSelector } from '@/components/shared/customer-selector.js';
import { PaginatedListDataTable, PaginatedListDataTableKey } from '@/components/shared/paginated-list-data-table.js';
import { Button } from '@/components/ui/button.js';
import { addCustomFields } from '@/framework/document-introspection/add-custom-fields.js';
import { api } from '@/graphql/api.js';
import { graphql } from '@/graphql/graphql.js';
import { Trans } from '@lingui/react/macro';
import { Link } from '@tanstack/react-router';
import { ColumnFiltersState, SortingState } from '@tanstack/react-table';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addCustomerToGroupDocument } from '../../_customers/customers.graphql.js';
import { toast } from 'sonner';
import { useLingui } from '@lingui/react';

export const customerGroupMemberListDocument = graphql(`
    query CustomerGroupMemberList($id: ID!, $options: CustomerListOptions) {
        customerGroup(id: $id) {
            customers(options: $options) {
                items {
                    id
                    createdAt
                    updatedAt
                    firstName
                    lastName
                    emailAddress
                }
                totalItems
            }
        }
    }
`);

export interface CustomerGroupMembersTableProps {
    customerGroupId: string;
    canAddCustomers?: boolean;
}

export function CustomerGroupMembersTable({ customerGroupId, canAddCustomers = true }: CustomerGroupMembersTableProps) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [filters, setFilters] = useState<ColumnFiltersState>([]);
    const { i18n } = useLingui();
    const queryClient = useQueryClient();

    const { mutate: addCustomerToGroup } = useMutation({
        mutationFn: api.mutate(addCustomerToGroupDocument),
        onSuccess: () => {
            toast.success(i18n.t('Customer added to group'));
            queryClient.invalidateQueries({ 
                queryKey: [PaginatedListDataTableKey, customerGroupMemberListDocument] 
            });
        },
        onError: () => {
            toast.error(i18n.t('Failed to add customer to group'));
        },
    });

    return (
        <div>
            <PaginatedListDataTable
                listQuery={addCustomFields(customerGroupMemberListDocument)}
                transformVariables={variables => ({
                    ...variables,
                    id: customerGroupId,
                })}
                page={page}
                itemsPerPage={pageSize}
                sorting={sorting}
                columnFilters={filters}
                onPageChange={(_, page, perPage) => {
                    setPage(page);
                    setPageSize(perPage);
                }}
                onSortChange={(_, sorting) => {
                    setSorting(sorting);
                }}
                onFilterChange={(_, filters) => {
                    setFilters(filters);
                }}
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
                additionalColumns={{
                    name: {
                        header: 'Name',
                        cell: ({ row }) => {
                            const value = `${row.original.firstName} ${row.original.lastName}`;
                            return (
                                <Button asChild variant="ghost">
                                    <Link to="/customers/$id" params={{ id: row.original.id }}>
                                        {value}
                                    </Link>
                                </Button>
                            );
                        },
                    },
                }}
                defaultColumnOrder={['name', 'emailAddress']}
                defaultVisibility={{
                    id: false,
                    createdAt: false,
                    updatedAt: false,
                    firstName: false,
                    lastName: false,
                }}
            />
            {canAddCustomers && (
                <CustomerSelector
                    onSelect={customer => {
                        addCustomerToGroup({
                        customerId: customer.id,
                        groupId: customerGroupId,
                    });
                }}
                    label={<Trans>Add customer</Trans>}
                />
            )}
        </div>
    );
}
