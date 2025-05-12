import { PaginatedListDataTable } from '@/components/shared/paginated-list-data-table.js';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert.js';
import { Button } from '@/components/ui/button.js';
import { addCustomFields } from '@/framework/document-introspection/add-custom-fields.js';
import { graphql } from '@/graphql/graphql.js';
import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { ColumnFiltersState, SortingState } from '@tanstack/react-table';
import { PreviewCollectionVariantsInput } from '@vendure/common/lib/generated-types';
import { Eye } from 'lucide-react';
import { useState } from 'react';
import { getCollectionFiltersQueryOptions } from '../collections.graphql.js';

export const previewCollectionContentsDocument = graphql(`
    query PreviewCollectionContents(
        $input: PreviewCollectionVariantsInput!
        $options: ProductVariantListOptions
    ) {
        previewCollectionVariants(input: $input, options: $options) {
            items {
                id
                createdAt
                updatedAt
                productId
                name
                sku
            }
            totalItems
        }
    }
`);

export type CollectionContentsPreviewTableProps = PreviewCollectionVariantsInput;

export function CollectionContentsPreviewTable({
    parentId,
    filters: collectionFilters,
    inheritFilters,
}: CollectionContentsPreviewTableProps) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [filters, setFilters] = useState<ColumnFiltersState>([]);
    const { data: filterDefs } = useQuery(getCollectionFiltersQueryOptions);

    const effectiveFilters = collectionFilters.filter(f => {
        // ensure that every filter has all required arguments
        const filterDef = filterDefs?.collectionFilters.find(fd => fd.code === f.code);
        if (!filterDef) {
            return false;
        }
        for (const arg of filterDef.args) {
            const argPair = f.arguments.find(a => a.name === arg.name);
            const argValue = argPair?.value ?? arg.defaultValue;
            if (arg.required && argValue == null) {
                return false;
            }
        }
        return true;
    });

    return (
        <div>
            <Alert>
                <Eye className="h-4 w-4" />
                <AlertTitle>Preview</AlertTitle>
                <AlertDescription>
                    This is a preview of the collection contents based on the current
                    filter settings. Once you save the collection, the contents will be
                    updated to reflect the new filter settings.
                </AlertDescription>
            </Alert>

            <PaginatedListDataTable
                listQuery={addCustomFields(previewCollectionContentsDocument)}
                transformQueryKey={queryKey => {
                    return [...queryKey, JSON.stringify(effectiveFilters), inheritFilters];
                }}
                transformVariables={variables => {
                    return {
                        options: variables.options,
                        input: {
                            parentId,
                            filters: effectiveFilters,
                            inheritFilters,
                        },
                    };
                }}
                customizeColumns={{
                    name: {
                        header: 'Variant name',
                        cell: ({ row }) => {
                            return (
                                <Button asChild variant="ghost">
                                    <Link to={`../../product-variants/${row.original.id}`}>
                                        {row.original.name}{' '}
                                    </Link>
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
        </div>
    );
}
