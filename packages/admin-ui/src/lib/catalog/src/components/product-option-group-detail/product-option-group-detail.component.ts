import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    FormRecord,
    UntypedFormControl,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    CreateProductOptionGroupInput,
    createUpdatedTranslatable,
    DataService,
    DeletionResult,
    findTranslation,
    getCustomFieldsDefaults,
    GetProductOptionGroupDocument,
    LanguageCode,
    ModalService,
    NotificationService,
    Permission,
    ProductOptionGroupWithOptionsFragment,
    TypedBaseDetailComponent,
    UpdateProductOptionGroupInput,
    UpdateProductOptionInput,
} from '@vendure/admin-ui/core';
import { normalizeString } from '@vendure/common/lib/normalize-string';
import { notNullOrUndefined } from '@vendure/common/lib/shared-utils';
import { gql } from 'apollo-angular';
import { BehaviorSubject, combineLatest, EMPTY, forkJoin, Observable } from 'rxjs';
import { debounceTime, map, mergeMap, switchMap, take, takeUntil } from 'rxjs/operators';

import { CreateProductOptionDialogComponent } from '../create-product-option-dialog/create-product-option-dialog.component';

export const PRODUCT_OPTION_GROUP_DETAIL_QUERY = gql`
    query GetProductOptionGroupDetail($id: ID!) {
        productOptionGroup(id: $id) {
            ...ProductOptionGroupWithOptions
        }
    }
`;

type OptionItem =
    | ProductOptionGroupWithOptionsFragment['options'][number]
    | {
          id: string;
          name: string;
          code: string;
      };

