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
import { FormArray, FormGroup } from '@angular/forms';
import { flattenFacetValues, ProductWithVariants } from '@vendure/admin-ui/core';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import { SelectedAssets } from '../product-detail/product-detail.component';

@Component({
    selector: 'vdr-product-variants-table',
    templateUrl: './product-variants-table.component.html',
    styleUrls: ['./product-variants-table.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductVariantsTableComponent implements OnInit, OnChanges, OnDestroy {
    @Input('productVariantsFormArray') formArray: FormArray;
    @Input() variants: ProductWithVariants.Variants[];
    @Input() channelPriceIncludesTax: boolean;
    @Input() optionGroups: ProductWithVariants.OptionGroups[];
    @Input() pendingAssetChanges: { [variantId: string]: SelectedAssets };
    formGroupMap = new Map<string, FormGroup>();
    variantListPrice: { [variantId: string]: number } = {};
    private subscription: Subscription;

    constructor(private changeDetector: ChangeDetectorRef) {}

    ngOnInit() {
        this.subscription = this.formArray.valueChanges
            .pipe(
                map(value => value.length),
                debounceTime(1),
                distinctUntilChanged(),
            )
            .subscribe(() => {
                this.buildFormGroupMap();
            });

        this.buildFormGroupMap();
    }

    ngOnChanges(changes: SimpleChanges) {
        if ('variants' in changes) {
            if (this.channelPriceIncludesTax != null && Object.keys(this.variantListPrice).length === 0) {
                this.buildVariantListPrices(this.formArray.value);
            }
        }
        if ('channelPriceIncludesTax' in changes) {
            this.buildVariantListPrices(this.formArray.value);
        }
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    getFeaturedAsset(variant: ProductWithVariants.Variants) {
        return this.pendingAssetChanges[variant.id]?.featuredAsset || variant.featuredAsset;
    }

    optionGroupName(optionGroupId: string): string | undefined {
        const group = this.optionGroups.find(g => g.id === optionGroupId);
        return group && group.name;
    }

    updateVariantListPrice(price, variantId: string, group: FormGroup) {
        // Why do this and not just use a conditional `formControlName` or `formControl`
        // binding in the template? It breaks down when switching between Channels and
        // the values no longer get updated. There seem to some lifecycle/memory-clean-up
        // issues with Angular forms at the moment, which will hopefully be fixed soon.
        // See https://github.com/angular/angular/issues/20007
        this.variantListPrice[variantId] = price;
        const controlName = this.channelPriceIncludesTax ? 'priceWithTax' : 'price';
        const control = group.get(controlName);
        if (control) {
            control.setValue(price);
            control.markAsDirty();
        }
    }

    private buildFormGroupMap() {
        this.formGroupMap.clear();
        for (const controlGroup of this.formArray.controls) {
            this.formGroupMap.set(controlGroup.value.id, controlGroup as FormGroup);
        }
        this.changeDetector.markForCheck();
    }

    private buildVariantListPrices(variants?: ProductWithVariants.Variants[]) {
        if (variants) {
            this.variantListPrice = variants.reduce((prices, v) => {
                return { ...prices, [v.id]: this.channelPriceIncludesTax ? v.priceWithTax : v.price };
            }, {});
        }
    }
}
