import { PaginatedListDataTable } from '@/components/shared/paginated-list-data-table.js';
import { Button } from '@/components/ui/button.js';
import { addCustomFields } from '@/framework/document-introspection/add-custom-fields.js';
import { graphql } from '@/graphql/graphql.js';
import { Link } from '@tanstack/react-router';
import { ColumnFiltersState, SortingState } from '@tanstack/react-table';
import { useState } from 'react';

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
}

export function CustomerGroupMembersTable({ customerGroupId }: CustomerGroupMembersTableProps) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [filters, setFilters] = useState<ColumnFiltersState>([]);

    return (
        <PaginatedListDataTable
            listQuery={addCustomFields(customerGroupMemberListDocument)}
            transformVariables={variables => ({
                ...variables,
                id: customerGroupId
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
                                <Link
                                    to="/customers/$id"
                                    params={{ id: row.original.id }}
                                >
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
    );
}
