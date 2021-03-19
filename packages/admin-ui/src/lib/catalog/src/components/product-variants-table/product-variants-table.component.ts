import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnDestroy,
    OnInit,
} from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { ProductWithVariants } from '@vendure/admin-ui/core';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import { SelectedAssets } from '../product-detail/product-detail.component';

@Component({
    selector: 'vdr-product-variants-table',
    templateUrl: './product-variants-table.component.html',
    styleUrls: ['./product-variants-table.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductVariantsTableComponent implements OnInit, OnDestroy {
    @Input('productVariantsFormArray') formArray: FormArray;
    @Input() variants: ProductWithVariants.Variants[];
    @Input() channelPriceIncludesTax: boolean;
    @Input() optionGroups: ProductWithVariants.OptionGroups[];
    @Input() pendingAssetChanges: { [variantId: string]: SelectedAssets };
    formGroupMap = new Map<string, FormGroup>();
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

    private buildFormGroupMap() {
        this.formGroupMap.clear();
        for (const controlGroup of this.formArray.controls) {
            this.formGroupMap.set(controlGroup.value.id, controlGroup as FormGroup);
        }
        this.changeDetector.markForCheck();
    }
}
