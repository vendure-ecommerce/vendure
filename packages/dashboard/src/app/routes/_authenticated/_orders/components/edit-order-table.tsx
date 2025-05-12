import { ProductVariantSelector } from '@/components/shared/product-variant-selector.js';
import { VendureImage } from '@/components/shared/vendure-image.js';
import { Button } from '@/components/ui/button.js';
import { Input } from '@/components/ui/input.js';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.js';
import { ResultOf } from '@/graphql/graphql.js';
import { Trans } from '@/lib/trans.js';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    VisibilityState,
} from '@tanstack/react-table';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { draftOrderEligibleShippingMethodsDocument, orderDetailDocument, orderLineFragment } from '../orders.graphql.js';
import { MoneyGrossNet } from './money-gross-net.js';
import { OrderTableTotals } from './order-table-totals.js';
import { ShippingMethodSelector } from './shipping-method-selector.js';
import { OrderLineCustomFieldsForm } from './order-line-custom-fields-form.js';
import { UseFormReturn } from 'react-hook-form';

type OrderFragment = NonNullable<ResultOf<typeof orderDetailDocument>['order']>;
type OrderLineFragment = ResultOf<typeof orderLineFragment>;

type ShippingMethodQuote = ResultOf<typeof draftOrderEligibleShippingMethodsDocument>['eligibleShippingMethodsForDraftOrder'][number];

export interface OrderTableProps {
    order: OrderFragment;
    eligibleShippingMethods: ShippingMethodQuote[];
    onAddItem: (event: { productVariantId: string; }) => void;
    onAdjustLine: (event: { lineId: string; quantity: number; customFields: Record<string, any> }) => void;
    onRemoveLine: (event: { lineId: string }) => void;
    onSetShippingMethod: (event: { shippingMethodId: string }) => void;
    onApplyCouponCode: (event: { couponCode: string }) => void;
    onRemoveCouponCode: (event: { couponCode: string }) => void;
    orderLineForm: UseFormReturn<any>;
}

export function EditOrderTable({ order, eligibleShippingMethods, onAddItem, onAdjustLine, onRemoveLine,
    onSetShippingMethod, onApplyCouponCode, onRemoveCouponCode, orderLineForm }: OrderTableProps) {

    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [couponCode, setCouponCode] = useState('');

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
            cell: ({ row }) => {
                const value = row.original.unitPriceWithTax
                const netValue = row.original.unitPrice;
                return <MoneyGrossNet priceWithTax={value} price={netValue} currencyCode={currencyCode} />
            },
        },
        {
            header: 'Quantity',
            accessorKey: 'quantity',
            cell: ({ row }) => {
                return <div className="flex gap-2">
                    <Input type="number" value={row.original.quantity} onChange={e => onAdjustLine({ lineId: row.original.id, quantity: e.target.valueAsNumber, customFields: row.original.customFields })} />
                    <Button variant="outline" type="button" size="icon" onClick={() => onRemoveLine({ lineId: row.original.id })}>
                        <Trash2 />
                    </Button>
                    {row.original.customFields &&
                        <OrderLineCustomFieldsForm onUpdate={(customFields) => {
                            
                            onAdjustLine({
                                lineId: row.original.id,
                                quantity: row.original.quantity,
                                customFields: customFields
                            });
                        }} form={orderLineForm} />}
                </div>;
            },
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
                        ) : null}
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-12">
                                <div className="my-4 flex justify-center">
                                    <div className="max-w-lg">
                                        <ProductVariantSelector onProductVariantIdChange={variantId => {
                                            onAddItem({ productVariantId: variantId });
                                        }} />
                                    </div>
                                </div>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-12">
                                <ShippingMethodSelector
                                    eligibleShippingMethods={eligibleShippingMethods}
                                    selectedShippingMethodId={order.shippingLines?.[0]?.shippingMethod?.id}
                                    currencyCode={currencyCode}
                                    onSelect={(shippingMethodId) => onSetShippingMethod({ shippingMethodId })}
                                />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-12">
                                <div className="flex flex-col gap-4">
                                    <div className="flex gap-2">
                                        <Input
                                            type="text"
                                            placeholder="Coupon code"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    onApplyCouponCode({ couponCode });
                                                }
                                            }}
                                        />
                                        <Button
                                            type="button"
                                            onClick={() => onApplyCouponCode({ couponCode })}
                                            disabled={!couponCode}
                                        >
                                            <Trans>Apply</Trans>
                                        </Button>
                                    </div>
                                    {order.couponCodes?.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {order.couponCodes.map((code) => (
                                                <div
                                                    key={code}
                                                    className="flex items-center gap-2 px-3 py-1 text-sm border rounded-md"
                                                >
                                                    <span>{code}</span>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 w-6 p-0"
                                                        onClick={() => onRemoveCouponCode({ couponCode: code })}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </TableCell>
                        </TableRow>
                        <OrderTableTotals order={order} columnCount={columns.length} />
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
