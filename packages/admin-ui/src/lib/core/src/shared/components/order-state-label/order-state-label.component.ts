import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
    selector: 'vdr-order-state-label',
    templateUrl: './order-state-label.component.html',
    styleUrls: ['./order-state-label.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderStateLabelComponent {
    @Input() state: string;

    get chipColorType() {
        switch (this.state) {
            case 'PaymentAuthorized':
            case 'PaymentSettled':
            case 'PartiallyFulfilled':
                return 'warning';
            case 'Fulfilled':
                return 'success';
            case 'Cancelled':
                return 'error';
        }
    }
}
