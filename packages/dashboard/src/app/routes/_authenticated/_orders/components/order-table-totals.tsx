import { TableCell, TableRow } from '@/vdb/components/ui/table.js';
import { ResultOf } from '@/vdb/graphql/graphql.js';
import { Trans } from '@/vdb/lib/trans.js';
import { orderDetailDocument } from '../orders.graphql.js';
import { MoneyGrossNet } from './money-gross-net.js';

type OrderFragment = NonNullable<ResultOf<typeof orderDetailDocument>['order']>;

export interface OrderTableTotalsProps {
    order: OrderFragment;
    columnCount: number;
}

export function OrderTableTotals({ order, columnCount }: Readonly<OrderTableTotalsProps>) {
    const currencyCode = order.currencyCode;

    return (
        <>
            {order.discounts?.length > 0
                ? order.discounts.map((discount, index) => (
                      <TableRow key={`${discount.description}-${index}`}>
                          <TableCell colSpan={columnCount - 1} className="h-12">
                              <Trans>Discount</Trans>: {discount.description}
                          </TableCell>
                          <TableCell colSpan={1} className="h-12">
                              <MoneyGrossNet
                                  priceWithTax={discount.amountWithTax}
                                  price={discount.amount}
                                  currencyCode={currencyCode}
                              />
                          </TableCell>
                      </TableRow>
                  ))
                : null}
            <TableRow>
                <TableCell colSpan={columnCount - 1} className="h-12">
                    <Trans>Sub total</Trans>
                </TableCell>
                <TableCell colSpan={1} className="h-12">
                    <MoneyGrossNet
                        priceWithTax={order.subTotalWithTax}
                        price={order.subTotal}
                        currencyCode={currencyCode}
                    />
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell colSpan={columnCount - 1} className="h-12">
                    <Trans>Shipping</Trans>
                </TableCell>
                <TableCell colSpan={1} className="h-12">
                    <MoneyGrossNet
                        priceWithTax={order.shippingWithTax}
                        price={order.shipping}
                        currencyCode={currencyCode}
                    />
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell colSpan={columnCount - 1} className="h-12 font-bold">
                    <Trans>Total</Trans>
                </TableCell>
                <TableCell colSpan={1} className="h-12 font-bold">
                    <MoneyGrossNet
                        priceWithTax={order.totalWithTax}
                        price={order.total}
                        currencyCode={currencyCode}
                    />
                </TableCell>
            </TableRow>
        </>
    );
}
