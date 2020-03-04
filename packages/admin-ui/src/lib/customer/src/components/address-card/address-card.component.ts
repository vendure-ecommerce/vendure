import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { GetAvailableCountries } from '@vendure/admin-ui/core';

@Component({
    selector: 'vdr-address-card',
    templateUrl: './address-card.component.html',
    styleUrls: ['./address-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressCardComponent implements OnInit {
    editing = false;
    @Input() addressForm: FormGroup;
    @Input() availableCountries: GetAvailableCountries.Items[] = [];
    @Input() isDefaultBilling: string;
    @Input() isDefaultShipping: string;
    @Output() setAsDefaultShipping = new EventEmitter<string>();
    @Output() setAsDefaultBilling = new EventEmitter<string>();

    ngOnInit(): void {
        const streetLine1 = this.addressForm.get('streetLine1') as FormControl;
        if (!streetLine1.value) {
            this.editing = true;
        }
    }

    getCountryName(countryCode: string) {
        if (!this.availableCountries) {
            return '';
        }
        const match = this.availableCountries.find(c => c.code === countryCode);
        return match ? match.name : '';
    }

    setAsDefaultBillingAddress() {
        this.setAsDefaultBilling.emit(this.addressForm.value.id);
        this.addressForm.markAsDirty();
    }

    setAsDefaultShippingAddress() {
        this.setAsDefaultShipping.emit(this.addressForm.value.id);
        this.addressForm.markAsDirty();
    }
}
