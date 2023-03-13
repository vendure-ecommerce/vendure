import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import {
    CurrencyCode,
    DataService,
    Dialog,
    GetPaymentMethodListQuery,
    ItemOf,
    ManualPaymentInput,
} from '@vendure/admin-ui/core';
import { Observable } from 'rxjs';

@Component({
    selector: 'vdr-add-manual-payment-dialog',
    templateUrl: './add-manual-payment-dialog.component.html',
    styleUrls: ['./add-manual-payment-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddManualPaymentDialogComponent implements OnInit, Dialog<Omit<ManualPaymentInput, 'orderId'>> {
    // populated by ModalService call
    outstandingAmount: number;
    currencyCode: CurrencyCode;

    resolveWith: (result?: Omit<ManualPaymentInput, 'orderId'>) => void;
    form = new UntypedFormGroup({
        method: new UntypedFormControl('', Validators.required),
        transactionId: new UntypedFormControl('', Validators.required),
    });
    paymentMethods$: Observable<Array<ItemOf<GetPaymentMethodListQuery, 'paymentMethods'>>>;
    constructor(private dataService: DataService) {}

    ngOnInit(): void {
        this.paymentMethods$ = this.dataService.settings
            .getPaymentMethods(999)
            .mapSingle(data => data.paymentMethods.items);
    }

    submit() {
        const formValue = this.form.value;
        this.resolveWith({
            method: formValue.method,
            transactionId: formValue.transactionId,
        });
    }

    cancel() {
        this.resolveWith();
    }
}
