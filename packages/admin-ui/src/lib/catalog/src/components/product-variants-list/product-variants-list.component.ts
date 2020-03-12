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
import { FormArray } from '@angular/forms';
import { notNullOrUndefined } from '@vendure/common/lib/shared-utils';
import { Subscription } from 'rxjs';

import {
    CustomFieldConfig,
    FacetValue,
    FacetWithValues,
    ProductVariant,
    ProductWithVariants,
    TaxCategory,
    UpdateProductOptionInput,
} from '@vendure/admin-ui/core';
import { flattenFacetValues } from '@vendure/admin-ui/core';
import { ModalService } from '@vendure/admin-ui/core';
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
    @Output() assetChange = new EventEmitter<VariantAssetChange>();
    @Output() selectionChange = new EventEmitter<string[]>();
    @Output() selectFacetValueClick = new EventEmitter<string[]>();
    @Output() updateProductOption = new EventEmitter<UpdateProductOptionInput>();
    selectedVariantIds: string[] = [];
    private facetValues: FacetValue.Fragment[];
    private formSubscription: Subscription;

    constructor(private changeDetector: ChangeDetectorRef, private modalService: ModalService) {}

    ngOnInit() {
        this.formSubscription = this.formArray.valueChanges.subscribe(() =>
            this.changeDetector.markForCheck(),
        );
    }

    ngOnChanges(changes: SimpleChanges) {
        if ('facets' in changes && !!changes['facets'].currentValue) {
            this.facetValues = flattenFacetValues(this.facets);
        }
    }

    ngOnDestroy() {
        if (this.formSubscription) {
            this.formSubscription.unsubscribe();
        }
    }

    getTaxCategoryName(index: number): string {
        const control = this.formArray.at(index).get(['taxCategoryId']);
        if (control && this.taxCategories) {
            const match = this.taxCategories.find(t => t.id === control.value);
            return match ? match.name : '';
        }
        return '';
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
        return group && group.name;
    }

    pendingFacetValues(index: number) {
        if (this.facets) {
            const formFacetValueIds = this.getFacetValueIds(index);
            const variantFacetValueIds = this.variants[index].facetValues.map(fv => fv.id);
            return formFacetValueIds
                .filter(x => !variantFacetValueIds.includes(x))
                .map(id => this.facetValues.find(fv => fv.id === id))
                .filter(notNullOrUndefined);
        } else {
            return [];
        }
    }

    existingFacetValues(index: number) {
        const variant = this.variants[index];
        const formFacetValueIds = this.getFacetValueIds(index);
        const intersection = [...formFacetValueIds].filter(x =>
            variant.facetValues.map(fv => fv.id).includes(x),
        );
        return intersection
            .map(id => variant.facetValues.find(fv => fv.id === id))
            .filter(notNullOrUndefined);
    }

    removeFacetValue(index: number, facetValueId: string) {
        const formGroup = this.formArray.at(index);
        const newValue = (formGroup.value as VariantFormValue).facetValueIds.filter(
            id => id !== facetValueId,
        );
        formGroup.patchValue({
            facetValueIds: newValue,
        });
        formGroup.markAsDirty();
    }

    isVariantSelected(variantId: string): boolean {
        return -1 < this.selectedVariantIds.indexOf(variantId);
    }

    customFieldIsSet(index: number, name: string): boolean {
        return !!this.formArray.at(index).get(['customFields', name]);
    }

    editOption(option: ProductVariant.Options) {
        this.modalService
            .fromComponent(UpdateProductOptionDialogComponent, {
                size: 'md',
                locals: {
                    productOption: option,
                },
            })
            .subscribe(result => {
                if (result) {
                    this.updateProductOption.emit(result);
                }
            });
    }

    private getFacetValueIds(index: number): string[] {
        const formValue: VariantFormValue = this.formArray.at(index).value;
        return formValue.facetValueIds;
    }
}
