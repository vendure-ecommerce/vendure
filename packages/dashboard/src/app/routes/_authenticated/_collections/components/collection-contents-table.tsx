import { PaginatedListDataTable } from '@/components/shared/paginated-list-data-table.js';
import { Button } from '@/components/ui/button.js';
import { addCustomFields } from '@/framework/document-introspection/add-custom-fields.js';
import { graphql } from '@/graphql/graphql.js';
import { Link } from '@tanstack/react-router';
import { ColumnFiltersState, SortingState } from '@tanstack/react-table';
import { useState } from 'react';

export const collectionContentsDocument = graphql(`
    query CollectionContentsList($collectionId: ID!, $options: ProductVariantListOptions) {
        collection(id: $collectionId) {
            id
            productVariants(options: $options) {
                items {
                    id
                    createdAt
                    updatedAt
                    name
                    sku
                }
                totalItems
            }
        }
    }
`);


export interface CollectionContentsTableProps {
    collectionId?: string;
}

export function CollectionContentsTable({ collectionId }: CollectionContentsTableProps) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [filters, setFilters] = useState<ColumnFiltersState>([]);
    
    return (
        <PaginatedListDataTable
            listQuery={addCustomFields(collectionContentsDocument)}
            transformVariables={(variables) => {
                return {
                    ...variables,
                    collectionId: collectionId,
                };
            }}
            customizeColumns={{
                name: {
                    header: 'Variant name',
                    cell: ({ row }) => {
                        return (
                            <Button asChild variant="ghost">
                                <Link to={`../../product-variants/${row.original.id}`}>{row.original.name} </Link>
                            </Button>
                        );
                    },
                },
            }}
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
                    name: {
                        contains: searchTerm,
                    },
                };
            }}
        />
    );
}
