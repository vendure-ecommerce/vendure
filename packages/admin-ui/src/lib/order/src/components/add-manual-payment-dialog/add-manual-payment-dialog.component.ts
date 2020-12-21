import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
    CurrencyCode,
    DataService,
    Dialog,
    GetPaymentMethodList,
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
    form = new FormGroup({
        method: new FormControl('', Validators.required),
        transactionId: new FormControl('', Validators.required),
    });
    paymentMethods$: Observable<GetPaymentMethodList.Items[]>;
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
