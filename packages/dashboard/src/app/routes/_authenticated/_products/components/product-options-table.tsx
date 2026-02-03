import { DetailPageButton } from '@/vdb/components/shared/detail-page-button.js';
import { PaginatedListDataTable } from '@/vdb/components/shared/paginated-list-data-table.js';
import { Button } from '@/vdb/components/ui/button.js';
import { graphql } from '@/vdb/graphql/graphql.js';
import { Trans } from '@lingui/react/macro';
import { Link } from '@tanstack/react-router';
import { ColumnFiltersState, SortingState, Table, VisibilityState } from '@tanstack/react-table';
import { PlusIcon } from 'lucide-react';
import { useRef, useState } from 'react';
import { deleteProductOptionDocument } from '../product-option-groups.graphql.js';
import { usePage } from '@/vdb/hooks/use-page.js';
import { useUserSettings } from '@/vdb/hooks/use-user-settings.js';

export const productOptionListDocument = graphql(`
    query ProductOptionList($options: ProductOptionListOptions, $groupId: ID) {
        productOptions(options: $options, groupId: $groupId) {
            items {
                id
                createdAt
                updatedAt
                name
                code
            }
            totalItems
        }
    }
`);

export interface ProductOptionsTableProps {
    productOptionGroupId: string;
    registerRefresher?: (refresher: () => void) => void;
}

export function ProductOptionsTable({
    productOptionGroupId,
    registerRefresher,
}: Readonly<ProductOptionsTableProps>) {
    const { pageId } = usePage();

    const { setTableSettings, settings } = useUserSettings();
    const tableSettings = pageId ? settings.tableSettings?.[pageId] : undefined;

    const [sorting, setSorting] = useState<SortingState>([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [filters, setFilters] = useState<ColumnFiltersState>([]);
    const refreshRef = useRef<() => void>(() => {});

    return (
        <>
            <PaginatedListDataTable
                listQuery={productOptionListDocument}
                deleteMutation={deleteProductOptionDocument}
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
                onColumnVisibilityChange={(_, columnVisibility: any) => {
                    if (pageId) {
                        setTableSettings(pageId, 'columnVisibility', columnVisibility);
                    }
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
                                groupId: { eq: productOptionGroupId },
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
                defaultVisibility={tableSettings?.columnVisibility ?? {
                    name: true,
                    code: true,
                }}
                defaultColumnOrder={tableSettings?.columnOrder}
                customizeColumns={{
                    name: {
                        cell: ({ row }) => (
                            <DetailPageButton
                                id={row.original.id}
                                label={row.original.name}
                                href={`options/${row.original.id}`}
                            />
                        ),
                    },
                }}
            />
            <div className="mt-4">
                <Button asChild variant="outline">
                    <Link to="./options/new">
                        <PlusIcon />
                        <Trans>Add product option</Trans>
                    </Link>
                </Button>
            </div>
        </>
    );
}
