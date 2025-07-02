import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/vdb/components/ui/table.js';
import { useLocalFormat } from '@/vdb/hooks/use-local-format.js';
import { Trans } from '@/vdb/lib/trans';
import { ResultOf } from 'gql.tada';
import { orderDetailFragment } from '../orders.graphql.js';

export function OrderTaxSummary({ order }: { order: ResultOf<typeof orderDetailFragment> }) {
    const { formatCurrency } = useLocalFormat();
    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>
                            <Trans>Description</Trans>
                        </TableHead>
                        <TableHead>
                            <Trans>Tax rate</Trans>
                        </TableHead>
                        <TableHead>
                            <Trans>Tax base</Trans>
                        </TableHead>
                        <TableHead>
                            <Trans>Tax total</Trans>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {order.taxSummary.map(taxLine => (
                        <TableRow key={taxLine.description}>
                            <TableCell>{taxLine.description}</TableCell>
                            <TableCell>{taxLine.taxRate}%</TableCell>
                            <TableCell>{formatCurrency(taxLine.taxBase, order.currencyCode)}</TableCell>
                            <TableCell>{formatCurrency(taxLine.taxTotal, order.currencyCode)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
