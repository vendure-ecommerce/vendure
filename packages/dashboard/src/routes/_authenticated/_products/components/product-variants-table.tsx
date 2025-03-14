import { PaginatedListDataTable } from "@/components/shared/paginated-list-data-table.js";
import { productVariantListDocument } from "../products.graphql.js";
import { useState } from "react";
import { ColumnFiltersState, SortingState } from "@tanstack/react-table";

interface ProductVariantsTableProps {
    productId: string;
}

export function ProductVariantsTable({ productId }: ProductVariantsTableProps) {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [filters, setFilters] = useState<ColumnFiltersState>([]);

    return <PaginatedListDataTable
        listQuery={productVariantListDocument}
        transformVariables={variables => ({
            ...variables,
            productId,
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
    />;
}
