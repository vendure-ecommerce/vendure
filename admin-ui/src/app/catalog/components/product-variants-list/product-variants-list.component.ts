import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormArray } from '@angular/forms';

import { ProductWithVariants_variants } from '../../../data/types/gql-generated-types';

@Component({
    selector: 'vdr-product-variants-list',
    templateUrl: './product-variants-list.component.html',
    styleUrls: ['./product-variants-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductVariantsListComponent {
    @Input('productVariantsFormArray') formArray: FormArray;
    @Input() variants: ProductWithVariants_variants[];
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
}
