import { LabeledData } from '@/vdb/components/labeled-data.js';
import { ResultOf } from '@/vdb/graphql/graphql.js';
import { useLocalFormat } from '@/vdb/hooks/use-local-format.js';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/vdb/components/ui/collapsible.js';
import { ChevronDown } from 'lucide-react';
import { Trans } from '@/vdb/lib/trans.js';
import { paymentWithRefundsFragment } from '../orders.graphql.js';
import { JsonEditor } from 'json-edit-react';

type PaymentDetailsProps = {
    payment: ResultOf<typeof paymentWithRefundsFragment>;
    currencyCode: string;
};

export function PaymentDetails({ payment, currencyCode }: Readonly<PaymentDetailsProps>) {
    const { formatCurrency, formatDate } = useLocalFormat();

    return (
        <div className="space-y-1 p-3 border rounded-md">
            <LabeledData label={<Trans>Payment method</Trans>} value={payment.method} />
            <LabeledData label={<Trans>Amount</Trans>} value={formatCurrency(payment.amount, currencyCode)} />
            <LabeledData label={<Trans>Created at</Trans>} value={formatDate(payment.createdAt)} />
            {payment.transactionId && (
                <LabeledData label={<Trans>Transaction ID</Trans>} value={payment.transactionId} />
            )}
            {/* We need to check if there is errorMessage field in the Payment type */}
            {payment.errorMessage && (
                <LabeledData
                    label={<Trans>Error message</Trans>}
                    value={payment.errorMessage}
                    className="text-destructive"
                />
            )}
            <Collapsible className="mt-2 border-t pt-2">
                <CollapsibleTrigger className="flex items-center justify-between w-full text-sm hover:underline text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md p-1 -m-1">
                    <Trans>Payment metadata</Trans>
                    <ChevronDown className="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-180" />
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2">
                    <JsonEditor viewOnly rootFontSize={12} minWidth={100} rootName='' data={payment.metadata} collapse />
                </CollapsibleContent>
            </Collapsible>
        </div>
    );
}
