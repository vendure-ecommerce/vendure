import { PaginatedListDataTable } from '@/components/shared/paginated-list-data-table.js';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet.js';
import { addCustomFields } from '@/framework/document-introspection/add-custom-fields.js';
import { graphql } from '@/graphql/graphql.js';
import { Trans } from '@lingui/react/macro';
import { ColumnFiltersState, SortingState } from '@tanstack/react-table';
import { PanelLeftOpen } from 'lucide-react';
import { useState } from 'react';

const facetValueListDocument = graphql(`
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

export interface FacetValuesSheetProps {
    facetName: string;
    facetId: string;
}

export function FacetValuesSheet({ facetName, facetId }: FacetValuesSheetProps) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [filters, setFilters] = useState<ColumnFiltersState>([]);
    return (
        <Sheet>
            <SheetTrigger>
                <PanelLeftOpen className="w-4 h-4" />
            </SheetTrigger>
            <SheetContent className="min-w-[90vw] lg:min-w-[800px]">
                <SheetHeader>
                    <SheetTitle>
                        <Trans>Facet values for {facetName}</Trans>
                    </SheetTitle>
                    <SheetDescription>
                        <PaginatedListDataTable
                            listQuery={addCustomFields(facetValueListDocument)}
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
                        />
                    </SheetDescription>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    );
}
