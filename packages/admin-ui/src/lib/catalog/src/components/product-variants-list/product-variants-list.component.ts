import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
} from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import {
    CustomFieldConfig,
    DataService,
    FacetValue,
    FacetWithValues,
    flattenFacetValues,
    GlobalFlag,
    LanguageCode,
    ModalService,
    ProductOptionFragment,
    ProductVariant,
    ProductWithVariants,
    TaxCategory,
    UpdateProductOptionInput,
} from '@vendure/admin-ui/core';
import { notNullOrUndefined } from '@vendure/common/lib/shared-utils';
import { PaginationInstance } from 'ngx-pagination';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import { AssetChange } from '../product-assets/product-assets.component';
import { VariantFormValue } from '../product-detail/product-detail.component';
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
export class ProductVariantsListComponent implements OnChanges, OnInit, OnDestroy {
    @Input('productVariantsFormArray') formArray: FormArray;
    @Input() variants: ProductWithVariants.Variants[];
    @Input() taxCategories: TaxCategory[];
    @Input() facets: FacetWithValues.Fragment[];
    @Input() optionGroups: ProductWithVariants.OptionGroups[];
    @Input() customFields: CustomFieldConfig[];
    @Input() customOptionFields: CustomFieldConfig[];
    @Input() activeLanguage: LanguageCode;
    @Output() assetChange = new EventEmitter<VariantAssetChange>();
    @Output() selectionChange = new EventEmitter<string[]>();
    @Output() selectFacetValueClick = new EventEmitter<string[]>();
    @Output() updateProductOption = new EventEmitter<UpdateProductOptionInput>();
    selectedVariantIds: string[] = [];
    pagination: PaginationInstance = {
        currentPage: 1,
        itemsPerPage: 10,
    };
    formGroupMap = new Map<string, FormGroup>();
    GlobalFlag = GlobalFlag;
    globalTrackInventory: boolean;
    globalOutOfStockThreshold: number;
    private facetValues: FacetValue.Fragment[];
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

    ngOnChanges(changes: SimpleChanges) {
        if ('facets' in changes && !!changes['facets'].currentValue) {
            this.facetValues = flattenFacetValues(this.facets);
        }
        if ('variants' in changes) {
            if (changes['variants'].currentValue?.length !== changes['variants'].previousValue?.length) {
                this.pagination.currentPage = 1;
            }
        }
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    trackById(index: number, item: ProductWithVariants.Variants) {
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

    getSaleableStockLevel(variant: ProductWithVariants.Variants) {
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
        const index = this.variants.findIndex(v => v.id === variantId);
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

    pendingFacetValues(variant: ProductWithVariants.Variants) {
        if (this.facets) {
            const formFacetValueIds = this.getFacetValueIds(variant.id);
            const variantFacetValueIds = variant.facetValues.map(fv => fv.id);
            return formFacetValueIds
                .filter(x => !variantFacetValueIds.includes(x))
                .map(id => this.facetValues.find(fv => fv.id === id))
                .filter(notNullOrUndefined);
        } else {
            return [];
        }
    }

    existingFacetValues(variant: ProductWithVariants.Variants) {
        const formFacetValueIds = this.getFacetValueIds(variant.id);
        const intersection = [...formFacetValueIds].filter(x =>
            variant.facetValues.map(fv => fv.id).includes(x),
        );
        return intersection
            .map(id => variant.facetValues.find(fv => fv.id === id))
            .filter(notNullOrUndefined);
    }

    removeFacetValue(variant: ProductWithVariants.Variants, facetValueId: string) {
        const formGroup = this.formGroupMap.get(variant.id);
        if (formGroup) {
            const newValue = (formGroup.value as VariantFormValue).facetValueIds.filter(
                id => id !== facetValueId,
            );
            formGroup.patchValue({
                facetValueIds: newValue,
            });
            formGroup.markAsDirty();
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
