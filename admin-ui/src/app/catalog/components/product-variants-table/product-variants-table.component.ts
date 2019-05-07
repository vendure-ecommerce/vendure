import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormArray } from '@angular/forms';

import { ProductWithVariants } from '../../../common/generated-types';

@Component({
    selector: 'vdr-product-variants-table',
    templateUrl: './product-variants-table.component.html',
    styleUrls: ['./product-variants-table.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductVariantsTableComponent {
    @Input('productVariantsFormArray') formArray: FormArray;
    @Input() variants: ProductWithVariants.Variants[];
    @Input() optionGroups: ProductWithVariants.OptionGroups[];
}
