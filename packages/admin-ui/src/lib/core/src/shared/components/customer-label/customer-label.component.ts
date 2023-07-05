import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { CustomerFragment } from '../../../common/generated-types';

@Component({
    selector: 'vdr-customer-label',
    templateUrl: './customer-label.component.html',
    styleUrls: ['./customer-label.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerLabelComponent {
    @Input() customer: CustomerFragment;
}
