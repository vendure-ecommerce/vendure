import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnDestroy,
    OnInit,
} from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { Permission, ProductDetail, ProductVariant } from '@vendure/admin-ui/core';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import { PaginationConfig, SelectedAssets } from '../product-detail/product-detail.component';

@Component({
    selector: 'vdr-product-variants-table',
    templateUrl: './product-variants-table.component.html',
    styleUrls: ['./product-variants-table.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductVariantsTableComponent implements OnInit, OnDestroy {
    @Input('productVariantsFormArray') formArray: FormArray;
    @Input() variants: ProductVariant.Fragment[];
    @Input() paginationConfig: PaginationConfig;
    @Input() channelPriceIncludesTax: boolean;
    @Input() optionGroups: ProductDetail.OptionGroups[];
    @Input() pendingAssetChanges: { [variantId: string]: SelectedAssets };
    formGroupMap = new Map<string, FormGroup>();
    readonly updatePermission = [Permission.UpdateCatalog, Permission.UpdateProduct];
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

    trackByFn(index: number, item: any) {
        if ((item as any).id != null) {
            return (item as any).id;
        } else {
            return index;
        }
    }

    getFeaturedAsset(variant: ProductVariant.Fragment) {
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
