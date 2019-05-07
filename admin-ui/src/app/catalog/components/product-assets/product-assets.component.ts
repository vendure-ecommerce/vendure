import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    HostBinding,
    Input,
    Output,
} from '@angular/core';
import { unique } from 'shared/unique';

import { Asset } from '../../../common/generated-types';
import { ModalService } from '../../../shared/providers/modal/modal.service';
import { AssetPickerDialogComponent } from '../asset-picker-dialog/asset-picker-dialog.component';

export interface AssetChange {
    assetIds: string[];
    featuredAssetId: string | undefined;
}

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
    @HostBinding('class.compact')
    @Input()
    compact = false;
    @Output() change = new EventEmitter<AssetChange>();

    constructor(private modalService: ModalService, private changeDetector: ChangeDetectorRef) {}

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
                    this.emitChangeEvent(this.assets, this.featuredAsset);
                    this.changeDetector.markForCheck();
                }
            });
    }

    setAsFeatured(asset: Asset) {
        this.featuredAsset = asset;
        this.emitChangeEvent(this.assets, asset);
    }

    isFeatured(asset: Asset): boolean {
        return !!this.featuredAsset && this.featuredAsset.id === asset.id;
    }

    removeAsset(asset: Asset) {
        this.assets = this.assets.filter(a => a.id !== asset.id);
        if (this.featuredAsset && this.featuredAsset.id === asset.id) {
            this.featuredAsset = this.assets.length > 0 ? this.assets[0] : undefined;
        }
        this.emitChangeEvent(this.assets, this.featuredAsset);
    }

    private emitChangeEvent(assets: Asset[], featuredAsset: Asset | undefined) {
        this.change.emit({
            assetIds: assets.map(a => a.id),
            featuredAssetId: featuredAsset && featuredAsset.id,
        });
    }
}
