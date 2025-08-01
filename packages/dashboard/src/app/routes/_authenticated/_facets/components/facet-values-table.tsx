import { DetailPageButton } from '@/vdb/components/shared/detail-page-button.js';
import { PaginatedListDataTable } from '@/vdb/components/shared/paginated-list-data-table.js';
import { addCustomFields } from '@/vdb/framework/document-introspection/add-custom-fields.js';
import { graphql } from '@/vdb/graphql/graphql.js';
import { Trans } from '@/vdb/lib/trans.js';
import { Link } from '@tanstack/react-router';
import { Button } from '@/vdb/components/ui/button.js';
import { ColumnFiltersState, SortingState } from '@tanstack/react-table';
import { PlusIcon } from 'lucide-react';
import { useRef, useState } from 'react';
import { deleteFacetValuesDocument } from '../facets.graphql.js';

export const facetValueListDocument = graphql(`
    query FacetValueList($options: FacetValueListOptions) {
        facetValues(options: $options) {
            items {
                id
                createdAt
                updatedAt
                name
                code
                customFields
            }
            totalItems
        }
    }
`);

export interface FacetValuesTableProps {
    facetId: string;
    registerRefresher?: (refresher: () => void) => void;
}

export function FacetValuesTable({ facetId, registerRefresher }: Readonly<FacetValuesTableProps>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [filters, setFilters] = useState<ColumnFiltersState>([]);
    const refreshRef = useRef<() => void>(() => {});

    return (
        <>
            <PaginatedListDataTable
                listQuery={addCustomFields(facetValueListDocument)}
                deleteMutation={deleteFacetValuesDocument}
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
                registerRefresher={refresher => {
                    refreshRef.current = refresher;
                    registerRefresher?.(refresher);
                }}
                transformVariables={variables => {
                    const filter = variables.options?.filter ?? {};
                    return {
                        options: {
                            filter: {
                                ...filter,
                                facetId: { eq: facetId },
                            },
                            sort: variables.options?.sort,
                            take: pageSize,
                            skip: (page - 1) * pageSize,
                        },
                    };
                }}
                onSearchTermChange={searchTerm => {
                    return {
                        name: {
                            contains: searchTerm,
                        },
                    };
                }}
                customizeColumns={{
                    name: {
                        header: 'Name',
                        cell: ({ row }) => (
                            <DetailPageButton
                                id={row.original.id}
                                label={row.original.name}
                                href={`/facets/${facetId}/values/${row.original.id}`}
                            />
                        ),
                    },
                }}
            />
            <div className="mt-4">
                <Button asChild variant="outline">
                    <Link to="./values/new">
                        <PlusIcon />
                        <Trans>Add facet value</Trans>
                    </Link>
                </Button>
            </div>
        </>
    );
}
