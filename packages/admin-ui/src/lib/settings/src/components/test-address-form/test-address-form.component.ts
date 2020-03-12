import { ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataService, GetAvailableCountries, LocalStorageService } from '@vendure/admin-ui/core';
import { Observable, Subscription } from 'rxjs';

export interface TestAddress {
    city: string;
    province: string;
    postalCode: string;
    countryCode: string;
}

@Component({
    selector: 'vdr-test-address-form',
    templateUrl: './test-address-form.component.html',
    styleUrls: ['./test-address-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestAddressFormComponent implements OnInit, OnDestroy {
    @Output() addressChange = new EventEmitter<TestAddress>();
    availableCountries$: Observable<GetAvailableCountries.Items[]>;
    form: FormGroup;
    private subscription: Subscription;

    constructor(
        private formBuilder: FormBuilder,
        private dataService: DataService,
        private localStorageService: LocalStorageService,
    ) {}

    ngOnInit() {
        this.availableCountries$ = this.dataService.settings
            .getAvailableCountries()
            .mapSingle(result => result.countries.items);
        const storedValue = this.localStorageService.getForCurrentLocation('shippingTestAddress');
        const initialValue: TestAddress = storedValue
            ? storedValue
            : {
                  city: '',
                  countryCode: '',
                  postalCode: '',
                  province: '',
              };
        this.addressChange.emit(initialValue);

        this.form = this.formBuilder.group(initialValue);
        this.subscription = this.form.valueChanges.subscribe(value => {
            this.localStorageService.setForCurrentLocation('shippingTestAddress', value);
            this.addressChange.emit(value);
        });
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
