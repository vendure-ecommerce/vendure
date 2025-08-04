import { PaginatedListDataTable } from '@/vdb/components/shared/paginated-list-data-table.js';
import { Button } from '@/vdb/components/ui/button.js';
import { Popover, PopoverContent, PopoverTrigger } from '@/vdb/components/ui/popover.js';
import { addCustomFields } from '@/vdb/framework/document-introspection/add-custom-fields.js';
import { graphql } from '@/vdb/graphql/graphql.js';
import { Trans } from '@/vdb/lib/trans.js';
import { ColumnFiltersState, noop, SortingState } from '@tanstack/react-table';
import { useRef, useState } from 'react';

import { deleteProductOptionsDocument } from '../product-option-groups.graphql.js';

import { AddProductOptionDialog } from './add-product-option-dialog.js';
import { EditProductOption } from './edit-product-option.js';

export const productOptionListDocument = graphql(`
    query ProductOptionList($options: ProductOptionListOptions) {
        productOptions(options: $options) {
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

export interface ProductOptionsTableProps {
    groupId: string;
    registerRefresher?: (refresher: () => void) => void;
}

interface ProductOptionActionsProps {
    productOptionId: string;
    onEditSuccess: () => void;
}

function ProductOptionActions({ productOptionId, onEditSuccess }: ProductOptionActionsProps) {
    const [open, setOpen] = useState(false);

    const handleSuccess = () => {
        setOpen(false);
        onEditSuccess();
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button type="button" variant="outline" size="sm">
                    <Trans>Edit</Trans>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <EditProductOption
                    productOptionId={productOptionId}
                    onSuccess={handleSuccess}
                />
            </PopoverContent>
        </Popover>
    );
}

export function ProductOptionsTable({ groupId, registerRefresher }: Readonly<ProductOptionsTableProps>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [filters, setFilters] = useState<ColumnFiltersState>([]);
    const refreshRef = useRef<() => void>(noop);

    return (
        <>
            <PaginatedListDataTable
                listQuery={addCustomFields(productOptionListDocument)}
                deleteMutation={deleteProductOptionsDocument}
                page={page}
                itemsPerPage={pageSize}
                sorting={sorting}
                columnFilters={filters}
                onPageChange={(_, newPage, perPage) => {
                    setPage(newPage);
                    setPageSize(perPage);
                }}
                onSortChange={(_, newSorting) => {
                    setSorting(newSorting);
                }}
                onFilterChange={(_, newFilters) => {
                    setFilters(newFilters);
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
                                groupId: { eq: groupId },
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
                    productOptionActions: {
                        header: 'Actions',
                        cell: ({ row }) => (
                            <ProductOptionActions
                                productOptionId={row.original.id}
                                onEditSuccess={refreshRef.current}
                            />
                        )
                    },
                }}
            />
            <div className="mt-4">
                <AddProductOptionDialog
                    productOptionGroupId={groupId}
                    onSuccess={() => {
                        refreshRef.current?.();
                    }}
                />
            </div>
        </>
    );
}
