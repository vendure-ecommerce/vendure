import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';
import { AdjustmentSource, ProductWithVariants } from 'shared/generated-types';

@Component({
    selector: 'vdr-product-variants-list',
    templateUrl: './product-variants-list.component.html',
    styleUrls: ['./product-variants-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductVariantsListComponent {
    @Input('productVariantsFormArray') formArray: FormArray;
    @Input() variants: ProductWithVariants.Variants[];
    @Input() taxCategories: AdjustmentSource.Fragment[];
    selectedVariantIds: string[] = [];

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

    isVariantSelected(variantId: string): boolean {
        return -1 < this.selectedVariantIds.indexOf(variantId);
    }

    /**
     * Set the priceBeforeTax value whenever the price is changed based on the current taxRate.
     */
    setPreTaxPrice(index: number) {
        const { preTaxPriceControl, postTaxPriceControl, taxRate } = this.getPriceControlsAndTaxRate(index);
        preTaxPriceControl.setValue(Math.round(postTaxPriceControl.value / (1 + taxRate / 100)));
    }

    /**
     * Set the price (including tax) value whenever the priceBeforeTax or the taxRate is changed.
     */
    setPrice(index: number) {
        const { preTaxPriceControl, postTaxPriceControl, taxRate } = this.getPriceControlsAndTaxRate(index);
        postTaxPriceControl.setValue(Math.round(preTaxPriceControl.value * (1 + taxRate / 100)));
    }

    private getPriceControlsAndTaxRate(
        index: number,
    ): {
        preTaxPriceControl: FormControl;
        postTaxPriceControl: FormControl;
        taxRate: number;
    } {
        const preTaxPriceControl = this.formArray.get([index, 'priceBeforeTax']);
        const postTaxPriceControl = this.formArray.get([index, 'price']);
        const taxCategoryIdControl = this.formArray.get([index, 'taxCategoryId']);
        if (preTaxPriceControl && postTaxPriceControl && taxCategoryIdControl) {
            const taxCategory = this.taxCategories.find(tc => tc.id === taxCategoryIdControl.value);
            if (taxCategory) {
                const taxRate = Number(taxCategory.actions[0].args[0].value);
                return {
                    preTaxPriceControl: preTaxPriceControl as FormControl,
                    postTaxPriceControl: postTaxPriceControl as FormControl,
                    taxRate,
                };
            }
        }
        throw new Error(`Could not find the corresponding form controls.`);
    }
}
