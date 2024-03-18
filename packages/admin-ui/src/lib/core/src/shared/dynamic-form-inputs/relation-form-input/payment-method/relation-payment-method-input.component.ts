import { ChangeDetectionStrategy, Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { Observable, of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';

import * as Codegen from '../../../../common/generated-types';
import { RelationCustomFieldConfig } from '../../../../common/generated-types';
import { DataService } from '../../../../data/providers/data.service';
import { ModalService } from '../../../../providers/modal/modal.service';
import { RelationSelectorDialogComponent } from '../relation-selector-dialog/relation-selector-dialog.component';

@Component({
    selector: 'vdr-relation-payment-method-input',
    templateUrl: './relation-payment-method-input.component.html',
    styleUrls: ['./relation-payment-method-input.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RelationPaymentMethodInputComponent implements OnInit {
    @Input() readonly: boolean;
    @Input() parentFormControl: UntypedFormControl;
    @Input() config: RelationCustomFieldConfig;

    @ViewChild('selector') template: TemplateRef<any>;

    searchControl = new UntypedFormControl('');
    searchTerm$ = new Subject<string>();
    results$: Observable<Codegen.GetPaymentMethodListQuery['paymentMethods']['items']>;
    paymentMethod$: Observable<
        Codegen.GetPaymentMethodListQuery['paymentMethods']['items'][number] | undefined
    >;

    constructor(private modalService: ModalService, private dataService: DataService) {}

    ngOnInit() {
        this.paymentMethod$ = this.parentFormControl.valueChanges.pipe(
            startWith(this.parentFormControl.value),
            map(paymentMethod => paymentMethod?.id),
            distinctUntilChanged(),
            switchMap(id => {
                if (id) {
                    return this.dataService.paymentMethod
                        .getPaymentMethod(id)
                        .mapStream(data => data.paymentMethod || undefined);
                } else {
                    return of(undefined);
                }
            }),
        );

        this.results$ = this.searchTerm$.pipe(
            debounceTime(200),
            switchMap(term =>
                this.dataService.paymentMethod
                    .getPaymentMethods({
                        ...(term
                            ? {
                                  filter: {
                                      name: {
                                          contains: term,
                                      },
                                  },
                              }
                            : {}),
                        take: 10,
                    })
                    .mapSingle(data => {
                        return data.paymentMethods.items;
                    }),
            ),
        );
    }

    selectPaymentMethod() {
        this.modalService
            .fromComponent(RelationSelectorDialogComponent, {
                size: 'md',
                closable: true,
                locals: {
                    title: _('catalog.select-payment-method'),
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
