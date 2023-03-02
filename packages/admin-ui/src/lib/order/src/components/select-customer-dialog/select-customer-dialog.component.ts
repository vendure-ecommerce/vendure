import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CreateCustomerInput, DataService, Dialog, GetCustomerListQuery } from '@vendure/admin-ui/core';
import { concat, Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';

export type Customer = GetCustomerListQuery['customers']['items'][number];

@Component({
    selector: 'vdr-select-customer-dialog',
    templateUrl: './select-customer-dialog.component.html',
    styleUrls: ['./select-customer-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectCustomerDialogComponent implements OnInit, Dialog<Customer | CreateCustomerInput> {
    resolveWith: (result?: Customer | CreateCustomerInput) => void;
    customerForm: UntypedFormGroup;
    customers$: Observable<Customer[]>;
    isLoading = false;
    input$ = new Subject<string>();
    selectedCustomer: Customer[] = [];
    useExisting = true;
    createNew = false;

    constructor(private dataService: DataService, private formBuilder: UntypedFormBuilder) {
        this.customerForm = this.formBuilder.group({
            title: '',
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            phoneNumber: '',
            emailAddress: ['', [Validators.required, Validators.email]],
        });
    }

    ngOnInit(): void {
        this.customers$ = concat(
            of([]), // default items
            this.input$.pipe(
                debounceTime(200),
                distinctUntilChanged(),
                tap(() => (this.isLoading = true)),
                switchMap(term =>
                    this.dataService.customer
                        .getCustomerList(10, 0, term)
                        .mapStream(({ customers }) => customers.items)
                        .pipe(
                            catchError(() => of([])), // empty list on error
                            tap(() => (this.isLoading = false)),
                        ),
                ),
            ),
        );
    }

    trackByFn(item: Customer) {
        return item.id;
    }

    cancel() {
        this.resolveWith();
    }

    select() {
        if (this.useExisting && this.selectedCustomer.length === 1) {
            this.resolveWith(this.selectedCustomer[0]);
        }
        if (this.createNew && this.customerForm.valid) {
            const formValue = this.customerForm.value;
            this.resolveWith(formValue);
        }
    }
}
