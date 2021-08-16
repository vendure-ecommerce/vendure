import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ViewportRuler } from '@angular/cdk/overlay';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    HostBinding,
    Input,
    Optional,
    Output,
} from '@angular/core';
import {
    Asset,
    AssetPickerDialogComponent,
    AssetPreviewDialogComponent,
    ModalService,
    Permission,
} from '@vendure/admin-ui/core';
import { unique } from '@vendure/common/lib/unique';

import { CollectionDetailComponent } from '../collection-detail/collection-detail.component';

export interface AssetChange {
    assets: Asset[];
    featuredAsset: Asset | undefined;
}

/**
 * A component which displays the Assets associated with a product, and allows assets to be removed and
 * added, and for the featured asset to be set.
 *
 * Note: rather complex code for drag drop is due to a limitation of the default CDK implementation
 * which is addressed by a work-around from here: https://github.com/angular/components/issues/13372#issuecomment-483998378
 */
@Component({
    selector: 'vdr-product-assets',
    templateUrl: './product-assets.component.html',
    styleUrls: ['./product-assets.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductAssetsComponent {
    @Input('assets') set assetsSetter(val: Asset[]) {
        // create a new non-readonly array of assets
        this.assets = val.slice();
    }

    @Input() featuredAsset: Asset | undefined;
    @HostBinding('class.compact')
    @Input()
    compact = false;
    @Output() change = new EventEmitter<AssetChange>();

    public assets: Asset[] = [];

    private readonly updateCollectionPermissions = [Permission.UpdateCatalog, Permission.UpdateCollection];
    private readonly updateProductPermissions = [Permission.UpdateCatalog, Permission.UpdateProduct];

    get updatePermissions(): Permission[] {
        if (this.collectionDetailComponent) {
            return this.updateCollectionPermissions;
        } else {
            return this.updateProductPermissions;
        }
    }

    constructor(
        private modalService: ModalService,
        private changeDetector: ChangeDetectorRef,
        private viewportRuler: ViewportRuler,
        @Optional() private collectionDetailComponent?: CollectionDetailComponent,
    ) {}

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

    previewAsset(asset: Asset) {
        this.modalService
            .fromComponent(AssetPreviewDialogComponent, {
                size: 'xl',
                closable: true,
                locals: { asset },
            })
            .subscribe();
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
            assets,
            featuredAsset,
        });
    }

    dropListDropped(event: CdkDragDrop<number>) {
        moveItemInArray(this.assets, event.previousContainer.data, event.container.data);
        this.emitChangeEvent(this.assets, this.featuredAsset);
    }
}
