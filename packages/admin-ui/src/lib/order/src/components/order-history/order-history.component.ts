import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import {
    GetOrderHistoryQuery,
    HistoryEntry,
    HistoryEntryType,
    OrderDetailFragment,
    TimelineDisplayType,
} from '@vendure/admin-ui/core';

type OrderHistoryItem = NonNullable<GetOrderHistoryQuery['order']>['history']['items'][number];

@Component({
    selector: 'vdr-order-history',
    templateUrl: './order-history.component.html',
    styleUrls: ['./order-history.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderHistoryComponent {
    @Input() order: OrderDetailFragment;
    @Input() history: OrderHistoryItem[];
    @Output() addNote = new EventEmitter<{ note: string; isPublic: boolean }>();
    @Output() updateNote = new EventEmitter<HistoryEntry>();
    @Output() deleteNote = new EventEmitter<HistoryEntry>();
    note = '';
    noteIsPrivate = true;
    expanded = false;
    readonly type = HistoryEntryType;

    getDisplayType(entry: OrderHistoryItem): TimelineDisplayType {
        if (entry.type === HistoryEntryType.ORDER_STATE_TRANSITION) {
            if (entry.data.to === 'Delivered') {
                return 'success';
            }
            if (entry.data.to === 'Cancelled') {
                return 'error';
            }
        }
        if (entry.type === HistoryEntryType.ORDER_FULFILLMENT_TRANSITION) {
            if (entry.data.to === 'Delivered') {
                return 'success';
            }
        }
        if (entry.type === HistoryEntryType.ORDER_PAYMENT_TRANSITION) {
            if (entry.data.to === 'Declined' || entry.data.to === 'Cancelled') {
                return 'error';
            }
        }
        if (entry.type === HistoryEntryType.ORDER_CANCELLATION) {
            return 'error';
        }
        if (entry.type === HistoryEntryType.ORDER_REFUND_TRANSITION) {
            return 'warning';
        }
        return 'default';
    }

    getTimelineIcon(entry: OrderHistoryItem) {
        if (entry.type === HistoryEntryType.ORDER_STATE_TRANSITION) {
            if (entry.data.to === 'Delivered') {
                return ['success-standard', 'is-solid'];
            }
            if (entry.data.to === 'Cancelled') {
                return 'ban';
            }
        }
        if (entry.type === HistoryEntryType.ORDER_PAYMENT_TRANSITION) {
            if (entry.data.to === 'Settled') {
                return 'credit-card';
            }
        }
        if (entry.type === HistoryEntryType.ORDER_NOTE) {
            return 'note';
        }
        if (entry.type === HistoryEntryType.ORDER_MODIFIED) {
            return 'pencil';
        }
        if (entry.type === HistoryEntryType.ORDER_FULFILLMENT_TRANSITION) {
            if (entry.data.to === 'Shipped') {
                return 'truck';
            }
            if (entry.data.to === 'Delivered') {
                return 'truck';
            }
        }
    }

    isFeatured(entry: OrderHistoryItem): boolean {
        switch (entry.type) {
            case HistoryEntryType.ORDER_STATE_TRANSITION: {
                return (
                    entry.data.to === 'Delivered' ||
                    entry.data.to === 'Cancelled' ||
                    entry.data.to === 'Settled'
                );
            }
            case HistoryEntryType.ORDER_PAYMENT_TRANSITION:
                return entry.data.to === 'Settled' || entry.data.to === 'Cancelled';
            case HistoryEntryType.ORDER_FULFILLMENT_TRANSITION:
                return entry.data.to === 'Delivered' || entry.data.to === 'Shipped';
            case HistoryEntryType.ORDER_NOTE:
            case HistoryEntryType.ORDER_MODIFIED:
                return true;
            default:
                return false;
        }
    }

    getFulfillment(
        entry: OrderHistoryItem,
    ): NonNullable<OrderDetailFragment['fulfillments']>[number] | undefined {
        if (
            (entry.type === HistoryEntryType.ORDER_FULFILLMENT ||
                entry.type === HistoryEntryType.ORDER_FULFILLMENT_TRANSITION) &&
            this.order.fulfillments
        ) {
            return this.order.fulfillments.find(f => f.id === entry.data.fulfillmentId);
        }
    }

    getPayment(entry: OrderHistoryItem): NonNullable<OrderDetailFragment['payments']>[number] | undefined {
        if (entry.type === HistoryEntryType.ORDER_PAYMENT_TRANSITION && this.order.payments) {
            return this.order.payments.find(p => p.id === entry.data.paymentId);
        }
    }

    getCancelledItems(entry: OrderHistoryItem): Array<{ name: string; quantity: number }> {
        const itemMap = new Map<string, number>();
        const cancelledItemIds: string[] = entry.data.orderItemIds;
        for (const line of this.order.lines) {
            for (const item of line.items) {
                if (cancelledItemIds.includes(item.id)) {
                    const count = itemMap.get(line.productVariant.name);
                    if (count != null) {
                        itemMap.set(line.productVariant.name, count + 1);
                    } else {
                        itemMap.set(line.productVariant.name, 1);
                    }
                }
            }
        }
        return Array.from(itemMap.entries()).map(([name, quantity]) => ({ name, quantity }));
    }

    getModification(id: string) {
        return this.order.modifications.find(m => m.id === id);
    }

    getName(entry: OrderHistoryItem): string {
        const { administrator } = entry;
        if (administrator) {
            return `${administrator.firstName} ${administrator.lastName}`;
        } else {
            const customer = this.order.customer;
            if (customer) {
                return `${customer.firstName} ${customer.lastName}`;
            }
        }
        return '';
    }

    addNoteToOrder() {
        this.addNote.emit({ note: this.note, isPublic: !this.noteIsPrivate });
        this.note = '';
        this.noteIsPrivate = true;
    }
}
