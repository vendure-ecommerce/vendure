import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DefaultFormComponentId } from '@vendure/common/lib/shared-types';
import { notNullOrUndefined } from '@vendure/common/lib/shared-utils';
import { forkJoin, Observable, of } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';

import { FormInputComponent, InputComponentConfig } from '../../../common/component-registry-types';
import { GetProductVariant, ProductSelectorSearch } from '../../../common/generated-types';
import { DataService } from '../../../data/providers/data.service';

@Component({
    selector: 'vdr-product-selector-form-input',
    templateUrl: './product-selector-form-input.component.html',
    styleUrls: ['./product-selector-form-input.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductSelectorFormInputComponent implements FormInputComponent, OnInit {
    static readonly id: DefaultFormComponentId = 'product-selector-form-input';
    readonly isListInput = true;
    readonly: boolean;
    formControl: FormControl;
    config: InputComponentConfig;
    selection$: Observable<GetProductVariant.ProductVariant[]>;

    constructor(private dataService: DataService) {}

    ngOnInit() {
        this.formControl.setValidators([
            control => {
                if (!control.value || !control.value.length) {
                    return {
                        atLeastOne: { length: control.value.length },
                    };
                }
                return null;
            },
        ]);

        this.selection$ = this.formControl.valueChanges.pipe(
            startWith(this.formControl.value),
            switchMap(value => {
                if (Array.isArray(value) && 0 < value.length) {
                    return forkJoin(
                        value.map(id =>
                            this.dataService.product
                                .getProductVariant(id)
                                .mapSingle(data => data.productVariant),
                        ),
                    );
                }
                return of([]);
            }),
            map(variants => variants.filter(notNullOrUndefined)),
        );
    }

    addProductVariant(product: ProductSelectorSearch.Items) {
        const value = this.formControl.value as string[];
        this.formControl.setValue([...new Set([...value, product.productVariantId])]);
    }

    removeProductVariant(id: string) {
        const value = this.formControl.value as string[];
        this.formControl.setValue(value.filter(_id => _id !== id));
    }
}
