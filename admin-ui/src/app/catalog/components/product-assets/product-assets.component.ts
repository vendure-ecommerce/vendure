import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    Output,
} from '@angular/core';
import { Asset } from 'shared/generated-types';
import { unique } from 'shared/unique';

import { ModalService } from '../../../shared/providers/modal/modal.service';
import { AssetPickerDialogComponent } from '../asset-picker-dialog/asset-picker-dialog.component';

/**
 * A component which displays the Assets associated with a product, and allows assets to be removed and
 * added, and for the featured asset to be set.
 */
@Component({
    selector: 'vdr-product-assets',
    templateUrl: './product-assets.component.html',
    styleUrls: ['./product-assets.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductAssetsComponent {
    @Input() assets: Asset[] = [];
    @Input() featuredAsset: Asset | undefined;
    @Output() change = new EventEmitter<{ assetIds: string[]; featuredAssetId: string }>();

    constructor(private modalService: ModalService, private changeDetector: ChangeDetectorRef) {}

    nonFeaturedAssets(): Asset[] {
        const featuredAssetId = this.featuredAsset && this.featuredAsset.id;
        return this.assets.filter(a => a.id !== featuredAssetId);
    }

    selectAssets() {
        this.modalService
            .fromComponent(AssetPickerDialogComponent, {
                size: 'xl',
            })
            .subscribe(result => {
                if (result && result.length) {
                    this.assets = unique(this.assets.concat(result), 'id');
                    if (!this.featuredAsset) {
                        this.featuredAsset = result[0];
                    }
                    this.changeDetector.markForCheck();
                }
            });
    }

    setAsFeatured(asset: Asset) {
        this.featuredAsset = asset;
    }

    isFeatured(asset: Asset): boolean {
        return !!this.featuredAsset && this.featuredAsset.id === asset.id;
    }

    removeAsset(asset: Asset) {
        this.assets = this.assets.filter(a => a.id !== asset.id);
        if (this.featuredAsset && this.featuredAsset.id === asset.id) {
            this.featuredAsset = this.assets.length > 0 ? this.assets[0] : undefined;
        }
    }
}
