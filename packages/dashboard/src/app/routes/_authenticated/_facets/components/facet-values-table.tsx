import { PaginatedListDataTable } from '@/vdb/components/shared/paginated-list-data-table.js';
import { Button } from '@/vdb/components/ui/button.js';
import { Popover, PopoverContent, PopoverTrigger } from '@/vdb/components/ui/popover.js';
import { addCustomFields } from '@/vdb/framework/document-introspection/add-custom-fields.js';
import { graphql } from '@/vdb/graphql/graphql.js';
import { Trans } from '@/vdb/lib/trans.js';
import { ColumnFiltersState, SortingState } from '@tanstack/react-table';
import { useRef, useState } from 'react';
import { AddFacetValueDialog } from './add-facet-value-dialog.js';
import { EditFacetValue } from './edit-facet-value.js';
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
                additionalColumns={{
                    actions: {
                        header: 'Actions',
                        cell: ({ row }) => {
                            const [open, setOpen] = useState(false);
                            const facetValue = row.original;
                            return (
                                <Popover open={open} onOpenChange={setOpen}>
                                    <PopoverTrigger asChild>
                                        <Button type="button" variant="outline" size="sm">
                                            <Trans>Edit</Trans>
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-80">
                                        <EditFacetValue
                                            facetValueId={facetValue.id}
                                            onSuccess={() => {
                                                setOpen(false);
                                                refreshRef.current?.();
                                            }}
                                        />
                                    </PopoverContent>
                                </Popover>
                            );
                        },
                    },
                }}
            />
            <div className="mt-4">
                <AddFacetValueDialog
                    facetId={facetId}
                    onSuccess={() => {
                        refreshRef.current?.();
                    }}
                />
            </div>
        </>
    );
}
