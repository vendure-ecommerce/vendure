import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CustomFieldConfig, GetAvailableCountries, ModalService } from '@vendure/admin-ui/core';

import { AddressDetailDialogComponent } from '../address-detail-dialog/address-detail-dialog.component';

@Component({
    selector: 'vdr-address-card',
    templateUrl: './address-card.component.html',
    styleUrls: ['./address-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressCardComponent implements OnInit {
    @Input() addressForm: FormGroup;
    @Input() customFields: CustomFieldConfig;
    @Input() availableCountries: GetAvailableCountries.Items[] = [];
    @Input() isDefaultBilling: string;
    @Input() isDefaultShipping: string;
    @Output() setAsDefaultShipping = new EventEmitter<string>();
    @Output() setAsDefaultBilling = new EventEmitter<string>();

    constructor(private modalService: ModalService, private changeDetector: ChangeDetectorRef) {}

    ngOnInit(): void {
        const streetLine1 = this.addressForm.get('streetLine1') as FormControl;
        if (!streetLine1.value) {
            this.editAddress();
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

    editAddress() {
        this.modalService
            .fromComponent(AddressDetailDialogComponent, {
                locals: {
                    addressForm: this.addressForm,
                    customFields: this.customFields,
                    availableCountries: this.availableCountries,
                },
                size: 'md',
                closable: true,
            })
            .subscribe(() => {
                this.changeDetector.markForCheck();
            });
    }
}
