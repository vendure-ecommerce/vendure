import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table.js";
import { Trans } from "@/lib/trans";
import { orderDetailFragment } from "../orders.graphql.js";
import { ResultOf } from "gql.tada";
import { useLocalFormat } from "@/hooks/use-local-format.js";

export function OrderTaxSummary({ order }: { order: ResultOf<typeof orderDetailFragment> }) {
    const { formatCurrency } = useLocalFormat();
    return <div>
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
}