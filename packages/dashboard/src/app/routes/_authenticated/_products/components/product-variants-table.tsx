import { Money } from "@/components/data-display/money.js";
import { PaginatedListDataTable, PaginatedListRefresherRegisterFn } from "@/components/shared/paginated-list-data-table.js";
import { StockLevelLabel } from "@/components/shared/stock-level-label.js";
import { useLocalFormat } from "@/hooks/use-local-format.js";
import { DetailPageButton } from "@/index.js";
import { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import { useState } from "react";
import { productVariantListDocument } from "../products.graphql.js";
import { graphql } from '@/graphql/graphql.js';

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
}

export function ProductVariantsTable({ productId, registerRefresher }: ProductVariantsTableProps) {
    const { formatCurrencyName } = useLocalFormat();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [filters, setFilters] = useState<ColumnFiltersState>([]);

    return <PaginatedListDataTable
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
                cell: ({ row: { original } }) => <DetailPageButton href={`../../product-variants/${original.id}`} label={original.name} />,
            },
            currencyCode: {
                cell: ({ row: { original } }) => formatCurrencyName(original.currencyCode, 'full'),
            },
            price: {
                cell: ({ row: { original } }) => <Money value={original.price} currency={original.currencyCode} />,
            },
            priceWithTax: {
                cell: ({ row: { original } }) => <Money value={original.priceWithTax} currency={original.currencyCode} />,
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
    />;
}
