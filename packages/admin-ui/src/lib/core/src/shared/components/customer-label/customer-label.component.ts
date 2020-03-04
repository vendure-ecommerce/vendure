import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { Customer } from '../../../common/generated-types';

@Component({
    selector: 'vdr-customer-label',
    templateUrl: './customer-label.component.html',
    styleUrls: ['./customer-label.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerLabelComponent {
    @Input() customer: Customer.Fragment;
}
