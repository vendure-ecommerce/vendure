import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { AddressFragment, OrderAddress } from '../../../common/generated-types';

@Component({
    selector: 'vdr-formatted-address',
    templateUrl: './formatted-address.component.html',
    styleUrls: ['./formatted-address.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormattedAddressComponent {
    @Input() address: AddressFragment | OrderAddress;

    getCountryName(): string {
        if (this.isAddressFragment(this.address)) {
            return this.address.country.name;
        } else {
            return this.address.country || '';
        }
    }

    private isAddressFragment(input: AddressFragment | OrderAddress): input is AddressFragment {
        return typeof input.country !== 'string';
    }
}
