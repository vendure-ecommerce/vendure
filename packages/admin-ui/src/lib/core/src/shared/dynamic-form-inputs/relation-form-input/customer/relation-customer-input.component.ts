import { ChangeDetectionStrategy, Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { Observable, of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';

import {
    CustomerFragment,
    GetCustomerList,
    GetProductList,
    GetProductSimple,
    RelationCustomFieldConfig,
} from '../../../../common/generated-types';
import { DataService } from '../../../../data/providers/data.service';
import { ModalService } from '../../../../providers/modal/modal.service';
import { RelationSelectorDialogComponent } from '../relation-selector-dialog/relation-selector-dialog.component';

@Component({
    selector: 'vdr-relation-customer-input',
    templateUrl: './relation-customer-input.component.html',
    styleUrls: ['./relation-customer-input.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RelationCustomerInputComponent implements OnInit {
    @Input() readonly: boolean;
    @Input() parentFormControl: FormControl;
    @Input() config: RelationCustomFieldConfig;

    @ViewChild('selector') template: TemplateRef<any>;

    searchControl = new FormControl('');
    searchTerm$ = new Subject<string>();
    results$: Observable<GetCustomerList.Items[]>;

    get customer(): CustomerFragment | undefined {
        return this.parentFormControl.value;
    }

    constructor(private modalService: ModalService, private dataService: DataService) {}

    ngOnInit() {
        this.results$ = this.searchTerm$.pipe(
            debounceTime(200),
            switchMap(term => {
                return this.dataService.customer
                    .getCustomerList(10, 0, term)
                    .mapSingle(data => data.customers.items);
            }),
        );
    }

    selectCustomer() {
        this.modalService
            .fromComponent(RelationSelectorDialogComponent, {
                size: 'md',
                closable: true,
                locals: {
                    title: _('customer.select-customer'),
                    selectorTemplate: this.template,
                },
            })
            .subscribe(result => {
                if (result) {
                    this.parentFormControl.setValue(result);
                    this.parentFormControl.markAsDirty();
                }
            });
    }

    remove() {
        this.parentFormControl.setValue(null);
        this.parentFormControl.markAsDirty();
    }
}
