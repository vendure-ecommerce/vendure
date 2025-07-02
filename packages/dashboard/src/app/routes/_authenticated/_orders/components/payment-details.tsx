import { ResultOf } from '@/vdb/graphql/graphql.js';
import { useLocalFormat } from '@/vdb/hooks/use-local-format.js';
import { Trans } from '@/vdb/lib/trans.js';
import { paymentWithRefundsFragment } from '../orders.graphql.js';

type PaymentDetailsProps = {
    payment: ResultOf<typeof paymentWithRefundsFragment>;
    currencyCode: string;
};

export function PaymentDetails({ payment, currencyCode }: Readonly<PaymentDetailsProps>) {
    const { formatCurrency, formatDate } = useLocalFormat();
    const t = (key: string) => key;

    return (
        <div className="space-y-2">
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

            <LabeledData
                label={<Trans>Payment metadata</Trans>}
                value={
                    <pre className="max-h-96 overflow-auto rounded-md bg-muted p-4 text-sm">
                        {JSON.stringify(payment.metadata, null, 2)}
                    </pre>
                }
            />
        </div>
    );
}

type LabeledDataProps = {
    label: string | React.ReactNode;
    value: React.ReactNode;
    className?: string;
};

function LabeledData({ label, value, className }: LabeledDataProps) {
    return (
        <div className="">
            <span className="font-medium text-muted-foreground text-sm">{label}</span>
            <div className={`col-span-2 ${className}`}>{value}</div>
        </div>
    );
}
