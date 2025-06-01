import { VendureImage } from '@/components/shared/vendure-image.js';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.js';
import { ResultOf } from '@/graphql/graphql.js';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    VisibilityState,
} from '@tanstack/react-table';
import { useState } from 'react';
import { orderDetailDocument, orderLineFragment } from '../orders.graphql.js';
import { MoneyGrossNet } from './money-gross-net.js';
import { OrderTableTotals } from './order-table-totals.js';

type OrderFragment = NonNullable<ResultOf<typeof orderDetailDocument>['order']>;
type OrderLineFragment = ResultOf<typeof orderLineFragment>;

export interface OrderTableProps {
    order: OrderFragment;
}

export function OrderTable({ order }: OrderTableProps) {
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

    const currencyCode = order.currencyCode;

    const columns: ColumnDef<OrderLineFragment>[] = [
        {
            header: 'Image',
            accessorKey: 'featuredAsset',
            cell: ({ row }) => {
                const asset = row.original.featuredAsset;
                return <VendureImage asset={asset} preset="tiny" />;
            },
        },
        {
            header: 'Product',
            accessorKey: 'productVariant.name',
        },
        {
            header: 'SKU',
            accessorKey: 'productVariant.sku',
        },
        {
            header: 'Unit price',
            accessorKey: 'unitPriceWithTax',
            cell: ({ cell, row }) => {
                const value = row.original.unitPriceWithTax;
                const netValue = row.original.unitPrice;
                return <MoneyGrossNet priceWithTax={value} price={netValue} currencyCode={currencyCode} />;
            },
        },
        {
            header: 'Quantity',
            accessorKey: 'quantity',
        },
        {
            header: 'Total',
            accessorKey: 'linePriceWithTax',
            cell: ({ cell, row }) => {
                const value = row.original.linePriceWithTax;
                const netValue = row.original.linePrice;
                return <MoneyGrossNet priceWithTax={value} price={netValue} currencyCode={currencyCode} />;
            },
        },
    ];

    const data = order.lines;

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        rowCount: data.length,
        onColumnVisibilityChange: setColumnVisibility,
        state: {
            columnVisibility,
        },
    });

    return (
        <div className="w-full">
            <div className="">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map(header => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef.header,
                                                      header.getContext(),
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map(row => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                    {row.getVisibleCells().map(cell => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                        <OrderTableTotals order={order} columnCount={columns.length} />
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
