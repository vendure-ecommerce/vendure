import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Customer, GetCustomerHistory, HistoryEntryType, TimelineDisplayType } from '@vendure/admin-ui/core';

@Component({
    selector: 'vdr-customer-history',
    templateUrl: './customer-history.component.html',
    styleUrls: ['./customer-history.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerHistoryComponent {
    @Input() customer: Customer.Fragment;
    @Input() history: GetCustomerHistory.Items[];
    @Output() addNote = new EventEmitter<{ note: string }>();
    note = '';
    readonly type = HistoryEntryType;

    getDisplayType(entry: GetCustomerHistory.Items): TimelineDisplayType {
        switch (entry.type) {
            case HistoryEntryType.CUSTOMER_VERIFIED:
            case HistoryEntryType.CUSTOMER_EMAIL_UPDATE_VERIFIED:
            case HistoryEntryType.CUSTOMER_PASSWORD_RESET_VERIFIED:
                return 'success';
            case HistoryEntryType.CUSTOMER_REGISTERED:
                return 'muted';
            case HistoryEntryType.CUSTOMER_REMOVED_FROM_GROUP:
                return 'error';
            default:
                return 'default';
        }
    }

    getTimelineIcon(entry: GetCustomerHistory.Items): string | [string, string] | undefined {
        switch (entry.type) {
            case HistoryEntryType.CUSTOMER_REGISTERED:
                return 'user';
            case HistoryEntryType.CUSTOMER_VERIFIED:
                return ['assign-user', 'is-solid'];
            case HistoryEntryType.CUSTOMER_NOTE:
                return 'note';
            case HistoryEntryType.CUSTOMER_ADDED_TO_GROUP:
            case HistoryEntryType.CUSTOMER_REMOVED_FROM_GROUP:
                return 'users';
        }
    }

    isFeatured(entry: GetCustomerHistory.Items): boolean {
        switch (entry.type) {
            case HistoryEntryType.CUSTOMER_REGISTERED:
            case HistoryEntryType.CUSTOMER_VERIFIED:
                return true;
            default:
                return false;
        }
    }

    getName(entry: GetCustomerHistory.Items): string {
        const { administrator } = entry;
        if (administrator) {
            return `${administrator.firstName} ${administrator.lastName}`;
        } else {
            return `${this.customer.firstName} ${this.customer.lastName}`;
        }
    }

    addNoteToCustomer() {
        this.addNote.emit({ note: this.note });
        this.note = '';
    }
}
