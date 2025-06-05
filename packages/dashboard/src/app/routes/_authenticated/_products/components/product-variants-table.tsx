import { PaginatedListDataTable, PaginatedListRefresherRegisterFn } from "@/components/shared/paginated-list-data-table.js";
import { productVariantListDocument } from "../products.graphql.js";
import { useState } from "react";
import { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import { Money } from "@/components/data-display/money.js";
import { useLocalFormat } from "@/hooks/use-local-format.js";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button.js";

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
                cell: ({ row }) => {
                    const variant = row.original as any;
                    return (
                        <Button asChild variant="ghost">
                            <Link to={`../../product-variants/${variant.id}`}>{variant.name} </Link>
                        </Button>
                    );
                },
            },
            currencyCode: {
                cell: ({ cell, row }) => {
                    const value = cell.getValue();
                    return formatCurrencyName(value as string, 'full');
                },
            },
            price: {
                cell: ({ cell, row }) => {
                    const variant = row.original as any;
                    const value = cell.getValue();
                    const currencyCode = variant.currencyCode;
                    if (typeof value === 'number') {
                        return <Money value={value} currency={currencyCode} />;
                    }
                    return value;
                },
            },
            priceWithTax: {
                cell: ({ cell, row }) => {
                    const variant = row.original as any;
                    const value = cell.getValue();
                    const currencyCode = variant.currencyCode;
                    if (typeof value === 'number') {
                        return <Money value={value} currency={currencyCode} />;
                    }
                    return value;
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
    />;
}
