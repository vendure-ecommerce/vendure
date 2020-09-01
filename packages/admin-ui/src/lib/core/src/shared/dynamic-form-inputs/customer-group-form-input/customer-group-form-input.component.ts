import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DefaultFormComponentConfig, DefaultFormComponentId } from '@vendure/common/lib/shared-types';
import { Observable } from 'rxjs';
import { startWith } from 'rxjs/operators';

import { FormInputComponent } from '../../../common/component-registry-types';
import { GetCustomerGroups } from '../../../common/generated-types';
import { DataService } from '../../../data/providers/data.service';

@Component({
    selector: 'vdr-customer-group-form-input',
    templateUrl: './customer-group-form-input.component.html',
    styleUrls: ['./customer-group-form-input.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerGroupFormInputComponent implements FormInputComponent, OnInit {
    static readonly id: DefaultFormComponentId = 'customer-group-form-input';
    @Input() readonly: boolean;
    formControl: FormControl;
    customerGroups$: Observable<GetCustomerGroups.Items[]>;
    config: DefaultFormComponentConfig<'customer-group-form-input'>;

    constructor(private dataService: DataService) {}

    ngOnInit() {
        this.customerGroups$ = this.dataService.customer
            .getCustomerGroupList({
                take: 9999,
            })
            .mapSingle((res) => res.customerGroups.items)
            .pipe(startWith([]));
    }

    selectGroup(group: GetCustomerGroups.Items) {
        this.formControl.setValue(group.id);
    }
}