@Component({
    selector: 'vdr-product-option-group-detail',
    templateUrl: './product-option-group-detail.component.html',
    styleUrls: ['./product-option-group-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
export class ProductOptionGroupDetailComponent
    extends TypedBaseDetailComponent<typeof GetProductOptionGroupDocument, 'productOptionGroup'>
    implements OnInit, OnDestroy
{
    readonly customFields = this.getCustomFieldConfig('ProductOptionGroup');
    readonly customOptionFields = this.getCustomFieldConfig('ProductOption');
    detailForm = this.formBuilder.group({
        productOptionGroup: this.formBuilder.group({
            code: ['', Validators.required],
            name: '',
            customFields: this.formBuilder.group(getCustomFieldsDefaults(this.customFields)),
        }),
        options: this.formBuilder.record<
            FormGroup<{
                id: FormControl<string>;
                name: FormControl<string>;
                code: FormControl<string>;
                customFields: FormGroup;
            }>
        >({}),
    });
    currentPage = 1;
    itemsPerPage = 50;
    totalItems = 0;
    filterControl = new FormControl('');
    options$ = new BehaviorSubject<OptionItem[]>([]);
    readonly updatePermission = [Permission.UpdateCatalog];

    constructor(
        private changeDetector: ChangeDetectorRef,
        protected dataService: DataService,
        private formBuilder: FormBuilder,
        private notificationService: NotificationService,
        private modalService: ModalService,
    ) {
        super();
    }

    ngOnInit() {
        this.init();
        this.filterControl.valueChanges
            .pipe(debounceTime(200), takeUntil(this.destroy$))
            .subscribe(filterTerm => {
                this.filterOptions(filterTerm);
            });
    }

    ngOnDestroy() {
        this.destroy();
    }

    updateCode(currentCode: string, nameValue: string) {
        if (!currentCode) {
            const codeControl = this.detailForm.get(['productOptionGroup', 'code']);
            if (codeControl && codeControl.pristine) {
                codeControl.setValue(normalizeString(nameValue, '-'));
            }
        }
    }

    updateOptionCode(currentCode: string, nameValue: string, optionId: string) {
        if (!currentCode) {
            const codeControl = this.detailForm.get(['options', optionId, 'code']);
            if (codeControl && codeControl.pristine) {
                codeControl.setValue(normalizeString(nameValue, '-'));
            }
        }
    }

    customOptionFieldIsSet(index: number, name: string): boolean {
        return !!this.detailForm.get(['options', index, 'customFields', name]);
    }

    addProductOption() {
        this.modalService
            .fromComponent(CreateProductOptionDialogComponent, {
                locals: {
                    languageCode: this.languageCode,
                    productOptionGroupId: this.id,
                },
            })
            .pipe(
                switchMap(result => {
                    if (!result) {
                        return EMPTY;
                    }
                    return this.dataService.product.addOptionToGroup(result);
                }),
            )
            .subscribe(result => {
                if (result.createProductOption) {
                    this.notificationService.success(_('common.notify-create-success'), {
                        entity: 'ProductOption',
                    });
                    this.dataService
                        .query(GetProductOptionGroupDocument, { id: this.id })
                        .refetchOnChannelChange()
                        .single$.subscribe();
                }
            });
    }

    create() {
        const groupForm = this.detailForm.get(
            'productOptionGroup',
        ) as (typeof this.detailForm)['controls']['productOptionGroup'];
        if (!groupForm || !groupForm.dirty) {
            return;
        }
        const newGroup = this.getUpdatedProductOptionGroup(
            {
                id: '',
                createdAt: '',
                updatedAt: '',
                languageCode: this.languageCode,
                name: '',
                code: '',
                translations: [],
                options: [],
            },
            groupForm,
            this.languageCode,
        ) as CreateProductOptionGroupInput;
        this.dataService.product.createProductOptionGroups(newGroup).subscribe(
            data => {
                this.notificationService.success(_('common.notify-create-success'), {
                    entity: 'ProductOptionGroup',
                });
                this.detailForm.markAsPristine();
                this.changeDetector.markForCheck();
                this.router.navigate(['../', data.createProductOptionGroup.id], { relativeTo: this.route });
            },
            err => {
                this.notificationService.error(_('common.notify-create-error'), {
                    entity: 'ProductOptionGroup',
                });
            },
        );
    }

    save() {
        const optionsFormRecord = this.detailForm.get(
            'options',
        ) as (typeof this.detailForm)['controls']['options'];
        combineLatest(this.entity$, this.languageCode$)
            .pipe(
                take(1),
                mergeMap(([productOptionGroup, languageCode]) => {
                    const groupForm = this.detailForm.get(
                        'productOptionGroup',
                    ) as (typeof this.detailForm)['controls']['productOptionGroup'];
                    const updateOperations: Array<Observable<any>> = [];

                    if (groupForm && groupForm.dirty) {
                        const updatedGroupInput = this.getUpdatedProductOptionGroup(
                            productOptionGroup,
                            groupForm,
                            languageCode,
                        ) as UpdateProductOptionGroupInput;
                        if (updatedGroupInput) {
                            updateOperations.push(
                                this.dataService.product.updateProductOptionGroup(updatedGroupInput),
                            );
                        }
                    }
                    if (optionsFormRecord && optionsFormRecord.dirty) {
                        const updatedOptions = this.getUpdatedProductOptions(optionsFormRecord, languageCode);
                        if (updatedOptions.length) {
                            updateOperations.push(
                                ...updatedOptions.map(option =>
                                    this.dataService.product.updateProductOption(option),
                                ),
                            );
                        }
                    }
                    return forkJoin(updateOperations);
                }),
            )
            .subscribe(
                () => {
                    this.detailForm.markAsPristine();
                    this.changeDetector.markForCheck();
                    this.notificationService.success(_('common.notify-update-success'), {
                        entity: 'ProductOptionGroup',
                    });
                },
                err => {
                    this.notificationService.error(_('common.notify-update-error'), {
                        entity: 'ProductOptionGroup',
                    });
                },
            );
    }

    deleteProductOption(optionId: string) {
        this.showModalAndDelete(optionId)
            .pipe(
                switchMap(response => {
                    if (response.deleteProductOption.result === DeletionResult.DELETED) {
                        return [true];
                    } else {
                        return this.showModalAndDelete(
                            optionId,
                            response.deleteProductOption.message || '',
                        ).pipe(map(r => r.deleteProductOption.result === DeletionResult.DELETED));
                    }
                }),
                switchMap(deleted =>
                    deleted
                        ? this.dataService.query(GetProductOptionGroupDocument, {
                              id: this.id,
                          }).single$
                        : [],
                ),
            )
            .subscribe(
                () => {
                    this.notificationService.success(_('common.notify-delete-success'), {
                        entity: 'ProductOption',
                    });
                },
                err => {
                    this.notificationService.error(_('common.notify-delete-error'), {
                        entity: 'ProductOption',
                    });
                },
            );
    }

    private showModalAndDelete(optionId: string, message?: string) {
        return this.modalService
            .dialog({
                title: _('catalog.confirm-delete-product-option'),
                body: message,
                buttons: [
                    { type: 'secondary', label: _('common.cancel') },
                    { type: 'danger', label: _('common.delete'), returnValue: true },
                ],
            })
            .pipe(
                switchMap(result =>
                    result ? this.dataService.product.deleteProductOption(optionId) : EMPTY,
                ),
            );
    }

    protected setCurrentPage(newPage: number) {
        this.currentPage = newPage;
        this.fetchProductOptions(this.currentPage, this.itemsPerPage, this.filterControl.value);
    }

    protected setItemsPerPage(itemsPerPage: number) {
        this.itemsPerPage = itemsPerPage;
        this.fetchProductOptions(this.currentPage, this.itemsPerPage, this.filterControl.value);
    }

    private fetchProductOptions(currentPage: number, itemsPerPage: number, filterTerm?: string | null) {
        //
    }

    protected setFormValues(
        productOptionGroup: ProductOptionGroupWithOptionsFragment,
        languageCode: LanguageCode,
    ) {
        const currentTranslation = findTranslation(productOptionGroup, languageCode);

        this.detailForm.patchValue({
            productOptionGroup: {
                code: productOptionGroup.code,
                name: currentTranslation?.name ?? '',
            },
        });

        if (this.customFields.length) {
            this.setCustomFieldFormValues(
                this.customFields,
                this.detailForm.get(['productOptionGroup', 'customFields']),
                productOptionGroup,
                currentTranslation,
            );
        }
        this.options$.next([...productOptionGroup.options]);
        this.totalItems = productOptionGroup.options.length;
        this.setProductOptionFormValues(productOptionGroup, languageCode);
    }

    private setProductOptionFormValues(
        productOptionGroup: ProductOptionGroupWithOptionsFragment,
        languageCode: LanguageCode,
    ) {
        const currentOptionsFormGroup = this.detailForm.get('options') as FormRecord;
        productOptionGroup.options.forEach(option => {
            const optionTranslation = findTranslation(option, languageCode);
            const group = {
                id: option.id,
                code: option.code,
                name: optionTranslation ? optionTranslation.name : '',
            };
            let optionControl = currentOptionsFormGroup.get(option.id) as FormGroup;
            if (!optionControl) {
                optionControl = this.formBuilder.group(group);
                currentOptionsFormGroup.addControl(option.id, optionControl);
            } else {
                optionControl.patchValue(group);
            }
            if (this.customOptionFields.length) {
                let customOptionFieldsGroup = optionControl.get(['customFields']) as
                    | UntypedFormGroup
                    | undefined;
                if (!customOptionFieldsGroup) {
                    customOptionFieldsGroup = new UntypedFormGroup({});
                    optionControl.addControl('customFields', customOptionFieldsGroup);
                }

                if (customOptionFieldsGroup) {
                    for (const fieldDef of this.customOptionFields) {
                        const key = fieldDef.name;
                        const fieldValue =
                            fieldDef.type === 'localeString'
                                ? (optionTranslation as any | undefined)?.customFields?.[key]
                                : (option as any).customFields[key];
                        const control = customOptionFieldsGroup.get(key);
                        if (control) {
                            control.setValue(fieldValue);
                        } else {
                            customOptionFieldsGroup.addControl(key, new UntypedFormControl(fieldValue));
                        }
                    }
                }
            }
        });
    }

    private filterOptions(filterTerm: string | null) {
        this.entity$.pipe(take(1)).subscribe(group => {
            if (!group) return;

            const filtered = filterTerm
                ? group.options.filter(
                      option =>
                          option.name.toLowerCase().includes(filterTerm.toLowerCase()) ||
                          option.code.toLowerCase().includes(filterTerm.toLowerCase()),
                  )
                : group.options;

            this.options$.next(filtered);
            this.totalItems = filtered.length;
        });
    }

    private getUpdatedProductOptionGroup(
        productOptionGroup: Partial<ProductOptionGroupWithOptionsFragment>,
        groupFormGroup: (typeof this.detailForm)['controls']['productOptionGroup'],
        languageCode: LanguageCode,
    ): CreateProductOptionGroupInput | UpdateProductOptionGroupInput {
        const input = createUpdatedTranslatable({
            translatable: productOptionGroup as any,
            updatedFields: groupFormGroup.value,
            customFieldConfig: this.customFields,
            languageCode,
            defaultTranslation: {
                languageCode,
                name: productOptionGroup.name || '',
            },
        });
        return input;
    }

    private getUpdatedProductOptions(
        optionsFormGroup: FormGroup,
        languageCode: LanguageCode,
    ): UpdateProductOptionInput[] {
        const dirtyOptionValues = Object.values(optionsFormGroup.controls)
            .filter(c => c.dirty)
            .map(c => c.value);

        return dirtyOptionValues
            .map((option, i) =>
                createUpdatedTranslatable({
                    translatable: option,
                    updatedFields: option,
                    customFieldConfig: this.customOptionFields,
                    languageCode,
                    defaultTranslation: {
                        languageCode,
                        name: '',
                    },
                }),
            )
            .filter(notNullOrUndefined);
    }
}
