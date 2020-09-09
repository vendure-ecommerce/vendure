import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CustomFieldConfig, Dialog, GetAvailableCountries } from '@vendure/admin-ui/core';

@Component({
    selector: 'vdr-address-detail-dialog',
    templateUrl: './address-detail-dialog.component.html',
    styleUrls: ['./address-detail-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressDetailDialogComponent implements Dialog<FormGroup>, OnInit {
    addressForm: FormGroup;
    customFields: CustomFieldConfig;
    availableCountries: GetAvailableCountries.Items[] = [];
    resolveWith: (result?: FormGroup) => void;

    constructor(private changeDetector: ChangeDetectorRef) {}

    ngOnInit() {
        this.addressForm.valueChanges.subscribe(() => this.changeDetector.markForCheck());
    }

    cancel() {
        this.resolveWith();
    }

    save() {
        this.resolveWith(this.addressForm);
    }
}
