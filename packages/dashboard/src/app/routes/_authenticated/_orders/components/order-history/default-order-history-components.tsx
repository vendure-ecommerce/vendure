import { HistoryEntry, HistoryEntryProps } from '@/vdb/framework/history-entry/history-entry.js';
import { Trans } from '@/vdb/lib/trans.js';

export function OrderStateTransitionComponent(props: Readonly<HistoryEntryProps>) {
    const { entry } = props;
    if (entry.data.from === 'Created') return null;

    return (
        <HistoryEntry {...props}>
            <p className="text-xs text-muted-foreground">
                <Trans>
                    From {entry.data.from} to {entry.data.to}
                </Trans>
            </p>
        </HistoryEntry>
    );
}

export function OrderPaymentTransitionComponent(props: Readonly<HistoryEntryProps>) {
    const { entry } = props;
    return (
        <HistoryEntry {...props}>
            <p className="text-xs text-muted-foreground">
                <Trans>
                    Payment #{entry.data.paymentId} transitioned to {entry.data.to}
                </Trans>
            </p>
        </HistoryEntry>
    );
}

export function OrderRefundTransitionComponent(props: Readonly<HistoryEntryProps>) {
    const { entry } = props;
    return (
        <HistoryEntry {...props}>
            <p className="text-xs text-muted-foreground">
                <Trans>
                    Refund #{entry.data.refundId} transitioned to {entry.data.to}
                </Trans>
            </p>
        </HistoryEntry>
    );
}

export function OrderFulfillmentTransitionComponent(props: Readonly<HistoryEntryProps>) {
    const { entry } = props;
    return (
        <HistoryEntry {...props}>
            <p className="text-xs text-muted-foreground">
                <Trans>
                    Fulfillment #{entry.data.fulfillmentId} from {entry.data.from} to {entry.data.to}
                </Trans>
            </p>
        </HistoryEntry>
    );
}

export function OrderFulfillmentComponent(props: Readonly<HistoryEntryProps>) {
    const { entry } = props;
    return (
        <HistoryEntry {...props}>
            <p className="text-xs text-muted-foreground">
                <Trans>Fulfillment #{entry.data.fulfillmentId} created</Trans>
            </p>
        </HistoryEntry>
    );
}

export function OrderModifiedComponent(props: Readonly<HistoryEntryProps>) {
    const { entry } = props;
    return (
        <HistoryEntry {...props}>
            <p className="text-xs text-muted-foreground">
                <Trans>Order modification #{entry.data.modificationId}</Trans>
            </p>
        </HistoryEntry>
    );
}

export function OrderCustomerUpdatedComponent(props: Readonly<HistoryEntryProps>) {
    return (
        <HistoryEntry {...props}>
            <p className="text-xs text-muted-foreground">
                <Trans>Customer information updated</Trans>
            </p>
        </HistoryEntry>
    );
}

export function OrderCancellationComponent(props: Readonly<HistoryEntryProps>) {
    return (
        <HistoryEntry {...props}>
            <p className="text-xs text-muted-foreground">
                <Trans>Order cancelled</Trans>
            </p>
        </HistoryEntry>
    );
}
