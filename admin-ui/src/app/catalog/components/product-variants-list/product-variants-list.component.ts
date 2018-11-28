import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
} from '@angular/core';
import { FormArray } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FacetValue, FacetWithValues, ProductWithVariants, TaxCategory } from 'shared/generated-types';
import { notNullOrUndefined } from 'shared/shared-utils';

import { flattenFacetValues } from '../../../common/utilities/flatten-facet-values';
import { VariantFormValue } from '../product-detail/product-detail.component';

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
    selectedVariantIds: string[] = [];
    private facetValues: FacetValue.Fragment[];
    private formSubscription: Subscription;

    constructor(private changeDetector: ChangeDetectorRef) {}

    ngOnInit() {
        this.formSubscription = this.formArray.valueChanges.subscribe(() =>
            this.changeDetector.markForCheck(),
        );
    }

    ngOnChanges(changes: SimpleChanges) {
        if ('facets' in changes) {
            this.facetValues = flattenFacetValues(this.facets);
        }
    }

    ngOnDestroy() {
        if (this.formSubscription) {
            this.formSubscription.unsubscribe();
        }
    }

    areAllSelected(): boolean {
        return !!this.variants && this.selectedVariantIds.length === this.variants.length;
    }

    toggleSelectAll() {
        if (this.areAllSelected()) {
            this.selectedVariantIds = [];
        } else {
            this.selectedVariantIds = this.variants.map(v => v.id);
        }
    }

    toggleSelectVariant(variantId: string) {
        const index = this.selectedVariantIds.indexOf(variantId);
        if (-1 < index) {
            this.selectedVariantIds.splice(index, 1);
        } else {
            this.selectedVariantIds.push(variantId);
        }
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

    private getFacetValueIds(index: number): string[] {
        const formValue: VariantFormValue = this.formArray.at(index).value;
        return formValue.facetValueIds;
    }
}
