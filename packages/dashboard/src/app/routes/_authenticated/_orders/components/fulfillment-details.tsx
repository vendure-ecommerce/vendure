import { LabeledData } from '@/vdb/components/labeled-data.js';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/vdb/components/ui/collapsible.js';
import { ResultOf } from '@/vdb/graphql/graphql.js';
import { useLocalFormat } from '@/vdb/hooks/use-local-format.js';
import { Trans } from '@/vdb/lib/trans.js';
import { ChevronDown } from 'lucide-react';
import { fulfillmentFragment, orderDetailFragment } from '../orders.graphql.js';

type Order = NonNullable<ResultOf<typeof orderDetailFragment>>;

type FulfillmentDetailsProps = {
    order: Order;
    fulfillment: ResultOf<typeof fulfillmentFragment>;
    currencyCode: string;
};

export function FulfillmentDetails({ order, fulfillment, currencyCode }: Readonly<FulfillmentDetailsProps>) {
    const { formatDate } = useLocalFormat();

    // Create a map of order lines by ID for quick lookup
    const orderLinesMap = new Map(order.lines.map(line => [line.id, line]));

    return (
        <div className="space-y-2 p-3 border rounded-md">
            <div className="space-y-2">
                <LabeledData label={<Trans>Fulfillment ID</Trans>} value={fulfillment.id.slice(-8)} />
                <LabeledData label={<Trans>Method</Trans>} value={fulfillment.method} />
                <LabeledData label={<Trans>State</Trans>} value={fulfillment.state} />
                {fulfillment.trackingCode && (
                    <LabeledData label={<Trans>Tracking code</Trans>} value={fulfillment.trackingCode} />
                )}
                <LabeledData label={<Trans>Created</Trans>} value={formatDate(fulfillment.createdAt)} />
            </div>

            {fulfillment.lines.length > 0 && (
                <div className="mt-3 pt-3 border-t">
                    <Collapsible>
                        <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md p-1 -m-1">
                            <Trans>Fulfilled items ({fulfillment.lines.length})</Trans>
                            <ChevronDown className="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-180" />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-2 space-y-1">
                            {fulfillment.lines.map((line, index) => {
                                const orderLine = orderLinesMap.get(line.orderLineId);
                                const productName = orderLine?.productVariant?.name || 'Unknown product';
                                const sku = orderLine?.productVariant?.sku;

                                return (
                                    <div
                                        key={line.orderLineId}
                                        className="text-sm text-muted-foreground"
                                    >
                                        <div className="font-medium text-foreground text-xs">{productName}</div>
                                        <div className="flex items-center gap-2 text-xs">
                                            <span>Qty: {line.quantity}</span>
                                            {sku && <span>SKU: {sku}</span>}
                                        </div>
                                    </div>
                                );
                            })}
                        </CollapsibleContent>
                    </Collapsible>
                </div>
            )}
        </div>
    );
}
