import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { CustomFieldConfig, GetAvailableCountries } from '../../../common/generated-types';

@Component({
    selector: 'vdr-address-form',
    templateUrl: './address-form.component.html',
    styleUrls: ['./address-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressFormComponent {
    @Input() customFields: CustomFieldConfig;
    @Input() formGroup: FormGroup;
    @Input() availableCountries: GetAvailableCountries.Items[];
}
