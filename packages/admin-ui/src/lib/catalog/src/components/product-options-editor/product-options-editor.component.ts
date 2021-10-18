import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    BaseDetailComponent,
    CreateFacetInput,
    createUpdatedTranslatable,
    CustomFieldConfig,
    DataService,
    FacetWithValues,
    findTranslation,
    GetProductVariantOptions,
    LanguageCode,
    NotificationService,
    Permission,
    ProductOption,
    ProductOptionGroup,
    ServerConfigService,
    UpdateFacetInput,
    UpdateProductOptionGroupInput,
    UpdateProductOptionInput,
} from '@vendure/admin-ui/core';
import { combineLatest, forkJoin, Observable } from 'rxjs';
import { map, mergeMap, take } from 'rxjs/operators';

import { ProductDetailService } from '../../providers/product-detail/product-detail.service';

@Component({
    selector: 'vdr-product-options-editor',
    templateUrl: './product-options-editor.component.html',
    styleUrls: ['./product-options-editor.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductOptionsEditorComponent
    extends BaseDetailComponent<GetProductVariantOptions.Product>
    implements OnInit
{
    detailForm: FormGroup;
    optionGroups$: Observable<GetProductVariantOptions.OptionGroups[]>;
    languageCode$: Observable<LanguageCode>;
    availableLanguages$: Observable<LanguageCode[]>;
    optionGroupCustomFields: CustomFieldConfig[];
    optionCustomFields: CustomFieldConfig[];
    autoUpdateVariantNames = true;
    readonly updatePermission = [Permission.UpdateCatalog, Permission.UpdateProduct];

    constructor(
        protected route: ActivatedRoute,
        protected router: Router,
        protected serverConfigService: ServerConfigService,
        protected dataService: DataService,
        private productDetailService: ProductDetailService,
        private formBuilder: FormBuilder,
        private changeDetector: ChangeDetectorRef,
        private notificationService: NotificationService,
    ) {
        super(route, router, serverConfigService, dataService);
        this.optionGroupCustomFields = this.getCustomFieldConfig('ProductOptionGroup');
        this.optionCustomFields = this.getCustomFieldConfig('ProductOption');
    }

    ngOnInit(): void {
        this.optionGroups$ = this.route.snapshot.data.entity.pipe(
            map((product: GetProductVariantOptions.Product) => product.optionGroups),
        );
        this.detailForm = new FormGroup({
            optionGroups: new FormArray([]),
        });
        super.init();
    }

    getOptionGroups(): FormGroup[] {
        const optionGroups = this.detailForm.get('optionGroups');
        return (optionGroups as FormArray).controls as FormGroup[];
    }

    getOptions(optionGroup: FormGroup): FormGroup[] {
        const options = optionGroup.get('options');
        return (options as FormArray).controls as FormGroup[];
    }

    save() {
        if (this.detailForm.invalid || this.detailForm.pristine) {
            return;
        }
        // tslint:disable-next-line:no-non-null-assertion
        const $product = this.dataService.product.getProduct(this.id).mapSingle(data => data.product!);
        combineLatest(this.entity$, this.languageCode$, $product)
            .pipe(
                take(1),
                mergeMap(([{ optionGroups }, languageCode, product]) => {
                    const updateOperations: Array<Observable<any>> = [];
                    for (const optionGroupForm of this.getOptionGroups()) {
                        if (optionGroupForm.get('name')?.dirty || optionGroupForm.get('code')?.dirty) {
                            const optionGroupEntity = optionGroups.find(
                                og => og.id === optionGroupForm.value.id,
                            );
                            if (optionGroupEntity) {
                                const input = this.getUpdatedOptionGroup(
                                    optionGroupEntity,
                                    optionGroupForm,
                                    languageCode,
                                );
                                updateOperations.push(
                                    this.dataService.product.updateProductOptionGroup(input),
                                );
                            }
                        }

                        for (const optionForm of this.getOptions(optionGroupForm)) {
                            if (optionForm.get('name')?.dirty || optionForm.get('code')?.dirty) {
                                const optionGroup = optionGroups
                                    .find(og => og.id === optionGroupForm.value.id)
                                    ?.options.find(o => o.id === optionForm.value.id);
                                if (optionGroup) {
                                    const input = this.getUpdatedOption(
                                        optionGroup,
                                        optionForm,
                                        languageCode,
                                    );
                                    updateOperations.push(
                                        this.productDetailService.updateProductOption(
                                            { ...input, autoUpdate: this.autoUpdateVariantNames },
                                            product,
                                            languageCode,
                                        ),
                                    );
                                }
                            }
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

    private getUpdatedOptionGroup(
        optionGroup: ProductOptionGroup.Fragment,
        optionGroupFormGroup: FormGroup,
        languageCode: LanguageCode,
    ): UpdateProductOptionGroupInput {
        const input = createUpdatedTranslatable({
            translatable: optionGroup,
            updatedFields: optionGroupFormGroup.value,
            customFieldConfig: this.optionGroupCustomFields,
            languageCode,
            defaultTranslation: {
                languageCode,
                name: optionGroup.name || '',
            },
        });
        return input;
    }

    private getUpdatedOption(
        option: ProductOption.Fragment,
        optionFormGroup: FormGroup,
        languageCode: LanguageCode,
    ): UpdateProductOptionInput {
        const input = createUpdatedTranslatable({
            translatable: option,
            updatedFields: optionFormGroup.value,
            customFieldConfig: this.optionGroupCustomFields,
            languageCode,
            defaultTranslation: {
                languageCode,
                name: option.name || '',
            },
        });
        return input;
    }

    protected setFormValues(entity: GetProductVariantOptions.Product, languageCode: LanguageCode): void {
        const groupsFormArray = new FormArray([]);
        for (const optionGroup of entity.optionGroups) {
            const groupTranslation = findTranslation(optionGroup, languageCode);
            const group = {
                id: optionGroup.id,
                createdAt: optionGroup.createdAt,
                updatedAt: optionGroup.updatedAt,
                code: optionGroup.code,
                name: groupTranslation ? groupTranslation.name : '',
            };
            const optionsFormArray = new FormArray([]);

            for (const option of optionGroup.options) {
                const optionTranslation = findTranslation(option, languageCode);
                const optionControl = this.formBuilder.group({
                    id: option.id,
                    createdAt: option.createdAt,
                    updatedAt: option.updatedAt,
                    code: option.code,
                    name: optionTranslation ? optionTranslation.name : '',
                });
                optionsFormArray.push(optionControl);
            }

            const groupControl = this.formBuilder.group(group);
            groupControl.addControl('options', optionsFormArray);
            groupsFormArray.push(groupControl);
        }
        this.detailForm.setControl('optionGroups', groupsFormArray);
    }
}
