import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import {
    CustomFieldConfig,
    DataService,
    GlobalFlag,
    LanguageCode,
    ModalService,
    Permission,
    ProductDetail,
    ProductOptionFragment,
    ProductVariant,
    ProductVariantFragment,
    TaxCategory,
    UpdateProductOptionInput,
} from '@vendure/admin-ui/core';
import { DEFAULT_CHANNEL_CODE } from '@vendure/common/lib/shared-constants';
import { unique } from '@vendure/common/lib/unique';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import { ApplyFacetDialogComponent } from '../apply-facet-dialog/apply-facet-dialog.component';
import { AssetChange } from '../assets/assets.component';
import {
    PaginationConfig,
    SelectedAssets,
    VariantFormValue,
} from '../product-detail/product-detail.component';
import { UpdateProductOptionDialogComponent } from '../update-product-option-dialog/update-product-option-dialog.component';

export interface VariantAssetChange extends AssetChange {
    variantId: string;
}

@Component({
    selector: 'vdr-product-variants-list',
    templateUrl: './product-variants-list.component.html',
    styleUrls: ['./product-variants-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductVariantsListComponent implements OnInit, OnDestroy {
    @Input('productVariantsFormArray') formArray: FormArray;
    @Input() variants: ProductVariant.Fragment[];
    @Input() paginationConfig: PaginationConfig;
    @Input() channelPriceIncludesTax: boolean;
    @Input() taxCategories: TaxCategory[];
    @Input() optionGroups: ProductDetail.OptionGroups[];
    @Input() customFields: CustomFieldConfig[];
    @Input() customOptionFields: CustomFieldConfig[];
    @Input() activeLanguage: LanguageCode;
    @Input() pendingAssetChanges: { [variantId: string]: SelectedAssets };
    @Input() pendingFacetValueChanges: { [variantId: string]: ProductVariantFragment['facetValues'] };
    @Output() assignToChannel = new EventEmitter<ProductVariant.Fragment>();
    @Output() removeFromChannel = new EventEmitter<{
        channelId: string;
        variant: ProductVariant.Fragment;
    }>();
    @Output() assetChange = new EventEmitter<VariantAssetChange>();
    @Output() selectionChange = new EventEmitter<string[]>();
    @Output() updateProductOption = new EventEmitter<UpdateProductOptionInput & { autoUpdate: boolean }>();
    selectedVariantIds: string[] = [];
    formGroupMap = new Map<string, FormGroup>();
    GlobalFlag = GlobalFlag;
    globalTrackInventory: boolean;
    globalOutOfStockThreshold: number;
    readonly updatePermission = [Permission.UpdateCatalog, Permission.UpdateProduct];
    private subscription: Subscription;

    constructor(
        private changeDetector: ChangeDetectorRef,
        private modalService: ModalService,
        private dataService: DataService,
    ) {}

    ngOnInit() {
        this.dataService.settings.getGlobalSettings('cache-first').single$.subscribe(({ globalSettings }) => {
            this.globalTrackInventory = globalSettings.trackInventory;
            this.globalOutOfStockThreshold = globalSettings.outOfStockThreshold;
            this.changeDetector.markForCheck();
        });
        this.subscription = this.formArray.valueChanges.subscribe(() => this.changeDetector.markForCheck());

        this.subscription.add(
            this.formArray.valueChanges
                .pipe(
                    map(value => value.length),
                    debounceTime(1),
                    distinctUntilChanged(),
                )
                .subscribe(() => {
                    this.buildFormGroupMap();
                }),
        );

        this.buildFormGroupMap();
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    isDefaultChannel(channelCode: string): boolean {
        return channelCode === DEFAULT_CHANNEL_CODE;
    }

    trackById(index: number, item: ProductVariant.Fragment) {
        return item.id;
    }

    inventoryIsNotTracked(formGroup: FormGroup): boolean {
        const trackInventory = formGroup.get('trackInventory')?.value;
        return (
            trackInventory === GlobalFlag.FALSE ||
            (trackInventory === GlobalFlag.INHERIT && this.globalTrackInventory === false)
        );
    }

    getTaxCategoryName(group: FormGroup): string {
        const control = group.get(['taxCategoryId']);
        if (control && this.taxCategories) {
            const match = this.taxCategories.find(t => t.id === control.value);
            return match ? match.name : '';
        }
        return '';
    }

    getStockOnHandMinValue(variant: FormGroup) {
        const effectiveOutOfStockThreshold = variant.get('useGlobalOutOfStockThreshold')?.value
            ? this.globalOutOfStockThreshold
            : variant.get('outOfStockThreshold')?.value;
        return effectiveOutOfStockThreshold;
    }

    getSaleableStockLevel(variant: ProductVariant.Fragment) {
        const effectiveOutOfStockThreshold = variant.useGlobalOutOfStockThreshold
            ? this.globalOutOfStockThreshold
            : variant.outOfStockThreshold;
        return variant.stockOnHand - variant.stockAllocated - effectiveOutOfStockThreshold;
    }

    areAllSelected(): boolean {
        return !!this.variants && this.selectedVariantIds.length === this.variants.length;
    }

    onAssetChange(variantId: string, event: AssetChange) {
        this.assetChange.emit({
            variantId,
            ...event,
        });
        const index = this.formArray.controls.findIndex(c => c.value.id === variantId);
        this.formArray.at(index).markAsDirty();
    }

    toggleSelectAll() {
        if (this.areAllSelected()) {
            this.selectedVariantIds = [];
        } else {
            this.selectedVariantIds = this.variants.map(v => v.id);
        }
        this.selectionChange.emit(this.selectedVariantIds);
    }

    toggleSelectVariant(variantId: string) {
        const index = this.selectedVariantIds.indexOf(variantId);
        if (-1 < index) {
            this.selectedVariantIds.splice(index, 1);
        } else {
            this.selectedVariantIds.push(variantId);
        }
        this.selectionChange.emit(this.selectedVariantIds);
    }

    optionGroupName(optionGroupId: string): string | undefined {
        const group = this.optionGroups.find(g => g.id === optionGroupId);
        if (group) {
            const translation =
                group?.translations.find(t => t.languageCode === this.activeLanguage) ??
                group.translations[0];
            return translation.name;
        }
    }

    optionName(option: ProductOptionFragment) {
        const translation =
            option.translations.find(t => t.languageCode === this.activeLanguage) ?? option.translations[0];
        return translation.name;
    }

    currentOrPendingFacetValues(variant: ProductVariant.Fragment) {
        return this.pendingFacetValueChanges[variant.id] ?? variant.facetValues;
    }

    selectFacetValue(variant: ProductVariantFragment) {
        return this.modalService
            .fromComponent(ApplyFacetDialogComponent, {
                size: 'md',
                closable: true,
            })
            .subscribe(facetValues => {
                if (facetValues) {
                    const existingFacetValueIds = variant ? variant.facetValues.map(fv => fv.id) : [];
                    const variantFormGroup = this.formArray.controls.find(c => c.value.id === variant.id);
                    if (variantFormGroup) {
                        const uniqueFacetValueIds = unique([
                            ...existingFacetValueIds,
                            ...facetValues.map(fv => fv.id),
                        ]);
                        variantFormGroup.patchValue({ facetValueIds: uniqueFacetValueIds });
                        variantFormGroup.markAsDirty();
                        if (!this.pendingFacetValueChanges[variant.id]) {
                            this.pendingFacetValueChanges[variant.id] = variant.facetValues.slice(0);
                        }
                        this.pendingFacetValueChanges[variant.id].push(...facetValues);
                    }
                    this.changeDetector.markForCheck();
                }
            });
    }

    removeFacetValue(variant: ProductVariant.Fragment, facetValueId: string) {
        const formGroup = this.formGroupMap.get(variant.id);
        if (formGroup) {
            const newValue = (formGroup.value as VariantFormValue).facetValueIds.filter(
                id => id !== facetValueId,
            );
            formGroup.patchValue({
                facetValueIds: newValue,
            });
            formGroup.markAsDirty();
            if (!this.pendingFacetValueChanges[variant.id]) {
                this.pendingFacetValueChanges[variant.id] = variant.facetValues.slice(0);
            }
            this.pendingFacetValueChanges[variant.id] = this.pendingFacetValueChanges[variant.id].filter(
                fv => fv.id !== facetValueId,
            );
        }
    }

    isVariantSelected(variantId: string): boolean {
        return -1 < this.selectedVariantIds.indexOf(variantId);
    }

    editOption(option: ProductVariant.Options) {
        this.modalService
            .fromComponent(UpdateProductOptionDialogComponent, {
                size: 'md',
                locals: {
                    productOption: option,
                    activeLanguage: this.activeLanguage,
                    customFields: this.customOptionFields,
                },
            })
            .subscribe(result => {
                if (result) {
                    this.updateProductOption.emit(result);
                }
            });
    }

    private buildFormGroupMap() {
        this.formGroupMap.clear();
        for (const controlGroup of this.formArray.controls) {
            this.formGroupMap.set(controlGroup.value.id, controlGroup as FormGroup);
        }
        this.changeDetector.markForCheck();
    }

    private getFacetValueIds(id: string): string[] {
        const formValue: VariantFormValue = this.formGroupMap.get(id)?.value;
        return formValue.facetValueIds;
    }
}
