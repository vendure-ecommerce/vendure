import { Money } from '@/vdb/components/data-display/money.js';
import { DetailPageButton } from '@/vdb/components/shared/detail-page-button.js';
import {
    PaginatedListDataTable,
    PaginatedListRefresherRegisterFn,
} from '@/vdb/components/shared/paginated-list-data-table.js';
import { StockLevelLabel } from '@/vdb/components/shared/stock-level-label.js';
import { graphql } from '@/vdb/graphql/graphql.js';
import { useLocalFormat } from '@/vdb/hooks/use-local-format.js';
import { ColumnFiltersState, SortingState } from '@tanstack/react-table';
import { useState } from 'react';
import { productVariantListDocument } from '../products.graphql.js';

export const deleteProductVariantDocument = graphql(`
    mutation DeleteProductVariant($id: ID!) {
        deleteProductVariant(id: $id) {
            result
            message
        }
    }
`);

interface ProductVariantsTableProps {
    productId: string;
    registerRefresher?: PaginatedListRefresherRegisterFn;
    fromProductDetailPage?: boolean;
}

export function ProductVariantsTable({
    productId,
    registerRefresher,
    fromProductDetailPage,
}: ProductVariantsTableProps) {
    const { formatCurrencyName } = useLocalFormat();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [filters, setFilters] = useState<ColumnFiltersState>([]);

    return (
        <PaginatedListDataTable
            registerRefresher={registerRefresher}
            listQuery={productVariantListDocument}
            deleteMutation={deleteProductVariantDocument}
            transformVariables={variables => ({
                ...variables,
                productId,
            })}
            defaultVisibility={{
                id: false,
                currencyCode: false,
            }}
            customizeColumns={{
                name: {
                    header: 'Variant name',
                    cell: ({ row: { original } }) => (
                        <DetailPageButton
                            href={`../../product-variants/${original.id}`}
                            label={original.name}
                            search={fromProductDetailPage ? { from: 'product' } : undefined}
                        />
                    ),
                },
                currencyCode: {
                    cell: ({ row: { original } }) => formatCurrencyName(original.currencyCode, 'full'),
                },
                price: {
                    cell: ({ row: { original } }) => (
                        <Money value={original.price} currency={original.currencyCode} />
                    ),
                },
                priceWithTax: {
                    cell: ({ row: { original } }) => (
                        <Money value={original.priceWithTax} currency={original.currencyCode} />
                    ),
                },
                stockLevels: {
                    cell: ({ row: { original } }) => <StockLevelLabel stockLevels={original.stockLevels} />,
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
        />
    );
}
